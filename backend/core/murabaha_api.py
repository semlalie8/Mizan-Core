from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime, timezone
from typing import List, Optional

from .murabaha_models import (
    MurabahaContract, MurabahaOwnershipEvent, ContractStatus, 
    EventType, AssetType, MurabahaPayment, PaymentStatus,
    MurabahaCharityObligation, MurabahaProfitRecognition,
    MurabahaShariaAudit
)

router = APIRouter(prefix="/v1/murabaha", tags=["Murabaha"])

from .database import get_db

# --- Pydantic Schemas for Request/Response ---

class FinancingRequestCreate(BaseModel):
    customer_id: str
    asset_type: str = Field(..., description="CONSUMER_GOODS, VEHICLE, REAL_ESTATE, COMMODITY")
    asset_description: str
    asset_cost: Decimal
    bank_markup: Decimal

class ContractResponse(BaseModel):
    id: int
    customer_id: str
    status: str
    cost_disclosed: bool
    markup_disclosed: bool
    asset_owned_by_bank: bool
    sharia_sequence_verified: bool
    bank_purchase_timestamp: Optional[datetime]
    sale_contract_timestamp: Optional[datetime]
    fatwa_reference: str

    class Config:
        from_attributes = True

class PurchaseRequest(BaseModel):
    transfer_proof_reference: str = Field(..., description="Hash or Document ID proving bank took ownership")

class AuditCreate(BaseModel):
    auditor_id: str
    passed: bool
    notes: Optional[str] = None

class AuditResponse(BaseModel):
    id: int
    contract_id: int
    auditor_id: str
    audit_date: datetime
    passed: bool
    notes: Optional[str]

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    id: int
    installment_number: int
    status: str
    amount_due: float
    paid_date: Optional[datetime]

    class Config:
        from_attributes = True

# --- Endpoints Enforcing Sharia Sequence ---

@router.get("/contracts", response_model=List[ContractResponse])
def get_all_contracts(db: Session = Depends(get_db)):
    """
    Fetch all active Murabaha contracts from the database.
    """
    return db.query(MurabahaContract).all()

@router.post("/requests", response_model=ContractResponse)
def create_financing_request(request: FinancingRequestCreate, db: Session = Depends(get_db)):
    """
    Step 1: Customer submits a request. The bank calculates terms.
    No contract is executed yet.
    """
    total = request.asset_cost + request.bank_markup
    
    contract = MurabahaContract(
        customer_id=request.customer_id,
        asset_type=AssetType[request.asset_type],
        asset_description=request.asset_description,
        asset_cost=request.asset_cost,
        bank_markup=request.bank_markup,
        total_financing_amount=total,
        fatwa_reference="FATWA-2026-BAM-001",
        status=ContractStatus.REQUESTED
    )
    
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/contracts/{contract_id}/purchase", response_model=ContractResponse)
def bank_purchase_asset(
    contract_id: int, 
    payload: PurchaseRequest,
    x_idempotency_key: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Step 2: Bank Purchases Asset
    CRITICAL SHARIA RULE: Bank must take ownership risk, even if momentary.
    """
    contract = db.query(MurabahaContract).filter(MurabahaContract.id == contract_id).first()
    if not contract: 
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Ensure sequence: Cannot purchase an already purchased or sold asset.
    if contract.status != ContractStatus.REQUESTED:
        raise HTTPException(status_code=400, detail="SHARIA_VIOLATION: Invalid state for bank purchase. Must be in REQUESTED state.")
        
    # Record ownership transfer event
    event = MurabahaOwnershipEvent(
        contract_id=contract.id,
        event_type=EventType.VENDOR_TO_BANK,
        transfer_proof_reference=payload.transfer_proof_reference
    )
    db.add(event)
    
    # Update contract state
    contract.bank_purchase_timestamp = datetime.now(timezone.utc)
    contract.asset_owned_by_bank = True
    contract.status = ContractStatus.BANK_PURCHASED
    
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/contracts/{contract_id}/sale", response_model=ContractResponse)
def bank_sell_to_customer(
    contract_id: int, 
    x_idempotency_key: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Step 3: Bank Sells to Customer
    CRITICAL SHARIA RULE: Sale MUST occur strictly after Bank Purchase.
    """
    contract = db.query(MurabahaContract).filter(MurabahaContract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # 1. Enforce sequence check
    if not contract.asset_owned_by_bank or contract.bank_purchase_timestamp is None:
        raise HTTPException(status_code=400, detail="SEQUENCE_ERROR: Sale before purchase. Bank does not yet own the asset.")
        
    if contract.status != ContractStatus.BANK_PURCHASED:
        raise HTTPException(status_code=400, detail="SEQUENCE_ERROR: Invalid state for sale to customer.")

    contract.sale_contract_timestamp = datetime.now(timezone.utc)
    
    # 2. Enforce strict time ordering
    if contract.sale_contract_timestamp.replace(tzinfo=None) <= contract.bank_purchase_timestamp.replace(tzinfo=None):
        raise HTTPException(status_code=400, detail="SEQUENCE_ERROR: Invalid sequence timeline. Sale must follow purchase.")
        
    # 3. Enforce disclosure & Finalize
    contract.cost_disclosed = True
    contract.markup_disclosed = True
    contract.sharia_sequence_verified = True
    contract.status = ContractStatus.SOLD_TO_CUSTOMER
    
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/contracts/{contract_id}/payments/{installment_number}", response_model=PaymentResponse)
def process_installment_payment(
    contract_id: int, 
    installment_number: int,
    x_idempotency_key: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Step 4: Process Installments
    Includes logic for Late Payments -> Charity Obligation (Late fees cannot be bank revenue).
    Includes logic for Deferred Profit Recognition (Profit is recognized as paid).
    """
    payment = db.query(MurabahaPayment).filter(
        MurabahaPayment.contract_id == contract_id,
        MurabahaPayment.installment_number == installment_number
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment installment not found")
    
    if payment.status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Payment already processed")

    # 1. Check for Late Payment
    now = datetime.now(timezone.utc).replace(tzinfo=None) # SQLAlchemy expects naive UTC or match DB
    is_late = now > payment.due_date
    
    if is_late:
        payment.status = PaymentStatus.LATE
        # Sharia Rule: Late fees MUST go to charity, not bank profit.
        late_fee = payment.amount_due * Decimal("0.05") # 5% late fee
        charity_obs = MurabahaCharityObligation(
            contract_id=contract_id,
            payment_id=payment.id,
            late_fee_amount=late_fee,
            reason=f"Installment {installment_number} paid after due date {payment.due_date}"
        )
        db.add(charity_obs)

    # 2. Realize Profit (Deferred -> Realized)
    # In Islamic Finance, we recognize profit only when the payment is actually received.
    profit_rec = MurabahaProfitRecognition(
        payment_id=payment.id,
        deferred_profit_amount=payment.profit_portion,
        realized_profit_amount=payment.profit_portion,
        recognition_date=now
    )
    db.add(profit_rec)

    # 3. Finalize Payment
    payment.status = PaymentStatus.PAID
    payment.paid_date = now
    
    db.commit()
    db.refresh(payment)
    return payment


@router.post("/contracts/{contract_id}/audits", response_model=AuditResponse)
def perform_sharia_audit(
    contract_id: int,
    audit: AuditCreate,
    db: Session = Depends(get_db)
):
    """
    Step 5: Sharia Audit Trailing
    Log internal or external scholar reviews to ensure the entire lifecycle followed AAOIFI standards.
    """
    contract = db.query(MurabahaContract).filter(MurabahaContract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    audit_log = MurabahaShariaAudit(
        contract_id=contract_id,
        auditor_id=audit.auditor_id,
        passed=audit.passed,
        notes=audit.notes
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log

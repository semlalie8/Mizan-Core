from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime, timezone
from typing import List, Optional

from .takaful_models import (
    TakafulPool, TakafulPolicy, TakafulClaim,
    PoolStatus, PolicyStatus, ClaimStatus
)

router = APIRouter(prefix="/v1/takaful", tags=["Takaful"])

from .database import get_db

class PoolResponse(BaseModel):
    id: int
    name: str
    status: str
    total_funds: float

    class Config:
        from_attributes = True

class PolicyCreate(BaseModel):
    customer_id: str
    coverage_amount: Decimal
    contribution_amount: Decimal

class PolicyResponse(BaseModel):
    id: int
    pool_id: int
    customer_id: str
    coverage_amount: float
    contribution_amount: float
    status: str

    class Config:
        from_attributes = True

@router.get("/pools", response_model=List[PoolResponse])
def get_takaful_pools(db: Session = Depends(get_db)):
    """
    Fetch all active Takaful (Mutual Guarantee) pools from the database.
    """
    return db.query(TakafulPool).all()

@router.post("/pools/{pool_id}/join", response_model=PolicyResponse)
def join_takaful_pool(
    pool_id: int, 
    request: PolicyCreate,
    x_idempotency_key: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    A participant donates (Tabarru') to the mutual pool to get coverage.
    This fulfills the 'Mutual Responsibility' (Takaful) principle.
    """
    pool = db.query(TakafulPool).filter(TakafulPool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Takaful pool not found")

    # 1. Create the policy
    policy = TakafulPolicy(
        pool_id=pool_id,
        customer_id=request.customer_id,
        coverage_amount=request.coverage_amount,
        contribution_amount=request.contribution_amount,
        status=PolicyStatus.ACTIVE,
        end_date=datetime.now(timezone.utc).replace(year=datetime.now().year + 1) # 1 year coverage
    )
    db.add(policy)
    
    # 2. Update pool funds (Simplified: in production this would be an event-driven ledger)
    pool.total_funds += request.contribution_amount
    
    db.commit()
    db.refresh(policy)
    return policy

@router.post("/policies/{policy_id}/claims")
def submit_claim(
    policy_id: int,
    amount_requested: float,
    incident_description: str,
    x_idempotency_key: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Submit a claim against the mutual pool.
    The claim will be reviewed by the pool operator to ensure compliance with pool rules.
    """
    policy = db.query(TakafulPolicy).filter(TakafulPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    claim = TakafulClaim(
        policy_id=policy_id,
        pool_id=policy.pool_id,
        amount_requested=Decimal(str(amount_requested)),
        incident_description=incident_description,
        status=ClaimStatus.SUBMITTED
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    return claim

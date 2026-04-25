from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from .database import Base

class ContractStatus(enum.Enum):
    REQUESTED = "REQUESTED"
    CUSTOMER_ACCEPTED = "CUSTOMER_ACCEPTED"
    BANK_PURCHASED = "BANK_PURCHASED"
    SOLD_TO_CUSTOMER = "SOLD_TO_CUSTOMER"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    DEFAULTED = "DEFAULTED"

class AssetType(enum.Enum):
    CONSUMER_GOODS = "CONSUMER_GOODS"
    VEHICLE = "VEHICLE"
    REAL_ESTATE = "REAL_ESTATE"
    COMMODITY = "COMMODITY" # For Tawarruq

class MurabahaContract(Base):
    __tablename__ = 'murabaha_contracts'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True, nullable=False)
    asset_type = Column(Enum(AssetType), nullable=False)
    asset_description = Column(String, nullable=False)
    
    # Financial Terms
    asset_cost = Column(Numeric(12, 2), nullable=False)
    bank_markup = Column(Numeric(12, 2), nullable=False)
    total_financing_amount = Column(Numeric(12, 2), nullable=False)
    
    # Sharia Compliance Disclosures
    cost_disclosed = Column(Boolean, default=False, nullable=False)
    markup_disclosed = Column(Boolean, default=False, nullable=False)
    asset_owned_by_bank = Column(Boolean, default=False, nullable=False)
    
    # Timestamps for Sequencing Validation (CRITICAL)
    bank_purchase_timestamp = Column(DateTime, nullable=True)
    sale_contract_timestamp = Column(DateTime, nullable=True)
    
    fatwa_reference = Column(String, nullable=False)
    sharia_sequence_verified = Column(Boolean, default=False, nullable=False)
    
    status = Column(Enum(ContractStatus), default=ContractStatus.REQUESTED, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    ownership_events = relationship("MurabahaOwnershipEvent", back_populates="contract")
    payments = relationship("MurabahaPayment", back_populates="contract")
    charity_obligations = relationship("MurabahaCharityObligation", back_populates="contract")
    audits = relationship("MurabahaShariaAudit", back_populates="contract")


class EventType(enum.Enum):
    VENDOR_TO_BANK = "VENDOR_TO_BANK"
    BANK_TO_CUSTOMER = "BANK_TO_CUSTOMER"

class MurabahaOwnershipEvent(Base):
    """
    Append-only event sourcing table for tracking the exact transfer of ownership.
    This provides the necessary audit trail to prove the bank took ownership risk.
    """
    __tablename__ = 'murabaha_ownership_events'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('murabaha_contracts.id'), nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    
    # Proof of transfer (e.g., receipt hash, blockchain txn, bill of lading)
    transfer_proof_reference = Column(String, nullable=False)
    
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    contract = relationship("MurabahaContract", back_populates="ownership_events")


class PaymentStatus(enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    LATE = "LATE"

class MurabahaPayment(Base):
    __tablename__ = 'murabaha_payments'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('murabaha_contracts.id'), nullable=False)
    
    installment_number = Column(Integer, nullable=False)
    due_date = Column(DateTime, nullable=False)
    amount_due = Column(Numeric(12, 2), nullable=False)
    
    principal_portion = Column(Numeric(12, 2), nullable=False)
    profit_portion = Column(Numeric(12, 2), nullable=False)
    
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    paid_date = Column(DateTime, nullable=True)
    
    contract = relationship("MurabahaContract", back_populates="payments")


class MurabahaProfitRecognition(Base):
    """
    Tracks deferred profit that is realized upon payment. 
    In Islamic finance, profit cannot be recognized until it is earned/realized.
    """
    __tablename__ = 'murabaha_profit_recognition'
    
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey('murabaha_payments.id'), nullable=False)
    
    deferred_profit_amount = Column(Numeric(12, 2), nullable=False)
    realized_profit_amount = Column(Numeric(12, 2), nullable=False)
    
    recognition_date = Column(DateTime, default=datetime.utcnow, nullable=False)


class MurabahaCharityObligation(Base):
    """
    Sharia rule: Late fees cannot be recognized as revenue. They must be tracked
    and donated to charity. No compounding of late payments allowed.
    """
    __tablename__ = 'murabaha_charity_obligations'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('murabaha_contracts.id'), nullable=False)
    payment_id = Column(Integer, ForeignKey('murabaha_payments.id'), nullable=False)
    
    late_fee_amount = Column(Numeric(12, 2), nullable=False)
    reason = Column(String, nullable=False) # e.g., "30 days past due"
    
    is_donated = Column(Boolean, default=False, nullable=False)
    donation_date = Column(DateTime, nullable=True)
    charity_receipt_reference = Column(String, nullable=True)
    
    contract = relationship("MurabahaContract", back_populates="charity_obligations")


class MurabahaShariaAudit(Base):
    """
    Logs of scholar reviews or automated system checks validating the sequence.
    """
    __tablename__ = 'murabaha_sharia_audits'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('murabaha_contracts.id'), nullable=False)
    
    auditor_id = Column(String, nullable=False) # ID of scholar or 'SYSTEM_AUTO_AUDIT'
    audit_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    passed = Column(Boolean, nullable=False)
    notes = Column(String, nullable=True)
    
    contract = relationship("MurabahaContract", back_populates="audits")

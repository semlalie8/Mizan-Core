from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from .database import Base

class PoolStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    DEFICIT = "DEFICIT" # Needs Qard Hasan (interest-free loan) from operator

class TakafulPool(Base):
    """
    The communal risk pool (Tabarru' fund) where participants donate to guarantee each other.
    """
    __tablename__ = 'takaful_pools'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(Enum(PoolStatus), default=PoolStatus.ACTIVE, nullable=False)
    
    total_funds = Column(Numeric(15, 2), default=0.0, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    policies = relationship("TakafulPolicy", back_populates="pool")
    claims = relationship("TakafulClaim", back_populates="pool")


class PolicyStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"

class TakafulPolicy(Base):
    """
    A participant's agreement to contribute to the pool and receive coverage.
    """
    __tablename__ = 'takaful_policies'
    
    id = Column(Integer, primary_key=True, index=True)
    pool_id = Column(Integer, ForeignKey('takaful_pools.id'), nullable=False)
    customer_id = Column(String, index=True, nullable=False)
    
    coverage_amount = Column(Numeric(12, 2), nullable=False)
    contribution_amount = Column(Numeric(12, 2), nullable=False) # Tabarru' donation
    
    start_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    status = Column(Enum(PolicyStatus), default=PolicyStatus.ACTIVE, nullable=False)
    
    pool = relationship("TakafulPool", back_populates="policies")
    claims = relationship("TakafulClaim", back_populates="policy")


class ClaimStatus(enum.Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PAID = "PAID"

class TakafulClaim(Base):
    """
    A claim against the communal pool by a participant.
    """
    __tablename__ = 'takaful_claims'
    
    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey('takaful_policies.id'), nullable=False)
    pool_id = Column(Integer, ForeignKey('takaful_pools.id'), nullable=False)
    
    amount_requested = Column(Numeric(12, 2), nullable=False)
    amount_approved = Column(Numeric(12, 2), nullable=True)
    
    incident_description = Column(String, nullable=False)
    status = Column(Enum(ClaimStatus), default=ClaimStatus.SUBMITTED, nullable=False)
    
    submitted_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_date = Column(DateTime, nullable=True)
    
    policy = relationship("TakafulPolicy", back_populates="claims")
    pool = relationship("TakafulPool", back_populates="claims")

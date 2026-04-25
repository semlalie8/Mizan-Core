from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
import enum

from .database import Base

class MusharakaType(enum.Enum):
    PERMANENT = "PERMANENT"
    DIMINISHING = "DIMINISHING" # Musharaka Mutanaqisa

class MusharakaStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    DISSOLVED = "DISSOLVED"

class MusharakaContract(Base):
    """
    Musharaka: A partnership where all parties contribute capital and share profits/losses.
    """
    __tablename__ = 'musharaka_contracts'
    
    id = Column(Integer, primary_key=True, index=True)
    musharaka_type = Column(Enum(MusharakaType), nullable=False)
    
    total_capital = Column(Numeric(15, 2), nullable=False)
    asset_description = Column(String, nullable=False)
    
    status = Column(Enum(MusharakaStatus), default=MusharakaStatus.ACTIVE)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    partners = relationship("MusharakaPartner", back_populates="contract")

class MusharakaPartner(Base):
    __tablename__ = 'musharaka_partners'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('musharaka_contracts.id'), nullable=False)
    
    partner_id = Column(String, nullable=False)
    capital_contribution = Column(Numeric(15, 2), nullable=False)
    equity_percentage = Column(Float, nullable=False)
    
    # Sharia Rule: Losses must be shared strictly according to capital contribution.
    # Profits can be shared according to agreement.
    profit_share_percentage = Column(Float, nullable=False)
    
    contract = relationship("MusharakaContract", back_populates="partners")

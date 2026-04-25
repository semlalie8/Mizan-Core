from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
import enum

from .database import Base

class MudarabaStatus(enum.Enum):
    PROPOSAL = "PROPOSAL"
    ACTIVE = "ACTIVE"
    LIQUIDATED = "LIQUIDATED"
    TERMINATED = "TERMINATED"

class MudarabaContract(Base):
    """
    Mudaraba: A partnership where one party provides capital (Rab-al-Maal) 
    and the other provides expertise (Mudarib).
    """
    __tablename__ = 'mudaraba_contracts'
    
    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(String, index=True, nullable=False) # Rab-al-Maal
    manager_id = Column(String, index=True, nullable=False)  # Mudarib
    
    initial_capital = Column(Numeric(15, 2), nullable=False)
    
    # Profit Sharing Ratio (e.g., 0.7 for Investor, 0.3 for Manager)
    investor_profit_ratio = Column(Float, nullable=False)
    manager_profit_ratio = Column(Float, nullable=False)
    
    status = Column(Enum(MudarabaStatus), default=MudarabaStatus.PROPOSAL)
    
    # Sharia Rule: Losses are borne solely by the capital provider (Investor)
    # unless there is negligence by the Manager.
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    distributions = relationship("MudarabaDistribution", back_populates="contract")

class MudarabaDistribution(Base):
    __tablename__ = 'mudaraba_distributions'
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey('mudaraba_contracts.id'), nullable=False)
    
    total_profit = Column(Numeric(15, 2), nullable=False)
    investor_share = Column(Numeric(15, 2), nullable=False)
    manager_share = Column(Numeric(15, 2), nullable=False)
    
    distribution_date = Column(DateTime, default=datetime.utcnow)
    
    contract = relationship("MudarabaContract", back_populates="distributions")

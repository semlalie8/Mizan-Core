from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
import enum

from .database import Base

class IjarahStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    TERMINATED = "TERMINATED"

class IjarahContract(Base):
    """
    Ijarah: An Islamic lease agreement.
    Ijarah wa-Iqtina: Lease-to-own.
    """
    __tablename__ = 'ijarah_contracts'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True, nullable=False)
    
    asset_description = Column(String, nullable=False)
    asset_value = Column(Numeric(15, 2), nullable=False)
    
    lease_term_months = Column(Integer, nullable=False)
    monthly_rent = Column(Numeric(12, 2), nullable=False)
    
    is_lease_to_own = Column(Boolean, default=False)
    
    # Sharia Rule: Ownership risk (maintenance/insurance) stays with the lessor (bank) 
    # during the lease period.
    
    status = Column(Enum(IjarahStatus), default=IjarahStatus.ACTIVE)
    
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

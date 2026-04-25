from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Float
from .database import Base

class ZakatCalculation(Base):
    """
    Zakat: The third pillar of Islam. Alms-giving based on net wealth.
    """
    __tablename__ = 'zakat_calculations'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True, nullable=False)
    
    total_assets = Column(Numeric(15, 2), nullable=False)
    total_liabilities = Column(Numeric(15, 2), nullable=False)
    zakat_base = Column(Numeric(15, 2), nullable=False) # Base for calculation
    
    # Standard Zakat Rate: 2.5% of net wealth above Nisab
    zakat_due = Column(Numeric(15, 2), nullable=False)
    
    nisab_value_at_time = Column(Numeric(15, 2), nullable=False) # Threshold for Zakat
    
    calculation_date = Column(DateTime, default=datetime.utcnow)

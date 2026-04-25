from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import List

from .zakat_models import ZakatCalculation
from .database import get_db

router = APIRouter(prefix="/v1/zakat", tags=["Zakat"])

class ZakatRequest(BaseModel):
    customer_id: str
    total_assets: Decimal
    total_liabilities: Decimal
    nisab_value: Decimal

class ZakatResponse(BaseModel):
    id: int
    zakat_due: float
    zakat_base: float
    
    class Config:
        from_attributes = True

@router.post("/calculate", response_model=ZakatResponse)
def calculate_zakat(req: ZakatRequest, db: Session = Depends(get_db)):
    """
    Calculate Zakat (2.5%) based on net wealth.
    """
    zakat_base = req.total_assets - req.total_liabilities
    zakat_due = Decimal(0)
    
    if zakat_base >= req.nisab_value:
        zakat_due = zakat_base * Decimal('0.025')
        
    db_calc = ZakatCalculation(
        customer_id=req.customer_id,
        total_assets=req.total_assets,
        total_liabilities=req.total_liabilities,
        zakat_base=zakat_base,
        zakat_due=zakat_due,
        nisab_value_at_time=req.nisab_value
    )
    db.add(db_calc)
    db.commit()
    db.refresh(db_calc)
    return db_calc

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import List

from .mudaraba_models import MudarabaContract, MudarabaStatus
from .database import get_db

router = APIRouter(prefix="/v1/mudaraba", tags=["Mudaraba"])

class MudarabaCreate(BaseModel):
    investor_id: str
    manager_id: str
    initial_capital: Decimal
    investor_profit_ratio: float
    manager_profit_ratio: float

class MudarabaResponse(BaseModel):
    id: int
    investor_id: str
    manager_id: str
    initial_capital: float
    status: str

    class Config:
        from_attributes = True

@router.post("/contracts", response_model=MudarabaResponse)
def create_mudaraba(contract: MudarabaCreate, db: Session = Depends(get_db)):
    """
    Establish a Mudaraba partnership.
    """
    if contract.investor_profit_ratio + contract.manager_profit_ratio != 1.0:
        raise HTTPException(status_code=400, detail="Profit ratios must sum to 1.0")
        
    db_contract = MudarabaContract(
        **contract.model_dump(),
        status=MudarabaStatus.ACTIVE
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@router.get("/contracts", response_model=List[MudarabaResponse])
def get_mudaraba_contracts(db: Session = Depends(get_db)):
    return db.query(MudarabaContract).all()

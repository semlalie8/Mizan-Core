from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import List

from .ijarah_models import IjarahContract, IjarahStatus
from .database import get_db

router = APIRouter(prefix="/v1/ijarah", tags=["Ijarah"])

class IjarahCreate(BaseModel):
    customer_id: str
    asset_description: str
    asset_value: Decimal
    lease_term_months: int
    monthly_rent: Decimal
    is_lease_to_own: bool = False

class IjarahResponse(BaseModel):
    id: int
    customer_id: str
    asset_description: str
    monthly_rent: float
    status: str

    class Config:
        from_attributes = True

@router.post("/contracts", response_model=IjarahResponse)
def create_ijarah(contract: IjarahCreate, db: Session = Depends(get_db)):
    """
    Establish an Ijarah lease contract.
    """
    db_contract = IjarahContract(
        **contract.model_dump(),
        status=IjarahStatus.ACTIVE
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@router.get("/contracts", response_model=List[IjarahResponse])
def get_ijarah_contracts(db: Session = Depends(get_db)):
    return db.query(IjarahContract).all()

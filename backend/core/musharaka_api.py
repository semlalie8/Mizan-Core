from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import List

from .musharaka_models import MusharakaContract, MusharakaPartner, MusharakaType
from .database import get_db

router = APIRouter(prefix="/v1/musharaka", tags=["Musharaka"])

class PartnerCreate(BaseModel):
    partner_id: str
    capital_contribution: Decimal
    equity_percentage: float
    profit_share_percentage: float

class MusharakaCreate(BaseModel):
    musharaka_type: str
    asset_description: str
    partners: List[PartnerCreate]

class MusharakaResponse(BaseModel):
    id: int
    musharaka_type: str
    asset_description: str
    total_capital: float

    class Config:
        from_attributes = True

@router.post("/contracts", response_model=MusharakaResponse)
def create_musharaka(request: MusharakaCreate, db: Session = Depends(get_db)):
    """
    Establish a Musharaka joint venture.
    """
    total_capital = sum(p.capital_contribution for p in request.partners)
    
    db_contract = MusharakaContract(
        musharaka_type=MusharakaType[request.musharaka_type],
        asset_description=request.asset_description,
        total_capital=total_capital
    )
    db.add(db_contract)
    db.flush() # Get ID
    
    for p in request.partners:
        partner = MusharakaPartner(
            contract_id=db_contract.id,
            **p.model_dump()
        )
        db.add(partner)
        
    db.commit()
    db.refresh(db_contract)
    return db_contract

@router.get("/contracts", response_model=List[MusharakaResponse])
def get_musharaka_contracts(db: Session = Depends(get_db)):
    return db.query(MusharakaContract).all()

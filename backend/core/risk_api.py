from fastapi import APIRouter, HTTPException
from typing import Dict, List
from .risk_engine import mizan_risk

router = APIRouter(prefix="/risk", tags=["Risk Management"])

@router.get("/var")
async def get_value_at_risk(value: float):
    """
    Calculate the Value at Risk (VaR) for a given portfolio value.
    """
    try:
        return mizan_risk.calculate_var(value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stress-test")
async def run_stress_test(data: Dict):
    """
    Simulate a market stress scenario on specific contract data.
    """
    try:
        scenario = data.get("scenario", "Liquidity Crunch")
        contract = data.get("contract", {"value": 1000000})
        return mizan_risk.run_stress_test(scenario, contract)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/score/{client_id}")
async def get_credit_score(client_id: str):
    """
    Get the AI-driven credit score and default probability for a client.
    """
    try:
        # Mock historical signals
        signals = [{"type": "sentiment", "score": 0.8}]
        return await mizan_risk.predict_default_probability(client_id, signals)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

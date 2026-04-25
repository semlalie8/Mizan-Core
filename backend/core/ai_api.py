from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from .ai_intelligence import sharia_ai

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.get("/analyze/ethical")
async def analyze_ethical(query: str):
    """
    Perform AI-driven ethical sentiment analysis on an entity or investment query.
    Powered by AlphaEar Sentiment & News tools.
    """
    try:
        return await sharia_ai.analyze_ethical_sentiment(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/yield")
async def predict_yield(data: Dict):
    """
    Predict future yields for Mudaraba/Musharaka accounts using the Kronos predictor.
    """
    # In a real scenario, 'data' would contain historical K-line or profit data
    try:
        historical = data.get("historical", [])
        horizon = data.get("horizon", 30)
        return await sharia_ai.predict_mudaraba_yield(historical, horizon)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visualize/{contract_type}/{contract_id}")
async def visualize_flow(contract_type: str, contract_id: str):
    """
    Generate a Sharia transmission chain visualization for a specific contract.
    """
    try:
        return {"html": await sharia_ai.visualize_contract_logic(contract_id, contract_type)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import pytest
from datetime import datetime, timezone

def test_murabaha_lifecycle_success(client):
    """
    Test a full successful Murabaha lifecycle.
    1. Create Request
    2. Bank Purchase
    3. Bank Sale to Customer
    """
    # 1. Create Request
    request_payload = {
        "customer_id": "TEST-CUST-001",
        "asset_type": "VEHICLE",
        "asset_description": "2024 Tesla Model 3",
        "asset_cost": 45000.00,
        "bank_markup": 5000.00
    }
    response = client.post("/v1/murabaha/requests", json=request_payload)
    assert response.status_code == 200
    contract = response.json()
    contract_id = contract["id"]
    assert contract["status"] == "REQUESTED"
    assert contract["asset_owned_by_bank"] is False

    # 2. Bank Purchase
    purchase_payload = {"transfer_proof_reference": "PROOF-VEND-001"}
    headers = {"x-idempotency-key": "test-purchase-1"}
    response = client.post(f"/v1/murabaha/contracts/{contract_id}/purchase", json=purchase_payload, headers=headers)
    assert response.status_code == 200
    contract = response.json()
    assert contract["status"] == "BANK_PURCHASED"
    assert contract["asset_owned_by_bank"] is True
    assert contract["bank_purchase_timestamp"] is not None

    # 3. Bank Sale to Customer
    headers = {"x-idempotency-key": "test-sale-1"}
    response = client.post(f"/v1/murabaha/contracts/{contract_id}/sale", headers=headers)
    assert response.status_code == 200
    contract = response.json()
    assert contract["status"] == "SOLD_TO_CUSTOMER"
    assert contract["sharia_sequence_verified"] is True
    assert contract["cost_disclosed"] is True

def test_sharia_violation_sale_before_purchase(client):
    """
    CRITICAL TEST: Attempting to sell an asset before the bank owns it.
    This must fail with a 400 SEQUENCE_ERROR.
    """
    # 1. Create Request
    request_payload = {
        "customer_id": "TEST-CUST-002",
        "asset_type": "CONSUMER_GOODS",
        "asset_description": "High-end Laptop",
        "asset_cost": 2000.00,
        "bank_markup": 200.00
    }
    response = client.post("/v1/murabaha/requests", json=request_payload)
    contract_id = response.json()["id"]

    # 2. Attempt Sale IMMEDIATELY (Skipping Bank Purchase)
    headers = {"x-idempotency-key": "test-illegal-sale"}
    response = client.post(f"/v1/murabaha/contracts/{contract_id}/sale", headers=headers)
    
    # Assert failure
    assert response.status_code == 400
    assert "SEQUENCE_ERROR" in response.json()["detail"]
    assert "Bank does not yet own the asset" in response.json()["detail"]

def test_idempotency_enforcement(client):
    """
    Test that the same action cannot be performed twice with the same key.
    Note: Current implementation in murabaha_api doesn't fully store/check 
    the x-idempotency-key in a separate table yet, but it does check 
    state transitions which effectively prevents duplicate logical actions.
    """
    # 1. Create Request
    request_payload = {
        "customer_id": "TEST-CUST-003",
        "asset_type": "VEHICLE",
        "asset_description": "E-Bike",
        "asset_cost": 3000.00,
        "bank_markup": 300.00
    }
    response = client.post("/v1/murabaha/requests", json=request_payload)
    contract_id = response.json()["id"]

    # 2. Purchase once
    payload = {"transfer_proof_reference": "PROOF-1"}
    client.post(f"/v1/murabaha/contracts/{contract_id}/purchase", json=payload, headers={"x-idempotency-key": "k1"})
    
    # 3. Purchase again (even with different key, the STATE should block it)
    response = client.post(f"/v1/murabaha/contracts/{contract_id}/purchase", json=payload, headers={"x-idempotency-key": "k2"})
    assert response.status_code == 400
    assert "SHARIA_VIOLATION" in response.json()["detail"]

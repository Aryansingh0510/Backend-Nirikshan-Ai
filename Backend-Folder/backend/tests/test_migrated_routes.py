from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_routes():
    res1 = client.get("/api/health")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["status"] == "healthy"

    res2 = client.get("/health")
    assert res2.status_code == 200

def test_institutions_routes():
    res = client.get("/api/institutions")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "data" in data
    assert isinstance(data["data"], list)

def test_alerts_routes():
    res = client.get("/api/alerts")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

    if len(data["data"]) > 0:
        alert_id = data["data"][0]["id"]
        ack_res = client.post(f"/api/alerts/{alert_id}/acknowledge")
        assert ack_res.status_code == 200
        assert ack_res.json()["success"] is True

def test_analytics_routes():
    res_overview = client.get("/api/analytics/overview")
    assert res_overview.status_code == 200
    assert res_overview.json()["success"] is True

    res_trends = client.get("/api/analytics/trends")
    assert res_trends.status_code == 200
    assert res_trends.json()["success"] is True

    res_cat = client.get("/api/analytics/categories")
    assert res_cat.status_code == 200
    assert res_cat.json()["success"] is True

def test_telemetry_routes():
    res = client.get("/api/telemetry/inspectors")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_audit_routes():
    res = client.get("/api/audit-trail")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

    verify_res = client.post("/api/audit-trail/verify")
    assert verify_res.status_code == 200
    assert verify_res.json()["verified"] is True

def test_ai_discrepancy_route():
    payload = {
        "name": "ABC Welfare Centre",
        "type": "Welfare",
        "reportedCompliance": 91,
        "verifiedCompliance": 63,
        "staffReported": 12,
        "staffVerified": 7,
        "beneficiariesReported": 85,
        "beneficiariesVerified": 51,
        "facilityNotes": "North wing closed for unrecorded maintenance."
    }
    res = client.post("/api/ai/analyze-discrepancy", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "data" in data
    assert "executiveSummary" in data["data"]

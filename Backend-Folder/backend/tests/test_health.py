def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "NIRIKSHAN AI backend"

def test_openapi_docs(client):
    response = client.get("/api/openapi.json")
    assert response.status_code == 200
    assert "paths" in response.json()

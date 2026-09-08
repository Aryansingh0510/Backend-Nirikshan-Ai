import pytest

@pytest.fixture
def auth_headers(client):
    reg_payload = {
        "name": "Admin Tester",
        "email": "admin.tester@nirikshan.gov.in",
        "password": "Password123!",
        "role": "admin"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def inspector_headers(client):
    reg_payload = {
        "name": "Inspector Tester",
        "email": "insp.tester@nirikshan.gov.in",
        "password": "Password123!",
        "role": "inspector"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_list_institutions_empty(client, auth_headers):
    res = client.get("/api/institutions", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["count"] == 0
    assert data["total"] == 0

def test_create_institution_success(client, auth_headers):
    payload = {
        "name": "General Hospital Pune",
        "registration_number": "REG-HOSP-001",
        "address": "Shivajinagar, Pune, Maharashtra",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "reported_staff": 25,
        "reported_beneficiaries": 150,
        "operational_status": "Operational (Full)"
    }
    res = client.post("/api/institutions", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    assert data["data"]["name"] == "General Hospital Pune"
    assert data["data"]["registration_number"] == "REG-HOSP-001"

def test_create_institution_forbidden_role(client, inspector_headers):
    payload = {
        "name": "Unpermitted Hospital",
        "registration_number": "REG-UNPERM-001",
        "address": "Address",
        "latitude": 1.0,
        "longitude": 1.0
    }
    res = client.post("/api/institutions", json=payload, headers=inspector_headers)
    assert res.status_code == 403

def test_get_institution_by_id(client, auth_headers):
    payload = {
        "name": "Primary School Vashi",
        "registration_number": "REG-SCH-002",
        "address": "Vashi, Navi Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777
    }
    create_res = client.post("/api/institutions", json=payload, headers=auth_headers)
    inst_id = create_res.json()["data"]["id"]

    res = client.get(f"/api/institutions/{inst_id}", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["data"]["name"] == "Primary School Vashi"

def test_get_institution_not_found(client, auth_headers):
    res = client.get("/api/institutions/nonexistent-id", headers=auth_headers)
    assert res.status_code == 404

def test_update_institution_success(client, auth_headers):
    payload = {
        "name": "Welfare Center Nashik",
        "registration_number": "REG-WEL-003",
        "address": "Nashik",
        "latitude": 19.9975,
        "longitude": 73.7898
    }
    create_res = client.post("/api/institutions", json=payload, headers=auth_headers)
    inst_id = create_res.json()["data"]["id"]

    update_payload = {
        "name": "Welfare Center Nashik Updated",
        "reported_staff": 50
    }
    res = client.put(f"/api/institutions/{inst_id}", json=update_payload, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["data"]["name"] == "Welfare Center Nashik Updated"
    assert res.json()["data"]["reported_staff"] == 50

def test_list_institutions_search(client, auth_headers):
    inst1 = {
        "name": "ABC Care Unit",
        "registration_number": "REG-ABC-01",
        "address": "Mumbai",
        "latitude": 19.0,
        "longitude": 72.0
    }
    inst2 = {
        "name": "XYZ School Unit",
        "registration_number": "REG-XYZ-02",
        "address": "Thane",
        "latitude": 19.1,
        "longitude": 72.9
    }
    client.post("/api/institutions", json=inst1, headers=auth_headers)
    client.post("/api/institutions", json=inst2, headers=auth_headers)

    res = client.get("/api/institutions?search=ABC", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 1
    assert data["data"][0]["name"] == "ABC Care Unit"

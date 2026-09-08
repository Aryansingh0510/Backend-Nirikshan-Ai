def test_register_user_success(client):
    payload = {
        "name": "Inspector Tests",
        "email": "inspector.test@nirikshan.gov.in",
        "password": "SecretPassword123!",
        "role": "inspector"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "inspector.test@nirikshan.gov.in"
    assert data["user"]["role"] == "inspector"

def test_register_invalid_role(client):
    payload = {
        "name": "Bad Role",
        "email": "badrole@nirikshan.gov.in",
        "password": "SecretPassword123!",
        "role": "superman"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "Invalid role" in response.json()["error"]

def test_register_duplicate_email(client):
    payload = {
        "name": "User One",
        "email": "dup@nirikshan.gov.in",
        "password": "Password123!",
        "role": "official"
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already registered" in res2.json()["error"]

def test_login_success(client):
    reg_payload = {
        "name": "Login User",
        "email": "login@nirikshan.gov.in",
        "password": "CorrectPassword123!",
        "role": "official"
    }
    client.post("/api/auth/register", json=reg_payload)

    login_payload = {
        "email": "login@nirikshan.gov.in",
        "password": "CorrectPassword123!"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data

def test_login_wrong_password(client):
    reg_payload = {
        "name": "Wrong Password User",
        "email": "wrongpw@nirikshan.gov.in",
        "password": "CorrectPassword123!",
        "role": "official"
    }
    client.post("/api/auth/register", json=reg_payload)

    login_payload = {
        "email": "wrongpw@nirikshan.gov.in",
        "password": "WrongPassword123!"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["error"]

def test_login_nonexistent_email(client):
    login_payload = {
        "email": "nonexistent@nirikshan.gov.in",
        "password": "SomePassword123!"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 401

def test_get_current_user_me(client):
    reg_payload = {
        "name": "Me User",
        "email": "me@nirikshan.gov.in",
        "password": "Password123!",
        "role": "admin"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    token = reg_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "me@nirikshan.gov.in"

def test_get_current_user_unauthorized(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_get_current_user_invalid_token(client):
    headers = {"Authorization": "Bearer invalid_jwt_token_string"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 401

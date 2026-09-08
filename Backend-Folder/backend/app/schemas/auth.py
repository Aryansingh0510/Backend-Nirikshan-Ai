from pydantic import BaseModel, EmailStr
from app.schemas.user import UserResponse

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "official"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

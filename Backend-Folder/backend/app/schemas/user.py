from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "official"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

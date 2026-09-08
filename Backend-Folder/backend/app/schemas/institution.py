from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class InstitutionBase(BaseModel):
    name: str
    registration_number: str
    address: str
    latitude: float
    longitude: float
    reported_staff: int = 0
    reported_beneficiaries: int = 0
    operational_status: str = "Operational (Full)"

class InstitutionCreate(InstitutionBase):
    pass

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    registration_number: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    reported_staff: Optional[int] = None
    reported_beneficiaries: Optional[int] = None
    operational_status: Optional[str] = None

class InstitutionResponse(InstitutionBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InstitutionSingleResponse(BaseModel):
    success: bool = True
    data: InstitutionResponse

class InstitutionListResponse(BaseModel):
    success: bool = True
    count: int
    total: int
    page: int
    limit: int
    data: List[InstitutionResponse]

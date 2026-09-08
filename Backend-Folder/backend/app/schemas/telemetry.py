from typing import Optional, List
from pydantic import BaseModel

class PingRequest(BaseModel):
    inspectorId: str
    lat: float
    lng: float
    accuracyMeters: Optional[float] = 5.0

class TelemetryListResponse(BaseModel):
    success: bool = True
    count: int
    data: List[dict]

class TelemetrySingleResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: dict

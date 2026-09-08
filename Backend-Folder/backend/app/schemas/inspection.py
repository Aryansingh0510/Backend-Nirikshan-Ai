from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class DispatchRequest(BaseModel):
    institutionId: str
    inspectorName: Optional[str] = "Field Inspector Priya Nair (INSP-492)"
    urgency: Optional[str] = "Immediate"

class InspectionSubmitRequest(BaseModel):
    institutionId: str
    inspectorId: Optional[str] = "INSP-492"
    inspectorName: Optional[str] = "Inspector Priya Nair"
    observedStaff: int
    observedBeneficiaries: Optional[int] = None
    facilityObservedStatus: Optional[str] = None
    notes: Optional[str] = "Inspection completed via mobile application."
    evidencePhotoUrls: Optional[List[str]] = []
    inspectorLat: Optional[float] = 19.033
    inspectorLng: Optional[float] = 73.0297

class DispatchResponse(BaseModel):
    success: bool = True
    message: str
    data: Dict[str, Any]

class SubmitResponse(BaseModel):
    success: bool = True
    message: str = "Inspection submitted successfully and cryptographically recorded."
    data: Dict[str, Any]

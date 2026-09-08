from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AIDiscrepancyRequest(BaseModel):
    institutionId: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    reportedCompliance: Optional[int] = None
    verifiedCompliance: Optional[int] = None
    realityGap: Optional[int] = None
    staffReported: Optional[int] = None
    staffVerified: Optional[int] = None
    beneficiariesReported: Optional[int] = None
    beneficiariesVerified: Optional[int] = None
    facilityNotes: Optional[str] = None

class AIDiscrepancyResponse(BaseModel):
    success: bool = True
    source: str
    data: Dict[str, Any]

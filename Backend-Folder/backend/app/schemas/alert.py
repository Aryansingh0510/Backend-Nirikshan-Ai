from typing import Optional, List
from pydantic import BaseModel

class AlertItem(BaseModel):
    id: str
    title: str
    institutionName: str
    institutionId: str
    severity: str
    time: str
    date: str
    description: str
    discrepancyPercent: Optional[int] = 0
    component: Optional[str] = None
    reportedVal: Optional[int] = None
    verifiedVal: Optional[int] = None
    assignedTo: Optional[str] = None
    acknowledged: bool = False

class AlertCreate(BaseModel):
    title: str
    institutionName: str
    institutionId: str
    severity: str = "Warning"
    description: str
    discrepancyPercent: Optional[int] = 0
    component: Optional[str] = None
    reportedVal: Optional[int] = None
    verifiedVal: Optional[int] = None
    assignedTo: Optional[str] = None

class AlertListResponse(BaseModel):
    success: bool = True
    count: int
    data: List[dict]

class AlertSingleResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: dict

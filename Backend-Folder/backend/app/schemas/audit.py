from typing import Optional, List
from pydantic import BaseModel

class AuditListResponse(BaseModel):
    success: bool = True
    count: int
    data: List[dict]

class AuditVerifyResponse(BaseModel):
    success: bool = True
    verified: bool = True
    totalBlocks: int
    ledgerState: str = "IMMUTABLE_SYNCED"
    latestBlockHash: Optional[str] = None

from typing import List, Dict, Any
from pydantic import BaseModel

class OverviewStatsResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any]

class TrendsResponse(BaseModel):
    success: bool = True
    data: List[Dict[str, Any]]

class CategoriesResponse(BaseModel):
    success: bool = True
    data: List[Dict[str, Any]]

import time
from fastapi import APIRouter

router = APIRouter(tags=["Health"])

START_TIME = time.time()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NIRIKSHAN AI backend",
        "version": "1.0.0",
        "uptimeSeconds": round(time.time() - START_TIME, 2),
    }

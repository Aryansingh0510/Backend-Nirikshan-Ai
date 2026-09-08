from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.institutions import router as institutions_router
from app.routes.inspections import router as inspections_router
from app.routes.alerts import router as alerts_router
from app.routes.analytics import router as analytics_router
from app.routes.telemetry import router as telemetry_router
from app.routes.audit import router as audit_router
from app.routes.ai import router as ai_router

__all__ = [
    "health_router",
    "auth_router",
    "institutions_router",
    "inspections_router",
    "alerts_router",
    "analytics_router",
    "telemetry_router",
    "audit_router",
    "ai_router",
]

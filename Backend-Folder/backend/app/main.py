from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.routes import (
    health_router,
    auth_router,
    institutions_router,
    inspections_router,
    alerts_router,
    analytics_router,
    telemetry_router,
    audit_router,
    ai_router,
)

def custom_generate_unique_id(route: Any) -> str:
    tag = route.tags[0] if getattr(route, "tags", None) else "default"
    clean_path = route.path.replace("{", "").replace("}", "").replace("/", "_")
    return f"{tag}_{route.name}_{clean_path}"

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        description="NIRIKSHAN AI Ground Reality Monitoring & Institutional Discrepancy Auditing Platform API",
        version="1.0.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        generate_unique_id_function=custom_generate_unique_id,
    )

    # CORS Middleware Setup
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handlers
    application.add_exception_handler(HTTPException, http_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    application.add_exception_handler(Exception, generic_exception_handler)

    # Include Routes under both /api and /api/v1 prefixes
    routers = [
        health_router,
        auth_router,
        institutions_router,
        inspections_router,
        alerts_router,
        analytics_router,
        telemetry_router,
        audit_router,
        ai_router,
    ]

    for router in routers:
        application.include_router(router, prefix=settings.API_V1_STR)
        application.include_router(router, prefix="/api")

    # Add direct root health check
    @application.get("/health", include_in_schema=False)
    def root_health():
        return {
            "status": "healthy",
            "service": "NIRIKSHAN AI backend",
            "version": "1.0.0"
        }

    return application

app = create_application()

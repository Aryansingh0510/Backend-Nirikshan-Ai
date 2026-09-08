import os
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NIRIKSHAN AI backend"
    API_V1_STR: str = "/api"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # Security & JWT Configuration
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database Configuration (SQLite default for local dev, PostgreSQL ready)
    DATABASE_URL: str = "sqlite:///./nirikshan.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def get_secret_key(self) -> str:
        """
        Returns the configured SECRET_KEY.
        In development/testing environments, uses a safe local dev fallback if unset.
        In production environment, fails safely by raising RuntimeError if SECRET_KEY is missing.
        """
        if self.SECRET_KEY:
            return self.SECRET_KEY
        if self.ENVIRONMENT.lower() in ("production", "prod"):
            raise RuntimeError("CRITICAL: SECRET_KEY environment variable MUST be set in production mode.")
        return "dev_secret_key_local_only_nirikshan_ai"

settings = Settings()

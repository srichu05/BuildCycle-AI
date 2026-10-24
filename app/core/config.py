import os
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DATABASE_URL: Optional[str] = None
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    MODEL_PATH: str = "models/best.pt"
    MODEL_NAME: str = "construction-waste-yolo"
    MODEL_CONFIDENCE_THRESHOLD: float = 0.25
    MODEL_IOU_THRESHOLD: float = 0.45
    MAX_UPLOAD_MB: int = 10
    GEMINI_ENABLED: bool = False
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024

    @property
    def normalized_database_url(self) -> Optional[str]:
        """Normalize database URL for SQLAlchemy and psycopg2/postgresql driver."""
        if not self.DATABASE_URL:
            return None
        url = self.DATABASE_URL.strip()
        # Render / Neon often provides postgres:// which SQLAlchemy 1.4+ rejects
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and "+psycopg" not in url:
            # Explicitly route to psycopg2 to avoid SQLAlchemy 2.1 defaulting to uninstalled psycopg3
            url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url


settings = Settings()

from functools import lru_cache

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Keys
    openai_api_key: str = ""
    google_api_key: str = ""

    # CORS
    cors_origins: str = "http://localhost:3000"

    # Convex (optional, for server-side access)
    convex_url: str = ""
    convex_deploy_key: str = ""

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

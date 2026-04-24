from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / "backend" / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = "postgresql+asyncpg://trust:trust_dev_only@localhost:5432/trust_electric"
    resend_api_key: str = ""
    owner_email: str = "sales@trustelectricheating.co.uk"
    next_public_api_url: str = "http://localhost:3000"
    dashboard_url: str = "http://localhost:5173"


settings = Settings()

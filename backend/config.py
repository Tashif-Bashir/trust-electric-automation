from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql+asyncpg://trust:trust_dev_only@localhost:5432/trust_electric"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Twilio
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""

    # Resend
    resend_api_key: str = ""

    # Business owner contact
    owner_phone: str = ""
    owner_email: str = "sales@trustelectricheating.co.uk"

    # Anthropic
    anthropic_api_key: str = ""

    # Unleashed
    unleashed_api_id: str = ""
    unleashed_api_key: str = ""

    # Xero
    xero_client_id: str = ""
    xero_client_secret: str = ""

    # App
    use_mock_data: bool = True
    next_public_api_url: str = "http://localhost:3000"
    dashboard_url: str = "http://localhost:5173"
    environment: str = "development"


settings = Settings()

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql://admin:password123@localhost:5432/islamic_fintech")
    PROJECT_NAME: str = "Islamic Fintech Infrastructure"
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DIYOR HOTEL API"
    app_env: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str
    frontend_url: str = "http://localhost:3000"
    first_admin_email: str = "admin@diyorhotel.uz"
    first_admin_password: str = "ChangeMe123!"
    hotel_name: str = "DIYOR HOTEL - TASHKENT"
    hotel_location: str = "Olmos 74A street, Tashkent, Uzbekistan"
    hotel_phone: str = "+998 88 589 33 33"
    hotel_telegram_url: str = "https://t.me/diyor_tashkent_hotel"
    hotel_youtube_url: str = "https://www.youtube.com/@Diyorhoteluz"
    hotel_hero_image: str = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
    hotel_gallery: list[str] = Field(
        default_factory=lambda: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
        ]
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

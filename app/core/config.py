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
    hotel_name: str = "Diyor Tashkent Hotel"
    hotel_location: str = "Olmos Street 74A, Bektemir district, Tashkent 100037, Uzbekistan"
    hotel_phone: str = "+998 88 589 33 33"
    hotel_telegram_url: str = "https://t.me/diyor_hoteln11"
    hotel_youtube_url: str = "https://www.youtube.com/@Diyorhoteluz"
    hotel_hero_image: str = "https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp"
    hotel_gallery: list[str] = Field(
        default_factory=lambda: [
            "https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp",
            "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp",
            "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp",
            "https://diyortashkenthotel.uz/img/dac01a4ffbd5aa31.webp",
        ]
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

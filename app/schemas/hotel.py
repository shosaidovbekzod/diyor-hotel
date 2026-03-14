from pydantic import BaseModel

from app.schemas.review import ReviewRead
from app.schemas.room import RoomRead
from app.schemas.service import ServiceRead


class HotelSummary(BaseModel):
    name: str
    location: str
    phone: str
    email: str
    telegram_url: str
    youtube_url: str
    hero_image: str
    map_embed_url: str
    gallery: list[str]
    highlight_rooms: list[RoomRead]
    services: list[ServiceRead]
    testimonials: list[ReviewRead]

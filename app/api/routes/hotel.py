from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.db.session import get_db
from app.models.review import Review
from app.models.room import Room
from app.models.service import Service
from app.schemas.hotel import HotelSummary
from app.services.serializers import room_to_dict

router = APIRouter()


@router.get("/summary", response_model=HotelSummary)
def get_hotel_summary(db: Session = Depends(get_db)):
    rooms = list(db.scalars(select(Room).where(Room.is_featured.is_(True)).limit(3)).all())
    services = list(db.scalars(select(Service).where(Service.is_featured.is_(True)).order_by(Service.id)).all())
    reviews = list(
        db.scalars(
            select(Review)
            .options(joinedload(Review.user))
            .order_by(Review.rating.desc(), Review.created_at.desc())
            .limit(3)
        ).unique().all()
    )
    return {
        "name": settings.hotel_name,
        "location": settings.hotel_location,
        "phone": settings.hotel_phone,
        "telegram_url": settings.hotel_telegram_url,
        "youtube_url": settings.hotel_youtube_url,
        "hero_image": settings.hotel_hero_image,
        "gallery": settings.hotel_gallery,
        "highlight_rooms": [room_to_dict(room) for room in rooms],
        "services": services,
        "testimonials": reviews,
    }

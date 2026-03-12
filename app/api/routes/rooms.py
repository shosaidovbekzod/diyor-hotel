from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.review import Review, ReviewStatus
from app.models.room import Room
from app.schemas.room import RoomRead
from app.services.booking_service import ensure_room_available
from app.services.serializers import room_to_dict

router = APIRouter()


@router.get("", response_model=list[RoomRead])
def list_rooms(
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    guests: int | None = Query(default=None, ge=1, le=20),
    featured_only: bool = Query(default=False),
    available_only: bool = Query(default=False),
    check_in: date | None = None,
    check_out: date | None = None,
    db: Session = Depends(get_db),
):
    query = select(Room).order_by(Room.price_per_night.asc())
    if min_price is not None:
        query = query.where(Room.price_per_night >= min_price)
    if max_price is not None:
        query = query.where(Room.price_per_night <= max_price)
    if guests is not None:
        query = query.where(Room.capacity >= guests)
    if featured_only:
        query = query.where(Room.is_featured.is_(True))
    if available_only:
        query = query.where(Room.is_available.is_(True))

    rooms = list(db.scalars(query).all())
    items: list[dict] = []
    for room in rooms:
        if check_in and check_out and guests:
            try:
                ensure_room_available(db, room, check_in, check_out, guests)
            except HTTPException:
                continue

        avg_rating, reviews_count = db.execute(
            select(
                func.coalesce(func.avg(Review.rating), 0.0),
                func.count(Review.id),
            ).where(Review.room_id == room.id, Review.status == ReviewStatus.PUBLISHED)
        ).one()
        items.append(room_to_dict(room, float(avg_rating or 0.0), int(reviews_count or 0)))
    return items


@router.get("/{room_slug}", response_model=RoomRead)
def get_room(room_slug: str, db: Session = Depends(get_db)):
    room = db.scalar(select(Room).where(Room.slug == room_slug))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    avg_rating, reviews_count = db.execute(
        select(
            func.coalesce(func.avg(Review.rating), 0.0),
            func.count(Review.id),
        ).where(Review.room_id == room.id, Review.status == ReviewStatus.PUBLISHED)
    ).one()
    return room_to_dict(room, float(avg_rating or 0.0), int(reviews_count or 0))

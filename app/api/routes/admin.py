from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.booking import Booking, BookingStatus
from app.models.review import Review
from app.models.room import Room
from app.models.user import User
from app.schemas.admin import AdminAnalytics, AdminDashboard
from app.schemas.booking import BookingRead
from app.schemas.room import RoomCreate, RoomRead, RoomUpdate
from app.schemas.user import UserRead
from app.services.serializers import room_to_dict

router = APIRouter()


@router.get("/dashboard", response_model=AdminDashboard)
def get_dashboard(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_revenue = db.scalar(
        select(func.coalesce(func.sum(Booking.total_price), Decimal("0.00"))).where(
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
        )
    )
    total_bookings = db.scalar(select(func.count(Booking.id))) or 0
    active_bookings = db.scalar(
        select(func.count(Booking.id)).where(Booking.status == BookingStatus.CONFIRMED)
    ) or 0
    total_rooms = db.scalar(select(func.count(Room.id))) or 1
    avg_rating = db.scalar(select(func.coalesce(func.avg(Review.rating), 0.0))) or 0.0
    users_count = db.scalar(select(func.count(User.id))) or 0

    recent_bookings = list(
        db.scalars(
            select(Booking)
            .options(joinedload(Booking.room), joinedload(Booking.payment), joinedload(Booking.user))
            .order_by(Booking.created_at.desc())
            .limit(10)
        ).unique().all()
    )
    rooms = [room_to_dict(room) for room in db.scalars(select(Room).order_by(Room.id)).all()]
    users = list(db.scalars(select(User).order_by(User.created_at.desc())).all())

    return {
        "analytics": AdminAnalytics(
            total_revenue=total_revenue,
            total_bookings=total_bookings,
            active_bookings=active_bookings,
            occupancy_rate=round(active_bookings / total_rooms * 100, 2),
            average_rating=round(float(avg_rating), 2),
            users_count=users_count,
        ),
        "recent_bookings": recent_bookings,
        "rooms": rooms,
        "users": users,
    }


@router.get("/bookings", response_model=list[BookingRead])
def list_all_bookings(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(Booking)
            .options(joinedload(Booking.room), joinedload(Booking.payment), joinedload(Booking.user))
            .order_by(Booking.created_at.desc())
        ).unique().all()
    )


@router.get("/users", response_model=list[UserRead])
def list_users(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return list(db.scalars(select(User).order_by(User.created_at.desc())).all())


@router.post("/rooms", response_model=RoomRead, status_code=status.HTTP_201_CREATED)
def create_room(
    payload: RoomCreate,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    room = Room(
        **payload.model_dump(exclude={"gallery"}),
        gallery=",".join(str(item) for item in payload.gallery),
    )
    db.add(room)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid room payload") from exc
    db.refresh(room)
    return room_to_dict(room)


@router.put("/rooms/{room_id}", response_model=RoomRead)
def update_room(
    room_id: int,
    payload: RoomUpdate,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    room = db.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    changes = payload.model_dump(exclude_unset=True)
    if "gallery" in changes and changes["gallery"] is not None:
        changes["gallery"] = ",".join(str(item) for item in changes["gallery"])

    for key, value in changes.items():
        setattr(room, key, value)

    db.add(room)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid room payload") from exc
    db.refresh(room)
    return room_to_dict(room)


@router.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, _: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    room = db.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()

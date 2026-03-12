from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.booking import Booking, BookingStatus
from app.models.payment import PaymentStatus
from app.models.room import Room
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingPriceQuote, BookingRead
from app.services.booking_service import calculate_booking_quote, create_booking_or_raise, ensure_room_available

router = APIRouter()


@router.post("/quote", response_model=BookingPriceQuote)
def quote_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    room = db.get(Room, payload.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    ensure_room_available(db, room, payload.check_in, payload.check_out, payload.guests_count)
    return calculate_booking_quote(room, payload.check_in, payload.check_out)


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = create_booking_or_raise(db=db, user=current_user, payload=payload)
    return booking


@router.get("", response_model=list[BookingRead])
def my_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = (
        select(Booking)
        .options(joinedload(Booking.room), joinedload(Booking.payment))
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
    )
    return list(db.scalars(query).unique().all())


@router.delete("/{booking_id}", response_model=BookingRead)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.scalar(
        select(Booking)
        .options(joinedload(Booking.room), joinedload(Booking.payment))
        .where(Booking.id == booking_id, Booking.user_id == current_user.id)
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Booking already cancelled")

    booking.status = BookingStatus.CANCELLED
    if booking.payment:
        booking.payment.status = PaymentStatus.REFUNDED
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

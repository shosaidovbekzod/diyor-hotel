from datetime import date
from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentStatus
from app.models.review import Review, ReviewStatus
from app.models.room import Room
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingPriceQuote

TAX_RATE = Decimal("0.12")


def overlapping_booking_clause(check_in: date, check_out: date):
    return and_(
        Booking.check_in < check_out,
        Booking.check_out > check_in,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
    )


def calculate_booking_quote(room: Room, check_in: date, check_out: date) -> BookingPriceQuote:
    nights = (check_out - check_in).days
    nightly_price = room.promo_price or room.price_per_night
    subtotal = nightly_price * nights
    taxes = (subtotal * TAX_RATE).quantize(Decimal("0.01"))
    total_price = subtotal + taxes
    return BookingPriceQuote(
        room_id=room.id,
        nights=nights,
        subtotal=subtotal,
        taxes=taxes,
        total_price=total_price,
    )


def ensure_room_available(
    db: Session,
    room: Room,
    check_in: date,
    check_out: date,
    guests_count: int,
) -> None:
    if not room.is_available:
        raise HTTPException(status_code=400, detail="Room is currently unavailable")
    if guests_count > room.capacity:
        raise HTTPException(status_code=400, detail="Guest count exceeds room capacity")

    existing = db.scalar(
        select(Booking.id).where(
            Booking.room_id == room.id,
            overlapping_booking_clause(check_in, check_out),
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Room is not available for selected dates")


def create_booking_or_raise(db: Session, user: User, payload: BookingCreate) -> Booking:
    room = db.get(Room, payload.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    ensure_room_available(db, room, payload.check_in, payload.check_out, payload.guests_count)
    quote = calculate_booking_quote(room, payload.check_in, payload.check_out)

    booking = Booking(
        booking_reference=f"DIYOR-{uuid4().hex[:10].upper()}",
        user_id=user.id,
        room_id=room.id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests_count=payload.guests_count,
        nights=quote.nights,
        subtotal=quote.subtotal,
        taxes=quote.taxes,
        total_price=quote.total_price,
        status=BookingStatus.PENDING,
        special_request=payload.special_request,
    )
    db.add(booking)
    db.flush()

    payment = Payment(
        booking_id=booking.id,
        amount=quote.total_price,
        status=PaymentStatus.PENDING,
        transaction_reference=f"PAY-{uuid4().hex[:12].upper()}",
    )
    db.add(payment)
    db.commit()
    db.refresh(booking)
    return db.scalar(
        select(Booking)
        .options(joinedload(Booking.room), joinedload(Booking.payment), joinedload(Booking.user))
        .where(Booking.id == booking.id)
    )


def sync_payment_status(booking: Booking) -> None:
    if not booking.payment:
        return

    if booking.status == BookingStatus.PENDING:
        booking.payment.status = PaymentStatus.PENDING
        return

    if booking.status in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]:
        booking.payment.status = PaymentStatus.PAID
        return

    if booking.status == BookingStatus.CANCELLED:
        booking.payment.status = PaymentStatus.REFUNDED


def room_rating_summary(db: Session, room_id: int) -> tuple[float, int]:
    avg_rating, count_reviews = db.execute(
        select(
            func.coalesce(func.avg(Review.rating), 0.0),
            func.count(Review.id),
        ).where(Review.room_id == room_id, Review.status == ReviewStatus.PUBLISHED)
    ).one()
    return float(avg_rating or 0.0), int(count_reviews or 0)

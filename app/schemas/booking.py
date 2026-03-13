from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, model_validator

from app.models.booking import BookingStatus
from app.schemas.common import TimestampedSchema
from app.schemas.payment import PaymentRead
from app.schemas.room import RoomRead
from app.schemas.user import UserSummary


class BookingCreate(BaseModel):
    room_id: int
    check_in: date
    check_out: date
    guests_count: int = Field(gt=0, le=20)
    special_request: str | None = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be later than check_in")
        return self


class BookingPriceQuote(BaseModel):
    room_id: int
    nights: int
    subtotal: Decimal
    taxes: Decimal
    total_price: Decimal
    currency: str = "UZS"


class BookingRead(TimestampedSchema):
    id: int
    booking_reference: str
    room_id: int
    user_id: int
    check_in: date
    check_out: date
    guests_count: int
    nights: int
    subtotal: Decimal
    taxes: Decimal
    total_price: Decimal
    status: BookingStatus
    special_request: str | None
    room: RoomRead
    user: UserSummary | None = None
    payment: PaymentRead | None = None

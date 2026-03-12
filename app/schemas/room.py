from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, HttpUrl, computed_field, field_validator

from app.schemas.common import TimestampedSchema


class RoomBase(BaseModel):
    room_number: str = Field(min_length=1, max_length=20)
    slug: str = Field(min_length=3, max_length=120)
    title: str = Field(min_length=2, max_length=120)
    subtitle: str = Field(min_length=2, max_length=140)
    description: str = Field(min_length=30)
    size_sqm: int = Field(gt=0, le=400)
    price_per_night: Decimal = Field(gt=0)
    promo_price: Decimal | None = Field(default=None, gt=0)
    capacity: int = Field(gt=0, le=20)
    bed_type: str = Field(min_length=2, max_length=50)
    amenities: str = Field(min_length=5)
    image_url: HttpUrl
    gallery: list[HttpUrl] = Field(default_factory=list)
    view_label: str | None = Field(default=None, max_length=80)
    is_featured: bool = False
    is_available: bool = True


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    room_number: str | None = Field(default=None, min_length=1, max_length=20)
    slug: str | None = Field(default=None, min_length=3, max_length=120)
    title: str | None = Field(default=None, min_length=2, max_length=120)
    subtitle: str | None = Field(default=None, min_length=2, max_length=140)
    description: str | None = Field(default=None, min_length=30)
    size_sqm: int | None = Field(default=None, gt=0, le=400)
    price_per_night: Decimal | None = Field(default=None, gt=0)
    promo_price: Decimal | None = Field(default=None, gt=0)
    capacity: int | None = Field(default=None, gt=0, le=20)
    bed_type: str | None = Field(default=None, min_length=2, max_length=50)
    amenities: str | None = Field(default=None, min_length=5)
    image_url: HttpUrl | None = None
    gallery: list[HttpUrl] | None = None
    view_label: str | None = Field(default=None, max_length=80)
    is_featured: bool | None = None
    is_available: bool | None = None


class RoomAvailabilityRequest(BaseModel):
    check_in: date
    check_out: date
    guests: int = Field(gt=0, le=20)


class RoomRead(TimestampedSchema):
    id: int
    room_number: str
    slug: str
    title: str
    subtitle: str
    description: str
    size_sqm: int
    price_per_night: Decimal
    promo_price: Decimal | None
    capacity: int
    bed_type: str
    amenities: list[str]
    image_url: str
    gallery: list[str]
    view_label: str | None
    is_featured: bool
    is_available: bool
    average_rating: float = 0.0
    reviews_count: int = 0

    @field_validator("amenities", "gallery", mode="before")
    @classmethod
    def parse_csv_fields(cls, value):
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @computed_field
    @property
    def display_price(self) -> Decimal:
        return self.promo_price or self.price_per_night

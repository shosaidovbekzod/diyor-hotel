from decimal import Decimal

from pydantic import BaseModel

from app.schemas.booking import BookingRead
from app.schemas.room import RoomRead
from app.schemas.user import UserRead


class AdminAnalytics(BaseModel):
    total_revenue: Decimal
    total_bookings: int
    active_bookings: int
    occupancy_rate: float
    average_rating: float
    users_count: int


class AdminDashboard(BaseModel):
    analytics: AdminAnalytics
    recent_bookings: list[BookingRead]
    rooms: list[RoomRead]
    users: list[UserRead]

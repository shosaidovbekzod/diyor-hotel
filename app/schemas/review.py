from pydantic import BaseModel, Field

from app.models.review import ReviewStatus
from app.schemas.common import TimestampedSchema
from app.schemas.user import UserSummary


class ReviewCreate(BaseModel):
    room_id: int
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=2, max_length=100)
    comment: str = Field(min_length=10, max_length=1200)


class ReviewRead(TimestampedSchema):
    id: int
    room_id: int
    rating: int
    title: str
    comment: str
    status: ReviewStatus
    user: UserSummary

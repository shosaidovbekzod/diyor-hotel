from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.common import TimestampedSchema


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    password: str = Field(min_length=8, max_length=128)
    preferred_language: str = Field(default="en", max_length=10)


class UserRead(TimestampedSchema):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None
    preferred_language: str
    is_admin: bool
    is_active: bool


class UserSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr

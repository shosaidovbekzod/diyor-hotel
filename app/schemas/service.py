from app.schemas.common import TimestampedSchema


class ServiceRead(TimestampedSchema):
    id: int
    name: str
    icon: str
    short_description: str
    description: str
    is_featured: bool

from app.models.room import Room


def parse_csv_field(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def room_to_dict(room: Room, average_rating: float = 0.0, reviews_count: int = 0) -> dict:
    return {
        "id": room.id,
        "room_number": room.room_number,
        "slug": room.slug,
        "title": room.title,
        "subtitle": room.subtitle,
        "description": room.description,
        "size_sqm": room.size_sqm,
        "price_per_night": room.price_per_night,
        "promo_price": room.promo_price,
        "capacity": room.capacity,
        "bed_type": room.bed_type,
        "amenities": parse_csv_field(room.amenities),
        "image_url": room.image_url,
        "gallery": parse_csv_field(room.gallery),
        "view_label": room.view_label,
        "is_featured": room.is_featured,
        "is_available": room.is_available,
        "average_rating": average_rating,
        "reviews_count": reviews_count,
        "created_at": room.created_at,
        "updated_at": room.updated_at,
    }

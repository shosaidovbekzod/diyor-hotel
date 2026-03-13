from decimal import Decimal

from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models import Review, Room, Service, User
from app.models.base import Base


SERVICE_SEED = [
    {
        "name": "Buffet breakfast",
        "icon": "utensils-crossed",
        "short_description": "Personalized breakfast service for a composed start to the day.",
        "description": "Start your day with a personalized breakfast served in the restaurant or directly in your room according to your preferences.",
    },
    {
        "name": "Indoor swimming pool",
        "icon": "waves",
        "short_description": "Year-round indoor pool for calm relaxation and light exercise.",
        "description": "Guests can unwind in the modern indoor swimming pool all year round, with a comfortable water temperature and a quiet atmosphere.",
    },
    {
        "name": "Gym",
        "icon": "dumbbell",
        "short_description": "Modern gym equipped for cardio and strength sessions.",
        "description": "The hotel gym includes the essential equipment for effective cardio and strength training at any time of day.",
    },
    {
        "name": "Sauna (Turkish and Finnish)",
        "icon": "flame",
        "short_description": "Turkish hammam and Finnish sauna for recovery and warmth.",
        "description": "Two sauna formats are available for full relaxation: the Turkish hammam for gentle steam and the Finnish sauna for dry heat and recovery.",
    },
    {
        "name": "Parking",
        "icon": "car",
        "short_description": "Safe on-site parking for guests arriving by car.",
        "description": "Guests travelling by car can use the secure parking area next to the hotel throughout their stay.",
    },
    {
        "name": "Wi-Fi",
        "icon": "wifi",
        "short_description": "High-speed internet across rooms and public areas.",
        "description": "Complimentary high-speed Wi-Fi is available across the property, from guest rooms to shared hotel spaces.",
    },
]


ROOM_SEED = [
    {
        "slug": "double-room-one-bed-or-two",
        "room_number": "201",
        "title": "Double Room with 1 Bed or 2 Separate Beds",
        "subtitle": "A calm standard room for business trips and short city stays.",
        "description": "A comfortable standard double room that can be arranged with one large bed or two separate beds, designed for quiet rest in the city.",
        "size_sqm": 32,
        "price_per_night": Decimal("420000"),
        "promo_price": Decimal("299000"),
        "capacity": 2,
        "bed_type": "1 Double Bed / 2 Twin Beds",
        "amenities": "Wi-Fi,Breakfast,Air Conditioning,Smart TV,Private Bathroom",
        "image_url": "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp",
        "gallery": "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp,https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp",
        "view_label": "City stay",
        "is_featured": True,
    },
    {
        "slug": "two-bedroom-suite",
        "room_number": "305",
        "title": "2 Bedroom Suite",
        "subtitle": "A spacious suite for guests who value privacy, scale, and comfort.",
        "description": "A luxurious suite created for guests who appreciate spacious living, soft privacy, and a more generous room layout.",
        "size_sqm": 68,
        "price_per_night": Decimal("890000"),
        "promo_price": None,
        "capacity": 4,
        "bed_type": "2 Bedroom Suite",
        "amenities": "Wi-Fi,Breakfast,Lounge Area,Air Conditioning,Smart TV,Private Bathroom",
        "image_url": "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp",
        "gallery": "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp,https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp",
        "view_label": "Suite collection",
        "is_featured": True,
    },
    {
        "slug": "one-bedroom-deluxe-apartment",
        "room_number": "402",
        "title": "1 Bedroom Deluxe Apartment",
        "subtitle": "An elegant apartment layout suited to longer, more independent stays.",
        "description": "A spacious deluxe apartment with one bedroom and an elegant interior, composed for guests who want extra comfort and more room to settle in.",
        "size_sqm": 54,
        "price_per_night": Decimal("760000"),
        "promo_price": None,
        "capacity": 3,
        "bed_type": "1 Bedroom Apartment",
        "amenities": "Wi-Fi,Breakfast,Kitchen,Workspace,Smart TV,Private Bathroom",
        "image_url": "https://diyortashkenthotel.uz/img/d29a38843873236a.webp",
        "gallery": "https://diyortashkenthotel.uz/img/d29a38843873236a.webp,https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp",
        "view_label": "Deluxe apartment",
        "is_featured": True,
    },
    {
        "slug": "deluxe-apartment-two-bedrooms",
        "room_number": "501",
        "title": "Deluxe Apartment with 2 Bedrooms",
        "subtitle": "A larger apartment with kitchen access for flexible family stays.",
        "description": "An ideal choice for families or small groups, with two bedrooms, a kitchen, and the extra room needed for a longer stay.",
        "size_sqm": 86,
        "price_per_night": Decimal("990000"),
        "promo_price": None,
        "capacity": 4,
        "bed_type": "2 Bedroom Apartment",
        "amenities": "Wi-Fi,Breakfast,Kitchen,Dining Area,Smart TV,Private Bathroom",
        "image_url": "https://diyortashkenthotel.uz/img/451be978591e2b97.webp",
        "gallery": "https://diyortashkenthotel.uz/img/451be978591e2b97.webp,https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp",
        "view_label": "Apartment collection",
        "is_featured": True,
    },
    {
        "slug": "deluxe-apartment-three-bedrooms",
        "room_number": "502",
        "title": "Deluxe Apartment with 3 Bedrooms",
        "subtitle": "The most expansive apartment option for extended family and group travel.",
        "description": "A large three-bedroom apartment with kitchen and living areas, designed for guests who need extra space without losing the privacy of separate rooms.",
        "size_sqm": 118,
        "price_per_night": Decimal("1350000"),
        "promo_price": None,
        "capacity": 6,
        "bed_type": "3 Bedroom Apartment",
        "amenities": "Wi-Fi,Breakfast,Kitchen,Dining Area,Smart TV,Private Bathroom",
        "image_url": "https://diyortashkenthotel.uz/img/7610f37d48fbf093.webp",
        "gallery": "https://diyortashkenthotel.uz/img/7610f37d48fbf093.webp,https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp",
        "view_label": "Residence collection",
        "is_featured": True,
    },
]


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        existing_admin = db.scalar(select(User).where(User.email == settings.first_admin_email))
        if not existing_admin:
            db.add(
                User(
                    full_name="DIYOR Hotel Admin",
                    email=settings.first_admin_email.lower(),
                    hashed_password=get_password_hash(settings.first_admin_password),
                    is_admin=True,
                )
            )
            db.commit()

        existing_services = {service.name: service for service in db.scalars(select(Service)).all()}
        desired_service_names = {payload["name"] for payload in SERVICE_SEED}
        for payload in SERVICE_SEED:
            service = existing_services.get(payload["name"])
            if service:
                service.icon = payload["icon"]
                service.short_description = payload["short_description"]
                service.description = payload["description"]
                service.is_featured = True
            else:
                db.add(Service(**payload))

        for name, service in existing_services.items():
            if name not in desired_service_names:
                db.delete(service)
        db.commit()

        existing_rooms_by_number = {room.room_number: room for room in db.scalars(select(Room)).all()}
        existing_rooms_by_slug = {room.slug: room for room in db.scalars(select(Room)).all()}
        for payload in ROOM_SEED:
            room = existing_rooms_by_number.get(payload["room_number"]) or existing_rooms_by_slug.get(payload["slug"])
            if room:
                for key, value in payload.items():
                    setattr(room, key, value)
                room.is_available = True
            else:
                db.add(Room(**payload))
        db.commit()

        if not db.scalar(select(User.id).where(User.email == "guest@diyorhotel.uz")):
            db.add(
                User(
                    full_name="Demo Guest",
                    email="guest@diyorhotel.uz",
                    phone="+998901112233",
                    hashed_password=get_password_hash("Guest123!"),
                )
            )
            db.commit()

        if not db.scalar(select(Review.id).limit(1)):
            guest = db.scalar(select(User).where(User.email == "guest@diyorhotel.uz"))
            room = db.scalar(select(Room).where(Room.slug == "double-room-one-bed-or-two"))
            if guest and room:
                db.add(
                    Review(
                        user_id=guest.id,
                        room_id=room.id,
                        rating=5,
                        title="Comfortable stay in Tashkent",
                        comment="Quiet rooms, warm service, and a smooth arrival experience made the hotel feel easy and reliable.",
                    )
                )
                db.commit()

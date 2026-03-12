from decimal import Decimal

from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models import Review, Room, Service, User
from app.models.base import Base


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

        if not db.scalar(select(Service.id).limit(1)):
            db.add_all(
                [
                    Service(name="Swimming Pool", icon="waves", short_description="Indoor heated pool with skyline lounge seating.", description="Relax in our premium indoor pool with private cabanas and ambient evening lighting."),
                    Service(name="Fitness Gym", icon="dumbbell", short_description="Modern strength and cardio zone open daily.", description="A fully equipped fitness center featuring premium cardio and strength machines."),
                    Service(name="Finnish Sauna", icon="flame", short_description="Dry sauna designed for deep relaxation.", description="Traditional Finnish sauna with controlled heat and recovery seating area."),
                    Service(name="Turkish Sauna", icon="cloud", short_description="Steam experience inspired by classic hammam rituals.", description="Rejuvenating Turkish sauna with aromatic steam and stone relaxation benches."),
                    Service(name="Salt Room", icon="sparkles", short_description="Wellness zone for quiet restoration.", description="Softly lit halotherapy room designed for calm breathing and recovery."),
                    Service(name="SPA Center", icon="flower-2", short_description="Signature treatments for body and mind.", description="Luxury massages, facials, and wellness rituals delivered by trained therapists."),
                    Service(name="Restaurant", icon="utensils-crossed", short_description="Uzbek and international dining all day.", description="Elegant restaurant offering breakfast, lunch, dinner, and curated tasting menus."),
                ]
            )
            db.commit()

        if not db.scalar(select(Room.id).limit(1)):
            db.add_all(
                [
                    Room(
                        slug="deluxe-city-room",
                        room_number="201",
                        title="Deluxe City Room",
                        subtitle="Elegant comfort with a city-facing view",
                        description="A refined room with layered textiles, a plush king bed, smart TV, work desk, rainfall shower, and soft gold finishes inspired by modern boutique hospitality.",
                        size_sqm=34,
                        price_per_night=Decimal("420000"),
                        promo_price=Decimal("299000"),
                        capacity=2,
                        bed_type="King Bed",
                        amenities="Wi-Fi,Breakfast,Smart TV,Minibar,Rainfall Shower,Air Conditioning",
                        image_url="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
                        gallery="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                        view_label="City View",
                        is_featured=True,
                    ),
                    Room(
                        slug="executive-suite",
                        room_number="305",
                        title="Executive Suite",
                        subtitle="Spacious premium suite for business and leisure",
                        description="Our executive suite offers a lounge area, premium king bed, curated minibar, larger bathroom, and a calm palette tailored for longer stays and elevated comfort.",
                        size_sqm=52,
                        price_per_night=Decimal("690000"),
                        promo_price=None,
                        capacity=3,
                        bed_type="King Bed + Sofa",
                        amenities="Wi-Fi,Breakfast,Lounge Area,Coffee Station,Smart TV,Bathtub,Workspace",
                        image_url="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
                        gallery="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
                        view_label="Courtyard View",
                        is_featured=True,
                    ),
                    Room(
                        slug="family-residence",
                        room_number="402",
                        title="Family Residence",
                        subtitle="Large family stay with flexible sleeping layout",
                        description="Designed for families or small groups, this residence includes multiple sleeping zones, storage, a dining corner, and generous bathroom amenities for a smooth stay.",
                        size_sqm=68,
                        price_per_night=Decimal("890000"),
                        promo_price=Decimal("760000"),
                        capacity=4,
                        bed_type="2 Queen Beds",
                        amenities="Wi-Fi,Breakfast,Dining Corner,Kids Welcome Set,Smart TV,Walk-in Shower",
                        image_url="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
                        gallery="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
                        view_label="Garden View",
                        is_featured=True,
                    ),
                ]
            )
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
            room = db.scalar(select(Room).where(Room.slug == "deluxe-city-room"))
            if guest and room:
                db.add(
                    Review(
                        user_id=guest.id,
                        room_id=room.id,
                        rating=5,
                        title="Excellent weekend stay",
                        comment="Beautiful interiors, very clean room, and the spa access made the promotion feel exceptional.",
                    )
                )
                db.commit()

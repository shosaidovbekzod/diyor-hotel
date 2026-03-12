from fastapi import APIRouter

from app.api.routes import admin, auth, bookings, hotel, reviews, rooms, services

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(hotel.router, prefix="/hotel", tags=["hotel"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

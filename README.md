# DIYOR HOTEL - TASHKENT

Production-ready full-stack hotel booking platform for DIYOR HOTEL, Tashkent.

## Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend: FastAPI, SQLAlchemy, JWT authentication
- Database: PostgreSQL
- Cache: Redis (optional service in Docker)
- Deployment: Docker, Docker Compose

## Architecture

### Frontend

- App Router based Next.js application in `frontend/`
- Luxury landing page, room listing, room detail, account, and admin dashboard pages
- Uses server-side fetching with graceful fallback data for resilient demos
- Client-side booking/account/admin panels for interactive JWT-driven flows

### Backend

- FastAPI app in `app/`
- JWT authentication with user registration, login, and current-user endpoint
- Room browsing, booking quote, booking creation/cancellation, reviews, services, and hotel summary APIs
- Admin dashboard endpoint for analytics, booking oversight, room management, and user listing
- Automatic schema creation and seed data for DIYOR HOTEL rooms/services/demo guest

## Folder Structure

```text
.
├── app
│   ├── api
│   ├── core
│   ├── db
│   ├── models
│   ├── schemas
│   └── services
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   └── public
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Database Schema

### Tables

- `users`: guest/admin identity, contact info, auth hash, language preference
- `rooms`: room metadata, pricing, amenities, gallery, availability, highlight flags
- `bookings`: reservation dates, guests, totals, taxes, booking reference, status
- `services`: hotel wellness and hospitality offerings
- `reviews`: guest room reviews with score/title/comment
- `payments`: per-booking payment record and transaction reference

## API Surface

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Hotel content

- `GET /api/v1/hotel/summary`
- `GET /api/v1/services`
- `GET /api/v1/rooms`
- `GET /api/v1/rooms/{slug}`
- `GET /api/v1/reviews`
- `POST /api/v1/reviews`

### Booking system

- `POST /api/v1/bookings/quote`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `DELETE /api/v1/bookings/{booking_id}`

### Admin

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/bookings`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/rooms`
- `PUT /api/v1/admin/rooms/{room_id}`
- `DELETE /api/v1/admin/rooms/{room_id}`

## Booking Logic

- Validates check-in/check-out chronology
- Rejects overlapping confirmed/pending bookings for a room
- Enforces room capacity
- Calculates nights, subtotal, 12% taxes, and total automatically
- Generates booking and payment references on confirmation
- Marks payment as refunded when a booking is cancelled

## Run Locally

### Backend

1. Create a virtual environment.
2. Install dependencies with `pip install -r requirements.txt`
3. Copy `.env.example` to `.env`
4. Start PostgreSQL and update `DATABASE_URL` if needed
5. Run `python run_api.py`

### Frontend

1. Go to `frontend/`
2. Install dependencies with `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Run `npm run dev`

## Run With Docker

1. Copy `.env.example` to `.env`
2. Run `docker compose up --build`
3. Open:
   - Frontend: `http://localhost:3000`
   - API docs: `http://localhost:8000/docs`

## Default Seed Accounts

- Admin email: `admin@diyorhotel.uz`
- Admin password: `ChangeMe123!`
- Demo guest email: `guest@diyorhotel.uz`
- Demo guest password: `Guest123!`

## Deployment Notes

- Backend container is exposed on port `8000`
- Frontend container is exposed on port `3000`
- Replace the demo secret and default passwords before production deployment
- Move from `create_all` to Alembic migrations for long-term production lifecycle management

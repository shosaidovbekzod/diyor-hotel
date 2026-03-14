# DIYOR HOTEL - TOSHKENT

Bu loyiha DIYOR HOTEL uchun qilingan mehmonxona sayti va bron tizimi.

Ichida mehmonlar uchun xonalarni ko'rish, bron qilish, akkaunt orqali bron tarixini kuzatish, admin orqali esa bronlar va mijozlarni boshqarish imkoniyati bor. Frontend `Next.js` da, backend `FastAPI` da yozilgan.

## Nimalar bor

- bosh sahifa
- xonalar sahifasi
- xona detail sahifasi
- bron qilish oqimi
- akkaunt bo'limi
- admin panel
- o'zbek, ingliz va rus tillari

## Texnologiyalar

- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Auth: JWT
- Database: PostgreSQL

## Lokal ishga tushirish

Avval backend:

```bash
pip install -r requirements.txt
python run_api.py
```

Keyin frontend:

```bash
cd frontend
npm install
npm run dev
```

Agar kerak bo'lsa `frontend/.env.local` ichiga mana buni yozing:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Docker bilan ishga tushirish

```bash
docker compose up --build
```

Shundan keyin:

- frontend: `http://localhost:3000`
- backend docs: `http://localhost:8000/docs`

## Asosiy API lar

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/rooms`
- `GET /api/v1/rooms/{slug}`
- `POST /api/v1/bookings/quote`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `GET /api/v1/admin/dashboard`
- `PATCH /api/v1/admin/bookings/{booking_id}/status`

## Admin va mehmon akkauntlari

Admin:

- email: `admin@diyorhotel.uz`
- parol: `ChangeMe123!`

Mehmon:

- email: `guest@diyorhotel.uz`
- parol: `Guest123!`

## Eslatma

- Productionga chiqarishda default parollarni almashtirish kerak.
- `SECRET_KEY` ni kuchliroq qiymatga almashtirish kerak.
- Render free rejimida sayt ba'zan birinchi ochilganda sekin yuklanishi mumkin.

## Aloqa

- Manzil: Olmos 74A ko'chasi, Toshkent
- Telefon: +998 88 589 33 33
- Telegram: https://t.me/diyor_hoteln11
- YouTube: https://www.youtube.com/@Diyorhoteluz

## Muallif

# SHosaidov Bekzod

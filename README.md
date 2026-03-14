# DIYOR HOTEL - TOSHKENT

DIYOR HOTEL uchun ishlab chiqilgan zamonaviy to'liq stack mehmonxona bron platformasi. Loyihada mehmonlar uchun premium booking oqimi, admin boshqaruvi, xonalar katalogi, ko'p tilli interfeys va deployga tayyor backend/frontend infratuzilmasi mavjud.

## Texnologiyalar

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend: FastAPI, SQLAlchemy, JWT autentifikatsiya
- Ma'lumotlar bazasi: PostgreSQL
- Kesh: Redis (`docker-compose.yml` ichida ixtiyoriy)
- Deploy: Docker, Docker Compose, Render

## Loyiha tuzilmasi

```text
.
|-- app
|   |-- api
|   |-- core
|   |-- db
|   |-- models
|   |-- schemas
|   `-- services
|-- frontend
|   |-- app
|   |-- components
|   |-- lib
|   `-- public
|-- Dockerfile
|-- docker-compose.yml
|-- render.yaml
|-- requirements.txt
|-- run_api.py
`-- README.md
```

## Asosiy imkoniyatlar

### Mehmonlar uchun

- bosh sahifa, premium hero video va promo bloklar
- xonalarni qidirish va filterlash
- jonli narx hisoblash
- bron yuborish va bron tarixini ko'rish
- xizmatlar, sharhlar va kontaktlar sahifasi
- o'zbek, ingliz va rus tillari

### Admin uchun

- admin login
- bronlar ro'yxati
- bron statusini tasdiqlash, bekor qilish va yakunlash
- faol bronlar va mijozlar tarixi
- foydalanuvchilar, xonalar va tushum ko'rsatkichlari

## Backend imkoniyatlari

- foydalanuvchi ro'yxatdan o'tkazish va login
- JWT token orqali himoyalangan endpointlar
- xonalar va xizmatlar API
- bron quote, yaratish, bekor qilish
- admin dashboard va booking status update
- boshlang'ich ma'lumotlarni seed qilish

## Ma'lumotlar bazasi jadvallari

- `users`
- `rooms`
- `bookings`
- `services`
- `reviews`
- `payments`

## API endpointlar

### Autentifikatsiya

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Kontent

- `GET /api/v1/hotel/summary`
- `GET /api/v1/services`
- `GET /api/v1/rooms`
- `GET /api/v1/rooms/{slug}`
- `GET /api/v1/reviews`
- `POST /api/v1/reviews`

### Bron tizimi

- `POST /api/v1/bookings/quote`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `DELETE /api/v1/bookings/{booking_id}`

### Admin

- `GET /api/v1/admin/dashboard`
- `PATCH /api/v1/admin/bookings/{booking_id}/status`
- `GET /api/v1/admin/bookings`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/rooms`
- `PUT /api/v1/admin/rooms/{room_id}`
- `DELETE /api/v1/admin/rooms/{room_id}`

## Lokal ishga tushirish

### Backend

1. Virtual environment yarating.
2. Kutubxonalarni o'rnating:

```bash
pip install -r requirements.txt
```

3. `.env` faylini tayyorlang.
4. `DATABASE_URL` ni moslab qo'ying.
5. Backendni ishga tushiring:

```bash
python run_api.py
```

### Frontend

1. `frontend` papkasiga kiring:

```bash
cd frontend
```

2. Kutubxonalarni o'rnating:

```bash
npm install
```

3. `.env.local` fayl yarating:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Frontendni ishga tushiring:

```bash
npm run dev
```

## Docker bilan ishga tushirish

1. `.env` faylini tayyorlang.
2. Quyidagini ishga tushiring:

```bash
docker compose up --build
```

3. So'ng quyidagi manzillarni oching:
- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

## Tekin deploy

Loyiha Render va Supabase orqali tekin rejimda ham ishga tushirilishi mumkin.

- Render konfiguratsiyasi: `render.yaml`
- Qadam-baqadam deploy yo'riqnomasi: `DEPLOY_FREE_UZ.md`

## Boshlang'ich akkauntlar

- Admin email: `admin@diyorhotel.uz`
- Admin parol: `ChangeMe123!`
- Mehmon email: `guest@diyorhotel.uz`
- Mehmon parol: `Guest123!`

## Muhim eslatmalar

- Production uchun kuchli `SECRET_KEY` ishlating.
- Default parollarni albatta almashtiring.
- Uzoq muddatli production lifecycle uchun `create_all` o'rniga Alembic migratsiyalariga o'tish tavsiya qilinadi.
- Render free rejimida servis ma'lum vaqtdan keyin uyqu rejimiga o'tishi mumkin.

## Aloqa ma'lumotlari

- Manzil: Olmos 74A ko'chasi, Toshkent, O'zbekiston
- Telefon: +998 88 589 33 33
- Telegram: https://t.me/diyor_hoteln11
- YouTube: https://www.youtube.com/@Diyorhoteluz

## Muallif

# YARATUVCHI: SHosaidov Bekzod

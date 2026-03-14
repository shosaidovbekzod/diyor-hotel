# Bepul Deploy Qo'llanma

Bu loyiha Render + Supabase orqali tekin sinov muhiti sifatida internetga chiqarilishi mumkin.

## 1. Supabase

1. Supabase'da yangi project yarating.
2. `Connect` oynasiga kiring.
3. `Method` ichidan `Session pooler` ni tanlang.
4. Connection string'ni oling.
5. Uni `postgresql+psycopg2://` formatiga o'tkazing.

Misol:

```env
postgresql+psycopg2://postgres.projectref:PAROL@aws-1-region.pooler.supabase.com:5432/postgres
```

## 2. Render Blueprint

Repo root ichida `render.yaml` tayyor turibdi.

Render'da:

1. Dashboard -> `New`
2. `Blueprint`
3. GitHub repo sifatida `diyor-hotel` ni tanlang
4. `render.yaml` avtomatik o'qiladi

## 3. Render Environment Variables

Backend uchun quyidagilarni kiriting:

- `DATABASE_URL` -> Supabase string
- `FRONTEND_URL` -> frontend deploy bo'lgach chiqqan URL
- `FIRST_ADMIN_PASSWORD` -> admin paroli

Frontend uchun:

- `NEXT_PUBLIC_API_URL` -> `/api/v1`
- `INTERNAL_API_URL` -> `https://BACKEND-URL.onrender.com/api/v1`
- `BACKEND_ORIGIN` -> `https://BACKEND-URL.onrender.com`

## 4. Tavsiya etilgan qiymatlar

Backend:

```env
FIRST_ADMIN_EMAIL=admin@hotel.com
FIRST_ADMIN_PASSWORD=password
```

Frontend admin login uchun shu credential ishlatiladi.

## 5. Tekshirish

Backend:

- `/`
- `/docs`

Frontend:

- `/`
- `/rooms`
- `/account`
- `/admin`

## 6. Eslatma

Free Render servislar idle holatda uxlab qoladi. Birinchi request sekin ochilishi mumkin.

## 7. Bitta domen ostida ishlatish

Render Hobby'da custom domain'lar limiti bor, shuning uchun eng qulay yo'l:

- frontend'ga bitta domen ulang, masalan `diyorhotel.uz`
- backend'ni `onrender.com` da qoldiring
- frontend ichida `/api/*` so'rovlari backend'ga proksi bo'ladi

Shunda foydalanuvchi oldida bitta domen ko'rinadi:

- website: `https://diyorhotel.uz`
- API requestlar: `https://diyorhotel.uz/api/v1/...`

"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard, login, type AdminDashboard, type Booking } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

const ADMIN_TOKEN_KEY = "diyor_admin_token";

const adminUiCopy: Record<
  Language,
  {
    signInHelp: string;
    signedIn: string;
    refresh: string;
    noCurrentBookings: string;
    noHistory: string;
    noUsers: string;
    noRooms: string;
    guest: string;
    phone: string;
    room: string;
    roomNumber: string;
    dates: string;
    total: string;
    guestsCount: string;
    createdAt: string;
    specialRequest: string;
    usersTitle: string;
    roomsTitle: string;
    roomRate: string;
    availability: string;
    availableNow: string;
    unavailable: string;
    loading: string;
    activeList: string;
    historyList: string;
    bookingDetails: string;
    autoArchive: string;
  }
> = {
  en: {
    signInHelp: "Sign in with the admin email and password to open live operations.",
    signedIn: "Admin session is active. New bookings refresh automatically.",
    refresh: "Refresh",
    noCurrentBookings: "There are no active bookings right now.",
    noHistory: "Completed or cancelled bookings will appear here automatically.",
    noUsers: "No guest accounts found yet.",
    noRooms: "No room inventory loaded yet.",
    guest: "Guest",
    phone: "Phone",
    room: "Room",
    roomNumber: "Room number",
    dates: "Stay dates",
    total: "Total",
    guestsCount: "Guests",
    createdAt: "Booked at",
    specialRequest: "Special request",
    usersTitle: "Guest directory",
    roomsTitle: "Room inventory",
    roomRate: "Rate",
    availability: "Availability",
    availableNow: "Available now",
    unavailable: "Unavailable",
    loading: "Loading dashboard...",
    activeList: "Active bookings",
    historyList: "Customer history",
    bookingDetails: "Booking details",
    autoArchive: "Bookings move here automatically after the reservation period passes."
  },
  uz: {
    signInHelp: "Jonli operatsiyalarni ochish uchun admin email va parolini kiriting.",
    signedIn: "Admin sessiyasi faol. Yangi bronlar avtomatik yangilanadi.",
    refresh: "Yangilash",
    noCurrentBookings: "Hozir faol bronlar yo'q.",
    noHistory: "Tugagan yoki bekor qilingan bronlar shu yerga avtomatik o'tadi.",
    noUsers: "Hozircha mehmon akkauntlari topilmadi.",
    noRooms: "Xonalar inventari hali yuklanmadi.",
    guest: "Mehmon",
    phone: "Telefon",
    room: "Xona",
    roomNumber: "Xona raqami",
    dates: "Turar sanalari",
    total: "Jami",
    guestsCount: "Mehmonlar soni",
    createdAt: "Bron qilingan vaqt",
    specialRequest: "Maxsus so'rov",
    usersTitle: "Mehmonlar ro'yxati",
    roomsTitle: "Xonalar inventari",
    roomRate: "Narx",
    availability: "Mavjudlik",
    availableNow: "Hozir mavjud",
    unavailable: "Mavjud emas",
    loading: "Panel yuklanmoqda...",
    activeList: "Faol bronlar",
    historyList: "Mijozlar tarixi",
    bookingDetails: "Bron tafsilotlari",
    autoArchive: "Bron muddati tugashi bilan yozuv avtomatik ravishda tarix bo'limiga o'tadi."
  },
  ru: {
    signInHelp: "Введите email и пароль администратора, чтобы открыть живые операции.",
    signedIn: "Сессия администратора активна. Новые брони обновляются автоматически.",
    refresh: "Обновить",
    noCurrentBookings: "Сейчас нет активных бронирований.",
    noHistory: "Завершенные и отмененные бронирования будут появляться здесь автоматически.",
    noUsers: "Гостевые аккаунты пока не найдены.",
    noRooms: "Инвентарь номеров пока не загружен.",
    guest: "Гость",
    phone: "Телефон",
    room: "Номер",
    roomNumber: "Номер комнаты",
    dates: "Даты проживания",
    total: "Итого",
    guestsCount: "Количество гостей",
    createdAt: "Забронировано",
    specialRequest: "Особое пожелание",
    usersTitle: "База гостей",
    roomsTitle: "Инвентарь номеров",
    roomRate: "Тариф",
    availability: "Доступность",
    availableNow: "Доступно",
    unavailable: "Недоступно",
    loading: "Панель загружается...",
    activeList: "Активные брони",
    historyList: "История клиентов",
    bookingDetails: "Детали брони",
    autoArchive: "После окончания срока брони запись автоматически переходит в историю."
  }
};

type BookingView = "current" | "history";

export function AdminPanel({ lang }: { lang: Language }) {
  const copy = t(lang).admin;
  const ui = adminUiCopy[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [message, setMessage] = useState(ui.signInHelp);
  const [pending, setPending] = useState(false);
  const [view, setView] = useState<BookingView>("current");

  useEffect(() => {
    setMessage((current) => (current === ui.signInHelp || current === ui.signedIn ? ui.signInHelp : current));
  }, [ui.signInHelp, ui.signedIn]);

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
    if (!stored) {
      return;
    }
    setToken(stored);
    void hydrateDashboard(stored, ui.signedIn, true);
  }, [ui.signedIn]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void hydrateDashboard(token, ui.signedIn, false);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [token, ui.signedIn]);

  async function hydrateDashboard(nextToken: string, successMessage: string, clearOnError: boolean) {
    setPending(true);
    try {
      const data = await getAdminDashboard(nextToken);
      setDashboard(data);
      setMessage(successMessage);
    } catch {
      if (clearOnError) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken("");
        setDashboard(null);
      }
      setMessage(copy.error);
    } finally {
      setPending(false);
    }
  }

  async function loadDashboard() {
    setPending(true);
    try {
      const auth = await login(email, password);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, auth.access_token);
      setToken(auth.access_token);
      const data = await getAdminDashboard(auth.access_token);
      setDashboard(data);
      setMessage(copy.loaded);
    } catch {
      setMessage(copy.error);
    } finally {
      setPending(false);
    }
  }

  function logoutAdmin() {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setDashboard(null);
    setEmail("");
    setPassword("");
    setMessage(ui.signInHelp);
    setView("current");
  }

  const currentBookings = dashboard?.current_bookings ?? [];
  const historyBookings = dashboard?.customer_history ?? [];
  const visibleBookings = view === "current" ? currentBookings : historyBookings;
  const emptyMessage = view === "current" ? ui.noCurrentBookings : ui.noHistory;

  const bookingCountLabel = `${visibleBookings.length} ${view === "current" ? ui.activeList : ui.historyList}`;

  return (
    <div className="space-y-10">
      <section className="editorial-panel p-8 md:p-10">
        <div className="section-label">{copy.access}</div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 className="font-display text-5xl leading-none text-ink">{copy.ops}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">{message}</p>
          </div>
          <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone">
            {token ? copy.loaded : copy.access}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[1fr_1fr_auto_auto]">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="editorial-input"
            placeholder={copy.email}
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="editorial-input"
            placeholder={copy.password}
            autoComplete="current-password"
          />
          <button onClick={loadDashboard} disabled={pending} className="editorial-button disabled:opacity-60">
            {copy.load}
          </button>
          {token ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void hydrateDashboard(token, copy.loaded, false)}
                disabled={pending}
                className="editorial-button-secondary disabled:opacity-60"
              >
                {ui.refresh}
              </button>
              <button onClick={logoutAdmin} className="editorial-button-secondary">
                {copy.logout}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {dashboard ? (
        <>
          <div className="grid gap-px border border-[#d8cfc2] bg-[#d8cfc2] md:grid-cols-5">
            <Metric label={copy.revenue} value={`${Number(dashboard.analytics.total_revenue).toLocaleString("en-US")} UZS`} />
            <Metric label={copy.bookings} value={dashboard.analytics.total_bookings} />
            <Metric label={copy.active} value={dashboard.analytics.active_bookings} />
            <Metric label={copy.occupancy} value={`${dashboard.analytics.occupancy_rate}%`} />
            <Metric label={copy.users} value={dashboard.analytics.users_count} />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.78fr_0.78fr]">
            <section className="editorial-panel overflow-hidden">
              <div className="border-b border-[#d8cfc2] p-8">
                <div className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <div className="section-label">{ui.bookingDetails}</div>
                    <h3 className="mt-4 font-display text-4xl text-ink">
                      {view === "current" ? ui.activeList : ui.historyList}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/68">{ui.autoArchive}</p>
                  </div>
                  <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-stone">
                    {bookingCountLabel}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setView("current")}
                    className={view === "current" ? "editorial-button" : "editorial-button-secondary"}
                  >
                    {ui.activeList}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("history")}
                    className={view === "history" ? "editorial-button" : "editorial-button-secondary"}
                  >
                    {ui.historyList}
                  </button>
                </div>
              </div>

              {visibleBookings.length === 0 ? (
                <div className="p-8 text-sm leading-7 text-ink/68">{emptyMessage}</div>
              ) : null}

              {visibleBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  ui={ui}
                  className={index > 0 ? "border-t border-[#d8cfc2]" : ""}
                />
              ))}
            </section>

            <section className="editorial-panel">
              <div className="border-b border-[#d8cfc2] p-8">
                <div className="section-label">{copy.users}</div>
                <h3 className="mt-4 font-display text-4xl text-ink">{ui.usersTitle}</h3>
              </div>
              {dashboard.users.length === 0 ? (
                <div className="p-8 text-sm text-ink/68">{ui.noUsers}</div>
              ) : null}
              {dashboard.users.map((user, index) => (
                <div key={user.id} className={`p-8 ${index > 0 ? "border-t border-[#d8cfc2]" : ""}`}>
                  <div className="font-display text-2xl text-ink">{user.full_name}</div>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-ink/72">
                    <div>{user.email}</div>
                    {user.phone ? <div>{user.phone}</div> : null}
                  </div>
                </div>
              ))}
            </section>

            <section className="editorial-panel">
              <div className="border-b border-[#d8cfc2] p-8">
                <div className="section-label">{ui.roomsTitle}</div>
                <h3 className="mt-4 font-display text-4xl text-ink">{ui.roomsTitle}</h3>
              </div>
              {dashboard.rooms.length === 0 ? (
                <div className="p-8 text-sm text-ink/68">{ui.noRooms}</div>
              ) : null}
              {dashboard.rooms.map((room, index) => (
                <div key={room.id} className={`grid gap-4 p-8 ${index > 0 ? "border-t border-[#d8cfc2]" : ""}`}>
                  <div>
                    <div className="font-display text-2xl text-ink">{room.title}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">
                      {room.room_number} · {room.view_label || room.bed_type}
                    </div>
                  </div>
                  <div className="grid gap-4 text-sm text-ink/72">
                    <div>
                      <div className="section-label">{ui.roomRate}</div>
                      <div className="mt-3">{Number(room.display_price).toLocaleString("en-US")} UZS</div>
                    </div>
                    <div>
                      <div className="section-label">{ui.availability}</div>
                      <div className="mt-3">
                        {room.is_available ? ui.availableNow : ui.unavailable}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </>
      ) : (
        <div className="editorial-panel p-8 text-sm text-ink/68">{pending ? ui.loading : ui.signInHelp}</div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  ui,
  className
}: {
  booking: Booking;
  ui: (typeof adminUiCopy)[Language];
  className?: string;
}) {
  return (
    <div className={`grid gap-5 p-8 ${className ?? ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="section-label">{ui.room}</div>
          <h4 className="mt-3 font-display text-3xl text-ink">{booking.room.title}</h4>
          <div className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">
            {booking.booking_reference}
          </div>
        </div>
        <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-stone">
          {booking.status}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InfoBlock label={ui.guest} value={booking.user?.full_name || "-"} />
        <InfoBlock label="Email" value={booking.user?.email || "-"} />
        <InfoBlock label={ui.phone} value={booking.user?.phone || "-"} />
        <InfoBlock label={ui.roomNumber} value={booking.room.room_number} />
        <InfoBlock label={ui.guestsCount} value={String(booking.guests_count)} />
        <InfoBlock label={ui.createdAt} value={formatDateTime(booking.created_at)} />
        <InfoBlock label={ui.dates} value={`${booking.check_in} - ${booking.check_out}`} />
        <InfoBlock label={ui.total} value={`${Number(booking.total_price).toLocaleString("en-US")} UZS`} />
      </div>

      {booking.special_request ? (
        <div className="border-t border-[#d8cfc2] pt-4 text-sm leading-7 text-ink/68">
          <span className="section-label">{ui.specialRequest}</span>
          <div className="mt-3">{booking.special_request}</div>
        </div>
      ) : null}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#e2d8ca] bg-white/70 p-4">
      <div className="section-label">{label}</div>
      <div className="mt-3 text-sm leading-7 text-ink/78">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/80 p-6">
      <div className="section-label">{label}</div>
      <div className="mt-4 font-display text-4xl text-ink">{value}</div>
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsed);
}

"use client";

import { useEffect, useState } from "react";
import { type AdminDashboard, getAdminDashboard, login } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

const ADMIN_TOKEN_KEY = "diyor_admin_token";

const adminUiCopy: Record<
  Language,
  {
    signInHelp: string;
    signedIn: string;
    refresh: string;
    noBookings: string;
    guest: string;
    dates: string;
    total: string;
    status: string;
    specialRequest: string;
  }
> = {
  en: {
    signInHelp: "Sign in with the admin email and password to open the dashboard.",
    signedIn: "Admin session is active. New bookings refresh automatically.",
    refresh: "Refresh",
    noBookings: "No bookings have been created yet.",
    guest: "Guest",
    dates: "Stay dates",
    total: "Total",
    status: "Status",
    specialRequest: "Special request"
  },
  uz: {
    signInHelp: "Panelni ochish uchun admin email va parolini kiriting.",
    signedIn: "Admin sessiyasi faol. Yangi bronlar avtomatik yangilanadi.",
    refresh: "Yangilash",
    noBookings: "Hozircha bronlar yaratilmagan.",
    guest: "Mehmon",
    dates: "Turar sanalari",
    total: "Jami",
    status: "Holat",
    specialRequest: "Maxsus so'rov"
  },
  ru: {
    signInHelp: "Войдите с admin email и паролем, чтобы открыть панель.",
    signedIn: "Сессия админа активна. Новые брони обновляются автоматически.",
    refresh: "Обновить",
    noBookings: "Бронирований пока нет.",
    guest: "Гость",
    dates: "Даты проживания",
    total: "Итого",
    status: "Статус",
    specialRequest: "Особое пожелание"
  }
};

export function AdminPanel({ lang }: { lang: Language }) {
  const copy = t(lang).admin;
  const ui = adminUiCopy[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [message, setMessage] = useState<string>(ui.signInHelp);
  const [pending, setPending] = useState(false);

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
  }

  const recentBookings = dashboard?.recent_bookings ?? [];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.access}</div>
        <h2 className="mt-2 font-display text-3xl">{copy.ops}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-ink/10 px-5 py-3"
            placeholder={copy.email}
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-ink/10 px-5 py-3"
            placeholder={copy.password}
            autoComplete="current-password"
          />
          <button
            onClick={loadDashboard}
            disabled={pending}
            className="rounded-full bg-ink px-5 py-3 text-white disabled:opacity-60"
          >
            {copy.load}
          </button>
          {token ? (
            <>
              <button
                onClick={() => void hydrateDashboard(token, copy.loaded, false)}
                disabled={pending}
                className="rounded-full border border-ink/15 px-5 py-3 disabled:opacity-60"
              >
                {ui.refresh}
              </button>
              <button onClick={logoutAdmin} className="rounded-full border border-ink/15 px-5 py-3">
                {copy.logout}
              </button>
            </>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-ink/60">{message}</p>
      </div>

      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-5">
            <Metric label={copy.revenue} value={`${Number(dashboard.analytics.total_revenue).toLocaleString("en-US")} UZS`} />
            <Metric label={copy.bookings} value={dashboard.analytics.total_bookings} />
            <Metric label={copy.active} value={dashboard.analytics.active_bookings} />
            <Metric label={copy.occupancy} value={`${dashboard.analytics.occupancy_rate}%`} />
            <Metric label={copy.users} value={dashboard.analytics.users_count} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="font-display text-2xl">{copy.recent}</h3>
              <div className="mt-4 space-y-3">
                {recentBookings.length === 0 ? (
                  <div className="rounded-2xl bg-sand p-4 text-sm text-ink/65">{ui.noBookings}</div>
                ) : null}
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-sand p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{booking.room.title}</div>
                        <div className="text-ink/60">{booking.booking_reference}</div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs capitalize">{booking.status}</div>
                    </div>
                    {booking.user ? (
                      <div className="mt-3 text-ink/70">
                        {ui.guest}: {booking.user.full_name} ({booking.user.email})
                      </div>
                    ) : null}
                    <div className="mt-2 text-ink/70">
                      {ui.dates}: {booking.check_in} - {booking.check_out}
                    </div>
                    <div className="mt-2 text-ink/70">
                      {ui.total}: {Number(booking.total_price).toLocaleString("en-US")} UZS
                    </div>
                    {booking.special_request ? (
                      <div className="mt-2 text-ink/70">
                        {ui.specialRequest}: {booking.special_request}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-2xl">{copy.users}</h3>
              <div className="mt-4 space-y-3">
                {dashboard.users.map((user) => (
                  <div key={user.id} className="rounded-2xl bg-sand p-4 text-sm">
                    <div className="font-medium">{user.full_name}</div>
                    <div>{user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{label}</div>
      <div className="mt-3 font-display text-3xl">{value}</div>
    </div>
  );
}

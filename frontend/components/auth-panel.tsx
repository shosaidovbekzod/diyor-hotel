"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cancelBooking, getCurrentUser, getMyBookings, login, register, type Booking } from "@/lib/api";
import { localizeRoom } from "@/lib/content";
import { t, type Language } from "@/lib/i18n";

type Profile = {
  full_name: string;
  email: string;
  phone?: string | null;
} | null;

type AuthPanelProps = {
  lang: Language;
};

const authUiCopy: Record<
  Language,
  {
    profileSummary: string;
    historySummary: string;
    stayDates: string;
    request: string;
    loading: string;
  }
> = {
  en: {
    profileSummary: "Your saved guest details will be attached to every confirmed reservation.",
    historySummary: "Every confirmed or cancelled stay appears here once you are signed in.",
    stayDates: "Stay dates",
    request: "Special request",
    loading: "Loading reservations..."
  },
  uz: {
    profileSummary: "Saqlangan mehmon ma'lumotlaringiz har bir tasdiqlangan bron bilan bog'lanadi.",
    historySummary: "Kirgandan keyin barcha tasdiqlangan va bekor qilingan turar joylar shu yerda ko'rinadi.",
    stayDates: "Turar sanalari",
    request: "Maxsus so'rov",
    loading: "Bronlar yuklanmoqda..."
  },
  ru: {
    profileSummary:
      "Сохраненные данные гостя будут привязаны к каждому подтвержденному бронированию.",
    historySummary: "Все подтвержденные и отмененные проживания появляются здесь после входа.",
    stayDates: "Даты проживания",
    request: "Особое пожелание",
    loading: "Загрузка бронирований..."
  }
};

export function AuthPanel({ lang }: AuthPanelProps) {
  const copy = t(lang).account;
  const ui = authUiCopy[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    const stored = window.localStorage.getItem("diyor_token") ?? "";
    setToken(stored);
    if (stored) {
      void hydrate(stored);
    }
  }, []);

  useEffect(() => {
    if (token && returnTo) {
      router.replace(returnTo);
    }
  }, [token, returnTo, router]);

  async function hydrate(nextToken: string) {
    setLoading(true);
    try {
      const [nextBookings, nextProfile] = await Promise.all([
        getMyBookings(nextToken),
        getCurrentUser(nextToken)
      ]);
      setBookings(nextBookings);
      setProfile(nextProfile);
    } catch {
      window.localStorage.removeItem("diyor_token");
      setToken("");
      setBookings([]);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setPending(true);
    try {
      const response = await login(email, password);
      window.localStorage.setItem("diyor_token", response.access_token);
      setToken(response.access_token);
      await hydrate(response.access_token);
      setMessage(copy.loginSuccess);
      if (returnTo) {
        router.replace(returnTo);
      }
    } catch {
      setMessage(copy.loginError);
    } finally {
      setPending(false);
    }
  }

  async function handleRegister() {
    setPending(true);
    try {
      await register({ full_name: name, email, phone, password });
      const response = await login(email, password);
      window.localStorage.setItem("diyor_token", response.access_token);
      setToken(response.access_token);
      await hydrate(response.access_token);
      setMessage(copy.loginSuccess);
      if (returnTo) {
        router.replace(returnTo);
      }
    } catch {
      setMessage(copy.registerError);
    } finally {
      setPending(false);
    }
  }

  async function handleCancel(bookingId: number) {
    if (!token) {
      return;
    }
    setPending(true);
    try {
      await cancelBooking(token, bookingId);
      await hydrate(token);
      setMessage(copy.cancelSuccess);
    } catch {
      setMessage(copy.cancelError);
    } finally {
      setPending(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("diyor_token");
    setToken("");
    setProfile(null);
    setBookings([]);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("+998");
    setMessage(copy.logoutSuccess);
  }

  const totalSpent = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
        .reduce((sum, booking) => sum + Number(booking.total_price || 0), 0),
    [bookings]
  );
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const activeBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const historyBookings = bookings.filter(
    (booking) => booking.status === "cancelled" || booking.status === "completed"
  ).length;

  return (
    <div className="space-y-10">
      <div className="grid gap-px border border-[#d8cfc2] bg-[#d8cfc2] md:grid-cols-4">
        <MetricCard label={copy.totalSpent} value={`${totalSpent.toLocaleString("en-US")} UZS`} />
        <MetricCard label={copy.pendingRequests} value={pendingBookings} />
        <MetricCard label={copy.upcoming} value={activeBookings} />
        <MetricCard label={copy.historyCount} value={historyBookings} />
      </div>

      <div className="grid gap-10 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="editorial-panel p-8 md:p-10">
          <div className="section-label">{copy.accessEyebrow}</div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h2 className="font-display text-5xl leading-none text-ink">{copy.accessTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-ink/72">{copy.accessDescription}</p>
            </div>
            <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone">
              {token ? copy.authenticated : copy.session}
            </div>
          </div>

          <div className="mt-10 grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-ink/68">
                <span>{copy.fullName}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="editorial-input"
                  placeholder={copy.fullName}
                />
              </label>
              <label className="space-y-2 text-sm text-ink/68">
                <span>{copy.phone}</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="editorial-input"
                  placeholder={copy.phone}
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-ink/68">
              <span>{copy.email}</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="editorial-input"
                placeholder={copy.email}
                autoComplete="username"
              />
            </label>

            <label className="space-y-2 text-sm text-ink/68">
              <span>{copy.password}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="editorial-input"
                placeholder={copy.password}
                autoComplete="current-password"
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleLogin}
                disabled={pending}
                className="editorial-button disabled:opacity-60"
              >
                {copy.login}
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={pending}
                className="editorial-button-secondary disabled:opacity-60"
              >
                {copy.register}
              </button>
              {token ? (
                <button type="button" onClick={handleLogout} className="editorial-button-secondary">
                  {copy.logout}
                </button>
              ) : null}
            </div>

            <div className="border-t border-[#d8cfc2] pt-5 text-sm leading-7 text-ink/68">
              {message || ui.profileSummary}
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-[#d8cfc2] pt-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="section-label">{copy.guestProfile}</div>
              <h3 className="mt-4 font-display text-3xl text-ink">
                {profile?.full_name ?? copy.notSignedIn}
              </h3>
              <div className="mt-4 space-y-2 text-sm leading-7 text-ink/72">
                <div>{profile?.email ?? copy.registerHint}</div>
                {profile?.phone ? <div>{profile.phone}</div> : null}
              </div>
            </div>
            <div className="max-w-xs text-sm leading-7 text-ink/68">{ui.profileSummary}</div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8cfc2] pb-5">
            <div>
              <div className="section-label">{copy.bookingsEyebrow}</div>
              <h2 className="mt-4 font-display text-5xl leading-none text-ink">{copy.bookingsTitle}</h2>
            </div>
            <div className="max-w-sm text-sm leading-7 text-ink/68">{ui.historySummary}</div>
          </div>

          <div className="editorial-panel">
            {loading ? <div className="p-8 text-sm text-ink/68">{ui.loading}</div> : null}
            {!loading && bookings.length === 0 ? (
              <div className="p-8 text-sm leading-7 text-ink/68">{copy.noBookings}</div>
            ) : null}
            {bookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`grid gap-5 p-8 ${index > 0 ? "border-t border-[#d8cfc2]" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="section-label">{copy.bookingReference}</div>
                    <h3 className="mt-3 font-display text-3xl text-ink">
                      {localizeRoom(booking.room, lang).title}
                    </h3>
                    <div className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">
                      {booking.booking_reference}
                    </div>
                  </div>
                  <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-stone">
                    {localizeStatus(booking.status, copy)}
                  </div>
                </div>

                <div className="grid gap-5 text-sm text-ink/72 md:grid-cols-2">
                  <div>
                    <div className="section-label">{ui.stayDates}</div>
                    <div className="mt-3">
                      {booking.check_in} - {booking.check_out}
                    </div>
                  </div>
                  <div>
                    <div className="section-label">{copy.totalSpent}</div>
                    <div className="mt-3">{Number(booking.total_price).toLocaleString("en-US")} UZS</div>
                  </div>
                </div>

                {booking.special_request ? (
                  <div className="border-t border-[#d8cfc2] pt-4 text-sm leading-7 text-ink/68">
                    <span className="section-label">{ui.request}</span>
                    <div className="mt-3">{booking.special_request}</div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {booking.room.amenities?.slice(0, 4).map((amenity: string) => (
                    <span
                      key={amenity}
                      className="border border-[#d8cfc2] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-stone"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {booking.status === "pending" || booking.status === "confirmed" ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => void handleCancel(booking.id)}
                      className="editorial-button-secondary"
                    >
                      {copy.cancel}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function localizeStatus(status: string, copy: ReturnType<typeof t>["account"]) {
  if (status === "pending") {
    return copy.pendingStatus;
  }
  if (status === "confirmed") {
    return copy.confirmedStatus;
  }
  if (status === "cancelled") {
    return copy.cancelledStatus;
  }
  return copy.completedStatus;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/80 p-6">
      <div className="section-label">{label}</div>
      <div className="mt-4 font-display text-4xl text-ink">{value}</div>
    </div>
  );
}

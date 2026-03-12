"use client";

import { useEffect, useMemo, useState } from "react";
import { cancelBooking, getCurrentUser, getMyBookings, login, register } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

type AuthPanelProps = {
  lang: Language;
};

export function AuthPanel({ lang }: AuthPanelProps) {
  const copy = t(lang).account;
  const [email, setEmail] = useState("guest@diyorhotel.uz");
  const [password, setPassword] = useState("Guest123!");
  const [name, setName] = useState("New Guest");
  const [phone, setPhone] = useState("+998");
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("diyor_token") ?? "";
    setToken(stored);
    if (stored) {
      void hydrate(stored);
    }
  }, []);

  async function hydrate(nextToken: string) {
    setLoading(true);
    const [nextBookings, nextProfile] = await Promise.all([
      getMyBookings(nextToken),
      getCurrentUser(nextToken)
    ]);
    setBookings(nextBookings);
    setProfile(nextProfile);
    setLoading(false);
  }

  async function handleLogin() {
    try {
      const response = await login(email, password);
      window.localStorage.setItem("diyor_token", response.access_token);
      setToken(response.access_token);
      await hydrate(response.access_token);
      setMessage(copy.loginSuccess);
    } catch {
      setMessage(copy.loginError);
    }
  }

  async function handleRegister() {
    try {
      await register({ full_name: name, email, phone, password });
      setMessage(copy.registerSuccess);
    } catch {
      setMessage(copy.registerError);
    }
  }

  async function handleCancel(bookingId: number) {
    if (!token) {
      return;
    }
    try {
      await cancelBooking(token, bookingId);
      await hydrate(token);
      setMessage(copy.cancelSuccess);
    } catch {
      setMessage(copy.cancelError);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("diyor_token");
    setToken("");
    setProfile(null);
    setBookings([]);
    setMessage(copy.logoutSuccess);
  }

  const totalSpent = useMemo(
    () => bookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0),
    [bookings]
  );

  const activeBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled").length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label={copy.totalSpent} value={`${totalSpent.toLocaleString("en-US")} UZS`} />
        <MetricCard label={copy.upcoming} value={activeBookings} />
        <MetricCard label={copy.completed} value={cancelledBookings} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.accessEyebrow}</div>
            <h2 className="mt-2 font-display text-3xl">{copy.accessTitle}</h2>
            <p className="mt-3 text-ink/65">{copy.accessDescription}</p>
            <div className="mt-6 space-y-4">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-ink/10 px-4 py-3" placeholder={copy.fullName} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-ink/10 px-4 py-3" placeholder={copy.email} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-ink/10 px-4 py-3" placeholder={copy.phone} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-ink/10 px-4 py-3" placeholder={copy.password} />
              <div className="flex flex-wrap gap-3">
                <button onClick={handleLogin} className="rounded-full bg-ink px-5 py-3 text-white">{copy.login}</button>
                <button onClick={handleRegister} className="rounded-full border border-ink/15 px-5 py-3">{copy.register}</button>
                {token ? <button onClick={handleLogout} className="rounded-full border border-red-200 px-5 py-3 text-red-700">{copy.logout}</button> : null}
              </div>
              {message ? <p className="text-sm text-ink/70">{message}</p> : null}
            </div>
          </div>

          <div className="card p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.guestProfile}</div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl">{profile?.full_name ?? copy.notSignedIn}</h3>
                <p className="mt-2 text-ink/60">{profile?.email ?? copy.registerHint}</p>
                {profile?.phone ? <p className="mt-1 text-ink/60">{profile.phone}</p> : null}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${token ? "bg-olive text-white" : "bg-sand text-ink/70"}`}>
                {token ? copy.authenticated : copy.session}
              </span>
            </div>
            <div className="mt-6 rounded-3xl bg-sand p-5">
              <div className="text-sm text-ink/55">{copy.quickTips}</div>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>{copy.quickTip1}</li>
                <li>{copy.quickTip2}</li>
                <li>{copy.quickTip3}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.bookingsEyebrow}</div>
              <h2 className="mt-2 font-display text-3xl">{copy.bookingsTitle}</h2>
            </div>
            {token ? <span className="rounded-full bg-olive px-3 py-1 text-xs text-white">{copy.authenticated}</span> : null}
          </div>
          <div className="mt-6 space-y-4">
            {!loading && bookings.length === 0 ? <div className="rounded-3xl bg-sand p-6 text-ink/65">{copy.noBookings}</div> : null}
            {loading ? <div className="rounded-3xl bg-sand p-6 text-ink/65">Loading...</div> : null}
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-ink/10 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{booking.room.title}</div>
                    <div className="text-sm text-ink/55">{copy.bookingReference}: {booking.booking_reference}</div>
                  </div>
                  <div className="rounded-full bg-sand px-3 py-1 text-sm capitalize">{booking.status}</div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-ink/70 md:grid-cols-2">
                  <div>{booking.check_in} - {booking.check_out}</div>
                  <div>{Number(booking.total_price).toLocaleString("en-US")} UZS</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {booking.room.amenities?.slice(0, 4).map((amenity: string) => (
                    <span key={amenity} className="rounded-full border border-ink/10 px-3 py-1 text-xs">{amenity}</span>
                  ))}
                </div>
                {booking.status !== "cancelled" ? (
                  <button onClick={() => handleCancel(booking.id)} className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm">
                    {copy.cancel}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{label}</div>
      <div className="mt-3 font-display text-3xl">{value}</div>
    </div>
  );
}

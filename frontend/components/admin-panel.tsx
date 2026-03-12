"use client";

import { useState } from "react";
import { getAdminDashboard, login } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

export function AdminPanel({ lang }: { lang: Language }) {
  const copy = t(lang).admin;
  const [email, setEmail] = useState("admin@hotel.com");
  const [password, setPassword] = useState("password");
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<any>(null);
  const [message, setMessage] = useState(copy.initial);

  async function loadDashboard() {
    try {
      const auth = await login(email, password);
      setToken(auth.access_token);
      const data = await getAdminDashboard(auth.access_token);
      setDashboard(data);
      setMessage(copy.loaded);
    } catch {
      setMessage(copy.error);
    }
  }

  function logoutAdmin() {
    setToken("");
    setDashboard(null);
    setMessage(copy.initial);
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.access}</div>
        <h2 className="mt-2 font-display text-3xl">{copy.ops}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-ink/10 px-5 py-3" placeholder={copy.email} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full border border-ink/10 px-5 py-3" placeholder={copy.password} />
          <button onClick={loadDashboard} className="rounded-full bg-ink px-5 py-3 text-white">{copy.load}</button>
          {token ? <button onClick={logoutAdmin} className="rounded-full border border-ink/15 px-5 py-3">{copy.logout}</button> : null}
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
                {dashboard.recent_bookings.map((booking: any) => (
                  <div key={booking.id} className="rounded-2xl bg-sand p-4 text-sm">
                    <div className="font-medium">{booking.booking_reference}</div>
                    <div>{booking.room.title}</div>
                    <div className="text-ink/60">{booking.check_in} - {booking.check_out}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-display text-2xl">{copy.users}</h3>
              <div className="mt-4 space-y-3">
                {dashboard.users.map((user: any) => (
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

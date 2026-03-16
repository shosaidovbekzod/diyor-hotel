"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAdminDashboard,
  login,
  updateAdminBookingStatus,
  type AdminDashboard,
  type Booking,
  type BookingStatus
} from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

const ADMIN_TOKEN_KEY = "diyor_admin_token";
const BOOKING_STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];
const INVENTORY_OVERRIDES_KEY = "diyor_inventory_overrides_v1";

type InventoryOverrideStatus = "available" | "maintenance" | "blocked";
type InventoryStatus = "available" | "booked" | "occupied" | "maintenance" | "blocked";

type InventoryCatalogItem = {
  key: string;
  title: string;
  collection: string;
  startNumber: number;
  count: number;
  rate: number;
};

type InventoryOverride = {
  status: InventoryOverrideStatus;
  note?: string;
  guestName?: string;
  guestPhone?: string;
  checkIn?: string;
  checkOut?: string;
};

type InventoryUnit = {
  id: string;
  typeKey: string;
  title: string;
  collection: string;
  unitNumber: string;
  rate: number;
};

type InventoryRow = {
  unit: InventoryUnit;
  status: InventoryStatus;
  booking?: Booking;
  override?: InventoryOverride;
};

const INVENTORY_CATALOG: InventoryCatalogItem[] = [
  {
    key: "double-room-one-bed-or-two",
    title: "Double Room with 1 Bed or 2 Separate Beds",
    collection: "Double collection",
    startNumber: 1,
    count: 30,
    rate: 420000
  },
  {
    key: "two-bedroom-suite",
    title: "2 Bedroom Suite",
    collection: "Suite collection",
    startNumber: 31,
    count: 20,
    rate: 890000
  },
  {
    key: "one-bedroom-deluxe-apartment",
    title: "1 Bedroom Deluxe Apartment",
    collection: "Deluxe apartment",
    startNumber: 51,
    count: 23,
    rate: 760000
  },
  {
    key: "deluxe-apartment-two-bedrooms",
    title: "Deluxe Apartment with 2 Bedrooms",
    collection: "Apartment collection",
    startNumber: 74,
    count: 27,
    rate: 990000
  },
  {
    key: "deluxe-apartment-three-bedrooms",
    title: "Deluxe Apartment with 3 Bedrooms",
    collection: "Residence collection",
    startNumber: 101,
    count: 17,
    rate: 1350000
  }
];

const adminUiCopy: Record<Language, Record<string, string>> = {
  en: {
    signInHelp: "Sign in with the admin email and password to open live operations.",
    signedIn: "Admin session is active. New bookings refresh automatically.",
    refresh: "Refresh",
    noCurrentBookings: "There are no active bookings right now.",
    noHistory: "Completed or cancelled bookings will appear here automatically.",
    noUsers: "No guest accounts found yet.",
    noRooms: "No room inventory loaded yet.",
    guest: "Guest",
    emailLabel: "Email",
    phone: "Phone",
    room: "Room",
    roomNumber: "Room number",
    dates: "Stay dates",
    total: "Total",
    guestsCount: "Guests",
    createdAt: "Booked at",
    specialRequest: "Special request",
    paymentStatus: "Payment",
    paymentPending: "Pending payment",
    paymentPaid: "Paid",
    paymentRefunded: "Refunded",
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
    autoArchive: "Bookings move here automatically after the reservation period passes.",
    actionsTitle: "Admin actions",
    confirmAction: "Confirm",
    cancelAction: "Cancel",
    completeAction: "Complete",
    saveStatus: "Save status",
    statusLabel: "Status",
    actionSuccess: "Booking status updated.",
    actionError: "Booking status could not be updated.",
    pendingStatus: "Pending",
    confirmedStatus: "Confirmed",
    cancelledStatus: "Cancelled",
    completedStatus: "Completed",
    inventoryTitle: "Room inventory",
    inventoryDesc: "Track every physical unit, see who is booked or staying, and update availability from this table.",
    inventoryToggleOpen: "Open inventory",
    inventoryToggleClose: "Hide inventory",
    inventorySummary: "Inventory summary",
    inventoryTotal: "Total units",
    inventoryAvailable: "Available",
    inventoryBooked: "Booked",
    inventoryOccupied: "Occupied",
    inventoryMaintenance: "Maintenance",
    inventoryBlocked: "Blocked",
    inventoryRoomType: "Room type",
    inventoryUnit: "Unit",
    inventoryRate: "Rate",
    inventoryStatus: "Status",
    inventoryGuest: "Guest",
    inventoryPhone: "Phone",
    inventoryDates: "Dates",
    inventoryNote: "Admin note",
    inventoryControls: "Control",
    inventoryEmpty: "No inventory data loaded yet.",
    inventoryNotePlaceholder: "Maintenance note or internal comment",
    inventoryClear: "Clear",
    inventoryBookedLabel: "Booked",
    inventoryOccupiedLabel: "Occupied",
    inventoryAvailableLabel: "Available",
    inventoryMaintenanceLabel: "Maintenance",
    inventoryBlockedLabel: "Blocked"
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
    emailLabel: "Email",
    phone: "Telefon",
    room: "Xona",
    roomNumber: "Xona raqami",
    dates: "Turar sanalari",
    total: "Jami",
    guestsCount: "Mehmonlar soni",
    createdAt: "Bron qilingan vaqt",
    specialRequest: "Maxsus so'rov",
    paymentStatus: "To'lov holati",
    paymentPending: "To'lov kutilmoqda",
    paymentPaid: "To'langan",
    paymentRefunded: "Qaytarilgan",
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
    autoArchive: "Bron muddati tugashi bilan yozuv avtomatik ravishda tarix bo'limiga o'tadi.",
    actionsTitle: "Admin amallari",
    confirmAction: "Tasdiqlash",
    cancelAction: "Bekor qilish",
    completeAction: "Yakunlash",
    saveStatus: "Statusni saqlash",
    statusLabel: "Status",
    actionSuccess: "Bron statusi yangilandi.",
    actionError: "Bron statusini yangilab bo'lmadi.",
    pendingStatus: "Kutilmoqda",
    confirmedStatus: "Tasdiqlangan",
    cancelledStatus: "Bekor qilingan",
    completedStatus: "Tugallangan",
    inventoryTitle: "Xonalar inventari",
    inventoryDesc: "Har bir xonani alohida kuzating, kim bron qilganini ko'ring va mavjudlikni shu yerda boshqaring.",
    inventoryToggleOpen: "Inventarni ochish",
    inventoryToggleClose: "Inventarni yopish",
    inventorySummary: "Inventar qisqacha",
    inventoryTotal: "Jami xonalar",
    inventoryAvailable: "Bo'sh",
    inventoryBooked: "Bron qilingan",
    inventoryOccupied: "Mehmon turibdi",
    inventoryMaintenance: "Texnik xizmat",
    inventoryBlocked: "Bloklangan",
    inventoryRoomType: "Xona turi",
    inventoryUnit: "Xona raqami",
    inventoryRate: "Narx",
    inventoryStatus: "Holat",
    inventoryGuest: "Mehmon",
    inventoryPhone: "Telefon",
    inventoryDates: "Sanalar",
    inventoryNote: "Admin eslatma",
    inventoryControls: "Boshqaruv",
    inventoryEmpty: "Hali inventar ma'lumotlari yo'q.",
    inventoryNotePlaceholder: "Texnik izoh yoki ichki eslatma",
    inventoryClear: "Tozalash",
    inventoryBookedLabel: "Bron qilingan",
    inventoryOccupiedLabel: "Mehmon turibdi",
    inventoryAvailableLabel: "Bo'sh",
    inventoryMaintenanceLabel: "Texnik xizmat",
    inventoryBlockedLabel: "Bloklangan"
  },
  ru: {
    signInHelp: "Введите email и пароль администратора, чтобы открыть панель операций.",
    signedIn: "Сессия администратора активна. Новые брони обновляются автоматически.",
    refresh: "Обновить",
    noCurrentBookings: "Сейчас нет активных бронирований.",
    noHistory: "Завершенные и отмененные брони будут появляться здесь автоматически.",
    noUsers: "Гостевые аккаунты пока не найдены.",
    noRooms: "Инвентарь номеров пока не загружен.",
    guest: "Гость",
    emailLabel: "Email",
    phone: "Телефон",
    room: "Номер",
    roomNumber: "Номер комнаты",
    dates: "Даты проживания",
    total: "Итого",
    guestsCount: "Гостей",
    createdAt: "Забронировано",
    specialRequest: "Особое пожелание",
    paymentStatus: "Оплата",
    paymentPending: "Ожидает оплату",
    paymentPaid: "Оплачено",
    paymentRefunded: "Возвращено",
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
    autoArchive: "После завершения срока брони запись автоматически переходит в историю.",
    actionsTitle: "Действия администратора",
    confirmAction: "Подтвердить",
    cancelAction: "Отменить",
    completeAction: "Завершить",
    saveStatus: "Сохранить статус",
    statusLabel: "Статус",
    actionSuccess: "Статус брони обновлен.",
    actionError: "Не удалось обновить статус брони.",
    pendingStatus: "Ожидает",
    confirmedStatus: "Подтверждено",
    cancelledStatus: "Отменено",
    completedStatus: "Завершено"
  }
};

Object.assign(adminUiCopy.ru, {
  inventoryTitle: adminUiCopy.en.inventoryTitle,
  inventoryDesc: adminUiCopy.en.inventoryDesc,
  inventoryToggleOpen: adminUiCopy.en.inventoryToggleOpen,
  inventoryToggleClose: adminUiCopy.en.inventoryToggleClose,
  inventorySummary: adminUiCopy.en.inventorySummary,
  inventoryTotal: adminUiCopy.en.inventoryTotal,
  inventoryAvailable: adminUiCopy.en.inventoryAvailable,
  inventoryBooked: adminUiCopy.en.inventoryBooked,
  inventoryOccupied: adminUiCopy.en.inventoryOccupied,
  inventoryMaintenance: adminUiCopy.en.inventoryMaintenance,
  inventoryBlocked: adminUiCopy.en.inventoryBlocked,
  inventoryRoomType: adminUiCopy.en.inventoryRoomType,
  inventoryUnit: adminUiCopy.en.inventoryUnit,
  inventoryRate: adminUiCopy.en.inventoryRate,
  inventoryStatus: adminUiCopy.en.inventoryStatus,
  inventoryGuest: adminUiCopy.en.inventoryGuest,
  inventoryPhone: adminUiCopy.en.inventoryPhone,
  inventoryDates: adminUiCopy.en.inventoryDates,
  inventoryNote: adminUiCopy.en.inventoryNote,
  inventoryControls: adminUiCopy.en.inventoryControls,
  inventoryEmpty: adminUiCopy.en.inventoryEmpty,
  inventoryNotePlaceholder: adminUiCopy.en.inventoryNotePlaceholder,
  inventoryClear: adminUiCopy.en.inventoryClear,
  inventoryBookedLabel: adminUiCopy.en.inventoryBookedLabel,
  inventoryOccupiedLabel: adminUiCopy.en.inventoryOccupiedLabel,
  inventoryAvailableLabel: adminUiCopy.en.inventoryAvailableLabel,
  inventoryMaintenanceLabel: adminUiCopy.en.inventoryMaintenanceLabel,
  inventoryBlockedLabel: adminUiCopy.en.inventoryBlockedLabel
});

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
  const [actionBookingId, setActionBookingId] = useState<number | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryOverrides, setInventoryOverrides] = useState<Record<string, InventoryOverride>>({});

  useEffect(() => {
    setMessage((current) => (current === ui.signInHelp || current === ui.signedIn ? ui.signInHelp : current));
  }, [ui.signInHelp, ui.signedIn]);

  useEffect(() => {
    const stored = window.localStorage.getItem(INVENTORY_OVERRIDES_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Record<string, InventoryOverride>;
      setInventoryOverrides(parsed);
    } catch {
      window.localStorage.removeItem(INVENTORY_OVERRIDES_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(INVENTORY_OVERRIDES_KEY, JSON.stringify(inventoryOverrides));
  }, [inventoryOverrides]);

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

  async function handleStatusUpdate(bookingId: number, status: BookingStatus) {
    if (!token) {
      setMessage(copy.error);
      return;
    }

    setActionBookingId(bookingId);
    try {
      await updateAdminBookingStatus(token, bookingId, status);
      await hydrateDashboard(token, ui.actionSuccess, false);
    } catch {
      setMessage(ui.actionError);
    } finally {
      setActionBookingId(null);
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

  const inventoryUnits = useMemo(
    () => buildInventoryUnits(dashboard?.rooms ?? [], INVENTORY_CATALOG),
    [dashboard?.rooms]
  );
  const inventoryAssignments = useMemo(
    () => assignBookingsToInventory(inventoryUnits, currentBookings),
    [inventoryUnits, currentBookings]
  );
  const inventoryRows = useMemo(
    () => buildInventoryRows(inventoryUnits, inventoryAssignments, inventoryOverrides),
    [inventoryUnits, inventoryAssignments, inventoryOverrides]
  );
  const inventorySummary = useMemo(() => summarizeInventory(inventoryRows), [inventoryRows]);
  const inventoryRowsByType = useMemo(() => groupInventoryByType(inventoryRows), [inventoryRows]);

  function updateInventoryOverride(unitId: string, next: InventoryOverride) {
    setInventoryOverrides((prev) => ({ ...prev, [unitId]: next }));
  }

  function updateInventoryOverrideField(unitId: string, partial: Partial<InventoryOverride>) {
    setInventoryOverrides((prev) => {
      const current = prev[unitId] ?? { status: "available" };
      return {
        ...prev,
        [unitId]: {
          ...current,
          ...partial
        }
      };
    });
  }

  function clearInventoryOverride(unitId: string) {
    setInventoryOverrides((prev) => {
      const next = { ...prev };
      delete next[unitId];
      return next;
    });
  }

  function handleInventoryStatusChange(unitId: string, status: InventoryOverrideStatus | "available") {
    if (status === "available") {
      clearInventoryOverride(unitId);
      return;
    }
    updateInventoryOverrideField(unitId, { status });
  }

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
                  isBusy={actionBookingId === booking.id}
                  onStatusChange={handleStatusUpdate}
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

          <section className="editorial-panel">
            <div className="border-b border-[#d8cfc2] p-8">
              <div className="section-label">{ui.inventorySummary}</div>
              <h3 className="mt-4 font-display text-4xl text-ink">{ui.inventoryTitle}</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/68">{ui.inventoryDesc}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8cfc2] bg-[#f6efe6] px-8 py-6">
              <div className="text-xs uppercase tracking-[0.28em] text-stone">{ui.inventorySummary}</div>
              <button
                type="button"
                onClick={() => setInventoryOpen((prev) => !prev)}
                className="editorial-button"
              >
                {inventoryOpen ? ui.inventoryToggleClose : ui.inventoryToggleOpen}
              </button>
            </div>

            {inventoryOpen ? (
              <>
                <div className="grid gap-px border-b border-[#d8cfc2] bg-[#d8cfc2] md:grid-cols-6">
                  <Metric label={ui.inventoryTotal} value={inventorySummary.total} />
                  <Metric label={ui.inventoryAvailable} value={inventorySummary.available} />
                  <Metric label={ui.inventoryBooked} value={inventorySummary.booked} />
                  <Metric label={ui.inventoryOccupied} value={inventorySummary.occupied} />
                  <Metric label={ui.inventoryMaintenance} value={inventorySummary.maintenance} />
                  <Metric label={ui.inventoryBlocked} value={inventorySummary.blocked} />
                </div>

                {inventoryRows.length === 0 ? (
                  <div className="p-8 text-sm text-ink/68">{ui.inventoryEmpty}</div>
                ) : (
                  <div className="space-y-10 p-6">
                    {INVENTORY_CATALOG.map((catalog) => {
                      const rows = inventoryRowsByType.get(catalog.key) ?? [];
                      if (rows.length === 0) {
                        return null;
                      }
                      return (
                        <div key={catalog.key} className="overflow-hidden rounded-[28px] border border-[#e2d8ca] bg-white/80">
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#efe6da] p-6">
                            <div>
                              <div className="section-label">{ui.inventoryRoomType}</div>
                              <h4 className="mt-3 font-display text-3xl text-ink">{rows[0]?.unit.title ?? catalog.title}</h4>
                              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">
                                {rows[0]?.unit.collection ?? catalog.collection}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="section-label">{ui.inventoryTotal}</div>
                              <div className="mt-3 font-display text-3xl text-ink">{rows.length}</div>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-[1100px] border-collapse text-left text-sm text-ink/80">
                              <thead className="border-b border-[#efe6da] text-xs uppercase tracking-[0.2em] text-stone">
                                <tr>
                                  <th className="px-3 py-3">{ui.inventoryUnit}</th>
                                  <th className="px-3 py-3">{ui.inventoryRoomType}</th>
                                  <th className="px-3 py-3">{ui.inventoryRate}</th>
                                  <th className="px-3 py-3">{ui.inventoryStatus}</th>
                                  <th className="px-3 py-3">{ui.inventoryGuest}</th>
                                  <th className="px-3 py-3">{ui.inventoryPhone}</th>
                                  <th className="px-3 py-3">{ui.inventoryDates}</th>
                                  <th className="px-3 py-3">{ui.inventoryNote}</th>
                                  <th className="px-3 py-3">{ui.inventoryControls}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((row) => {
                                  const overrideStatus = row.override?.status ?? "available";
                                  const overrideNote = row.override?.note ?? "";
                                  const offlineGuest = row.override?.guestName ?? "";
                                  const offlinePhone = row.override?.guestPhone ?? "";
                                  const offlineCheckIn = row.override?.checkIn ?? "";
                                  const offlineCheckOut = row.override?.checkOut ?? "";
                                  const isOffline = !row.booking && overrideStatus === "blocked";
                                  const bookingGuest = row.booking?.user?.full_name ?? "-";
                                  const bookingPhone = row.booking?.user?.phone ?? "-";
                                  const bookingDates = row.booking
                                    ? formatDateRange(row.booking.check_in, row.booking.check_out)
                                    : "-";
                                  const bookingNote = row.booking?.special_request ?? "-";

                                  return (
                                    <tr key={row.unit.id} className="border-b border-[#f2eadf]">
                                      <td className="px-3 py-4 font-display text-lg text-ink">{row.unit.unitNumber}</td>
                                      <td className="px-3 py-4">
                                        <div className="font-display text-lg text-ink">{row.unit.title}</div>
                                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">
                                          {row.unit.collection}
                                        </div>
                                      </td>
                                      <td className="px-3 py-4">{Number(row.unit.rate).toLocaleString("en-US")} UZS</td>
                                      <td className="px-3 py-4">
                                        <span className={inventoryStatusBadge(row.status)}>
                                          {localizeInventoryStatus(row.status, ui)}
                                        </span>
                                      </td>
                                      <td className="px-3 py-4">
                                        {row.booking ? (
                                          bookingGuest
                                        ) : isOffline ? (
                                          <input
                                            value={offlineGuest}
                                            onChange={(event) =>
                                              updateInventoryOverrideField(row.unit.id, { guestName: event.target.value })
                                            }
                                            placeholder={ui.inventoryGuest}
                                            className="w-full rounded-full border border-[#e2d8ca] bg-white/80 px-3 py-2 text-xs text-ink/80"
                                          />
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                      <td className="px-3 py-4">
                                        {row.booking ? (
                                          bookingPhone
                                        ) : isOffline ? (
                                          <input
                                            value={offlinePhone}
                                            onChange={(event) =>
                                              updateInventoryOverrideField(row.unit.id, { guestPhone: event.target.value })
                                            }
                                            placeholder={ui.inventoryPhone}
                                            className="w-full rounded-full border border-[#e2d8ca] bg-white/80 px-3 py-2 text-xs text-ink/80"
                                          />
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                      <td className="px-3 py-4">
                                        {row.booking ? (
                                          bookingDates
                                        ) : isOffline ? (
                                          <div className="grid gap-2">
                                            <input
                                              type="date"
                                              value={offlineCheckIn}
                                              onChange={(event) =>
                                                updateInventoryOverrideField(row.unit.id, { checkIn: event.target.value })
                                              }
                                              className="w-full rounded-full border border-[#e2d8ca] bg-white/80 px-3 py-2 text-xs text-ink/80"
                                            />
                                            <input
                                              type="date"
                                              value={offlineCheckOut}
                                              onChange={(event) =>
                                                updateInventoryOverrideField(row.unit.id, { checkOut: event.target.value })
                                              }
                                              className="w-full rounded-full border border-[#e2d8ca] bg-white/80 px-3 py-2 text-xs text-ink/80"
                                            />
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                      <td className="px-3 py-4">
                                        {row.booking ? (
                                          <div className="text-xs leading-6 text-ink/70">{bookingNote}</div>
                                        ) : (
                                          <input
                                            value={overrideNote}
                                            onChange={(event) =>
                                              updateInventoryOverrideField(row.unit.id, { note: event.target.value })
                                            }
                                            placeholder={ui.inventoryNotePlaceholder}
                                            className="w-full rounded-full border border-[#e2d8ca] bg-white/80 px-4 py-2 text-xs text-ink/80"
                                          />
                                        )}
                                      </td>
                                      <td className="px-3 py-4">
                                        {row.booking ? (
                                          <span className="text-xs text-ink/60">—</span>
                                        ) : (
                                          <div className="flex flex-wrap items-center gap-2">
                                            <select
                                              value={overrideStatus}
                                              onChange={(event) =>
                                                handleInventoryStatusChange(
                                                  row.unit.id,
                                                  event.target.value as InventoryOverrideStatus | "available"
                                                )
                                              }
                                              className="rounded-full border border-[#e2d8ca] bg-white/80 px-3 py-2 text-xs text-ink/80"
                                            >
                                              <option value="available">{ui.inventoryAvailableLabel}</option>
                                              <option value="maintenance">{ui.inventoryMaintenanceLabel}</option>
                                              <option value="blocked">{ui.inventoryBlockedLabel}</option>
                                            </select>
                                            {row.override ? (
                                              <button
                                                type="button"
                                                onClick={() => clearInventoryOverride(row.unit.id)}
                                                className="rounded-full border border-[#e2d8ca] px-3 py-2 text-xs text-ink/70"
                                              >
                                                {ui.inventoryClear}
                                              </button>
                                            ) : null}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}
          </section>
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
  className,
  isBusy,
  onStatusChange
}: {
  booking: Booking;
  ui: (typeof adminUiCopy)[Language];
  className?: string;
  isBusy: boolean;
  onStatusChange: (bookingId: number, status: BookingStatus) => Promise<void>;
}) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status as BookingStatus);

  useEffect(() => {
    setSelectedStatus(booking.status as BookingStatus);
  }, [booking.status]);

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
          {localizeStatus(booking.status as BookingStatus, ui)}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InfoBlock label={ui.guest} value={booking.user?.full_name || "-"} />
        <InfoBlock label={ui.emailLabel} value={booking.user?.email || "-"} />
        <InfoBlock label={ui.phone} value={booking.user?.phone || "-"} />
        <InfoBlock label={ui.roomNumber} value={booking.room.room_number} />
        <InfoBlock label={ui.guestsCount} value={String(booking.guests_count)} />
        <InfoBlock label={ui.createdAt} value={formatDateTime(booking.created_at)} />
        <InfoBlock label={ui.dates} value={`${booking.check_in} - ${booking.check_out}`} />
        <InfoBlock label={ui.total} value={`${Number(booking.total_price).toLocaleString("en-US")} UZS`} />
        <InfoBlock label={ui.paymentStatus} value={booking.payment ? localizePaymentStatus(booking.payment.status, ui) : "-"} />
      </div>

      {booking.special_request ? (
        <div className="border-t border-[#d8cfc2] pt-4 text-sm leading-7 text-ink/68">
          <span className="section-label">{ui.specialRequest}</span>
          <div className="mt-3">{booking.special_request}</div>
        </div>
      ) : null}

      <div className="border-t border-[#d8cfc2] pt-5">
        <div className="section-label">{ui.actionsTitle}</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onStatusChange(booking.id, "confirmed")}
            disabled={isBusy || booking.status === "confirmed"}
            className="editorial-button disabled:opacity-50"
          >
            {ui.confirmAction}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(booking.id, "cancelled")}
            disabled={isBusy || booking.status === "cancelled"}
            className="editorial-button-secondary disabled:opacity-50"
          >
            {ui.cancelAction}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(booking.id, "completed")}
            disabled={isBusy || booking.status === "completed"}
            className="editorial-button-secondary disabled:opacity-50"
          >
            {ui.completeAction}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="space-y-2 text-sm text-ink/70">
            <span>{ui.statusLabel}</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as BookingStatus)}
              className="editorial-input"
              disabled={isBusy}
            >
              {BOOKING_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {localizeStatus(status, ui)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => onStatusChange(booking.id, selectedStatus)}
            disabled={isBusy || selectedStatus === booking.status}
            className="editorial-button disabled:opacity-50 md:mt-7"
          >
            {ui.saveStatus}
          </button>
        </div>
      </div>
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

function buildInventoryUnits(rooms: AdminDashboard["rooms"], catalog: InventoryCatalogItem[]) {
  return catalog.flatMap((item) => {
    const room = rooms.find((entry) => entry.slug === item.key);
    const baseNumber = item.startNumber;
    const rate = Number(room?.display_price ?? item.rate);
    const title = room?.title ?? item.title;
    const collection = room?.view_label ?? item.collection;

    return Array.from({ length: item.count }, (_, index) => {
      const unitNumber = String(baseNumber + index);
      const id = `${item.key}-${unitNumber}`;
      return {
        id,
        typeKey: item.key,
        title,
        collection,
        unitNumber,
        rate
      };
    });
  });
}

function assignBookingsToInventory(units: InventoryUnit[], bookings: Booking[]) {
  const today = startOfToday();
  const activeBookings = bookings.filter((booking) => {
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }
    const checkOut = parseLocalDate(booking.check_out);
    return checkOut >= today;
  });

  const bookingsByType = new Map<string, Booking[]>();
  for (const booking of activeBookings) {
    const key = booking.room.slug;
    const list = bookingsByType.get(key) ?? [];
    list.push(booking);
    bookingsByType.set(key, list);
  }

  const unitsByType = new Map<string, InventoryUnit[]>();
  for (const unit of units) {
    const list = unitsByType.get(unit.typeKey) ?? [];
    list.push(unit);
    unitsByType.set(unit.typeKey, list);
  }

  const assignments = new Map<string, Booking>();
  for (const [typeKey, list] of bookingsByType.entries()) {
    const sorted = [...list].sort((a, b) => a.check_in.localeCompare(b.check_in));
    const unitList = unitsByType.get(typeKey) ?? [];
    sorted.forEach((booking, index) => {
      const targetUnit = unitList[index];
      if (targetUnit) {
        assignments.set(targetUnit.id, booking);
      }
    });
  }

  return assignments;
}

function buildInventoryRows(
  units: InventoryUnit[],
  assignments: Map<string, Booking>,
  overrides: Record<string, InventoryOverride>
): InventoryRow[] {
  const today = startOfToday();
  return units.map((unit) => {
    const booking = assignments.get(unit.id);
    const override = overrides[unit.id];
    let status: InventoryStatus = "available";

    if (booking) {
      const checkIn = parseLocalDate(booking.check_in);
      const checkOut = parseLocalDate(booking.check_out);
      status = today >= checkIn && today < checkOut ? "occupied" : "booked";
    } else if (override?.status) {
      status = override.status;
    }

    return {
      unit,
      booking,
      override,
      status
    };
  });
}

function groupInventoryByType(rows: InventoryRow[]) {
  const map = new Map<string, InventoryRow[]>();
  for (const row of rows) {
    const list = map.get(row.unit.typeKey) ?? [];
    list.push(row);
    map.set(row.unit.typeKey, list);
  }
  return map;
}

function summarizeInventory(rows: InventoryRow[]) {
  const initial: Record<InventoryStatus | "total", number> = {
    total: 0,
    available: 0,
    booked: 0,
    occupied: 0,
    maintenance: 0,
    blocked: 0
  };

  return rows.reduce((acc, row) => {
    acc.total += 1;
    acc[row.status] += 1;
    return acc;
  }, initial);
}

function inventoryStatusBadge(status: InventoryStatus) {
  if (status === "available") {
    return "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700";
  }
  if (status === "booked") {
    return "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700";
  }
  if (status === "occupied") {
    return "rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700";
  }
  if (status === "maintenance") {
    return "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700";
  }
  return "rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700";
}

function localizeInventoryStatus(status: InventoryStatus, ui: Record<string, string>) {
  if (status === "available") {
    return ui.inventoryAvailableLabel;
  }
  if (status === "booked") {
    return ui.inventoryBookedLabel;
  }
  if (status === "occupied") {
    return ui.inventoryOccupiedLabel;
  }
  if (status === "maintenance") {
    return ui.inventoryMaintenanceLabel;
  }
  return ui.inventoryBlockedLabel;
}

function formatDateRange(checkIn: string, checkOut: string) {
  const start = formatDateOnly(checkIn);
  const end = formatDateOnly(checkOut);
  return `${start} - ${end}`;
}

function formatDateOnly(value: string) {
  const parsed = parseLocalDate(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(parsed);
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date(value);
  }
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

function localizeStatus(status: BookingStatus, ui: (typeof adminUiCopy)[Language]) {
  if (status === "pending") {
    return ui.pendingStatus;
  }
  if (status === "confirmed") {
    return ui.confirmedStatus;
  }
  if (status === "cancelled") {
    return ui.cancelledStatus;
  }
  return ui.completedStatus;
}

function localizePaymentStatus(status: string, ui: (typeof adminUiCopy)[Language]) {
  if (status === "pending") {
    return ui.paymentPending;
  }
  if (status === "paid") {
    return ui.paymentPaid;
  }
  if (status === "refunded") {
    return ui.paymentRefunded;
  }
  return status;
}

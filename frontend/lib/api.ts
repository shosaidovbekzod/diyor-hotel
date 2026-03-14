export type Service = {
  id: number;
  name: string;
  icon: string;
  short_description: string;
  description: string;
};

export type Room = {
  id: number;
  slug: string;
  room_number: string;
  title: string;
  subtitle: string;
  description: string;
  size_sqm: number;
  price_per_night: number;
  promo_price?: number | null;
  display_price: number;
  capacity: number;
  bed_type: string;
  amenities: string[];
  image_url: string;
  gallery: string[];
  view_label?: string | null;
  is_featured: boolean;
  is_available: boolean;
  average_rating: number;
  reviews_count: number;
};

export type RoomSearchFilters = {
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  featuredOnly?: boolean;
  availableOnly?: boolean;
  checkIn?: string;
  checkOut?: string;
};

export type Review = {
  id: number;
  rating: number;
  title: string;
  comment: string;
  user: {
    full_name: string;
    email: string;
  };
};

export type Booking = {
  id: number;
  booking_reference: string;
  created_at?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  nights: number;
  total_price: number;
  status: string;
  room: Room;
  special_request?: string | null;
  payment?: {
    id: number;
    status: string;
    amount: number;
    currency: string;
    method: string;
    transaction_reference: string;
  } | null;
  user?: {
    id: number;
    full_name: string;
    email: string;
    phone?: string | null;
  } | null;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type BookingQuote = {
  room_id: number;
  nights: number;
  subtotal: number | string;
  taxes: number | string;
  total_price: number | string;
  currency: string;
};

export type AdminDashboard = {
  analytics: {
    total_revenue: number;
    total_bookings: number;
    active_bookings: number;
    occupancy_rate: number;
    average_rating: number;
    users_count: number;
  };
  current_bookings: Booking[];
  customer_history: Booking[];
  rooms: Room[];
  users: Array<{
    id: number;
    full_name: string;
    email: string;
    phone?: string | null;
    is_admin: boolean;
    is_active: boolean;
  }>;
};

export type HotelSummary = {
  name: string;
  location: string;
  phone: string;
  email: string;
  telegram_url: string;
  youtube_url: string;
  hero_image: string;
  map_embed_url: string;
  gallery: string[];
  highlight_rooms: Room[];
  services: Service[];
  testimonials: Review[];
};

const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
const SERVER_API_URL =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api/v1";

const API_URL = typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;

const fallbackServices: Service[] = [
  {
    id: 1,
    name: "Buffet breakfast",
    icon: "utensils-crossed",
    short_description: "Personalized breakfast service",
    description: "Breakfast can be served in the restaurant or directly in the room according to guest preferences."
  },
  {
    id: 2,
    name: "Indoor swimming pool",
    icon: "waves",
    short_description: "Year-round indoor pool",
    description: "A modern indoor swimming pool with a calm atmosphere, comfortable water temperature, and space for relaxation."
  },
  {
    id: 3,
    name: "Gym",
    icon: "dumbbell",
    short_description: "Modern training zone",
    description: "A well-equipped gym for cardio and strength workouts throughout the stay."
  },
  {
    id: 4,
    name: "Sauna (Turkish and Finnish)",
    icon: "flame",
    short_description: "Two sauna rituals",
    description: "Turkish hammam steam and Finnish dry heat are both available for recovery and relaxation."
  },
  {
    id: 5,
    name: "Parking",
    icon: "car",
    short_description: "Safe on-site parking",
    description: "Secure parking is available for guests arriving by car."
  },
  {
    id: 6,
    name: "Wi-Fi",
    icon: "wifi",
    short_description: "High-speed internet",
    description: "Complimentary high-speed internet is available in rooms and public spaces."
  }
];

const fallbackRooms: Room[] = [
  {
    id: 1,
    slug: "double-room-one-bed-or-two",
    room_number: "201",
    title: "Double Room with 1 Bed or 2 Separate Beds",
    subtitle: "A calm standard room for business trips and short city stays.",
    description: "A comfortable standard double room that can be arranged with one large bed or two separate beds, designed for quiet rest in the city.",
    size_sqm: 32,
    price_per_night: 420000,
    promo_price: 299000,
    display_price: 299000,
    capacity: 2,
    bed_type: "1 Double Bed / 2 Twin Beds",
    amenities: ["Wi-Fi", "Breakfast", "Air Conditioning", "Smart TV", "Private Bathroom"],
    image_url: "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp",
    gallery: [
      "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp",
      "https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp"
    ],
    view_label: "City stay",
    is_featured: true,
    is_available: true,
    average_rating: 4.9,
    reviews_count: 26
  },
  {
    id: 2,
    slug: "two-bedroom-suite",
    room_number: "305",
    title: "2 Bedroom Suite",
    subtitle: "A spacious suite for guests who value privacy, scale, and comfort.",
    description: "A luxurious suite created for guests who appreciate spacious living, soft privacy, and a more generous room layout.",
    size_sqm: 68,
    price_per_night: 890000,
    promo_price: null,
    display_price: 890000,
    capacity: 4,
    bed_type: "2 Bedroom Suite",
    amenities: ["Wi-Fi", "Breakfast", "Lounge Area", "Air Conditioning", "Smart TV", "Private Bathroom"],
    image_url: "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp",
    gallery: [
      "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp",
      "https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp"
    ],
    view_label: "Suite collection",
    is_featured: true,
    is_available: true,
    average_rating: 4.8,
    reviews_count: 18
  },
  {
    id: 3,
    slug: "one-bedroom-deluxe-apartment",
    room_number: "402",
    title: "1 Bedroom Deluxe Apartment",
    subtitle: "An elegant apartment layout suited to longer, more independent stays.",
    description: "A spacious deluxe apartment with one bedroom and an elegant interior, composed for guests who want extra comfort and more room to settle in.",
    size_sqm: 54,
    price_per_night: 760000,
    promo_price: null,
    display_price: 760000,
    capacity: 3,
    bed_type: "1 Bedroom Apartment",
    amenities: ["Wi-Fi", "Breakfast", "Kitchen", "Workspace", "Smart TV", "Private Bathroom"],
    image_url: "https://diyortashkenthotel.uz/img/d29a38843873236a.webp",
    gallery: [
      "https://diyortashkenthotel.uz/img/d29a38843873236a.webp",
      "https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp"
    ],
    view_label: "Deluxe apartment",
    is_featured: true,
    is_available: true,
    average_rating: 4.7,
    reviews_count: 14
  },
  {
    id: 4,
    slug: "deluxe-apartment-two-bedrooms",
    room_number: "501",
    title: "Deluxe Apartment with 2 Bedrooms",
    subtitle: "A larger apartment with kitchen access for flexible family stays.",
    description: "An ideal choice for families or small groups, with two bedrooms, a kitchen, and the extra room needed for a longer stay.",
    size_sqm: 86,
    price_per_night: 990000,
    promo_price: null,
    display_price: 990000,
    capacity: 4,
    bed_type: "2 Bedroom Apartment",
    amenities: ["Wi-Fi", "Breakfast", "Kitchen", "Dining Area", "Smart TV", "Private Bathroom"],
    image_url: "https://diyortashkenthotel.uz/img/451be978591e2b97.webp",
    gallery: [
      "https://diyortashkenthotel.uz/img/451be978591e2b97.webp",
      "https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp"
    ],
    view_label: "Apartment collection",
    is_featured: true,
    is_available: true,
    average_rating: 4.8,
    reviews_count: 12
  },
  {
    id: 5,
    slug: "deluxe-apartment-three-bedrooms",
    room_number: "502",
    title: "Deluxe Apartment with 3 Bedrooms",
    subtitle: "The most expansive apartment option for extended family and group travel.",
    description: "A large three-bedroom apartment with kitchen and living areas, designed for guests who need extra space without losing the privacy of separate rooms.",
    size_sqm: 118,
    price_per_night: 1350000,
    promo_price: null,
    display_price: 1350000,
    capacity: 6,
    bed_type: "3 Bedroom Apartment",
    amenities: ["Wi-Fi", "Breakfast", "Kitchen", "Dining Area", "Smart TV", "Private Bathroom"],
    image_url: "https://diyortashkenthotel.uz/img/7610f37d48fbf093.webp",
    gallery: [
      "https://diyortashkenthotel.uz/img/7610f37d48fbf093.webp",
      "https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp"
    ],
    view_label: "Residence collection",
    is_featured: true,
    is_available: true,
    average_rating: 4.8,
    reviews_count: 10
  }
];

const fallbackReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    title: "Excellent weekend stay",
    comment: "Beautiful interiors, attentive staff, and the spa access made the value feel exceptional.",
    user: { full_name: "DIYOR Guest", email: "guest@diyorhotel.uz" }
  }
];

const fallbackSummary: HotelSummary = {
  name: "Diyor Tashkent Hotel",
  location: "Olmos Street 74A, Bektemir district, Tashkent 100037, Uzbekistan",
  phone: "+998 88 589 33 33",
  email: "receptiondiyorhotel@gmail.com",
  telegram_url: "https://t.me/diyor_hoteln11",
  youtube_url: "https://www.youtube.com/@Diyorhoteluz",
  hero_image: "https://diyortashkenthotel.uz/img/838a38a4e81dd51c.webp",
  map_embed_url:
    "https://www.google.com/maps?q=Diyor%20Tashkent%20Hotel%20Olmos%2074A%20Bektemir%20Tashkent&output=embed",
  gallery: [
    "https://diyortashkenthotel.uz/img/86c5aa8d74083036.webp",
    "https://diyortashkenthotel.uz/img/813dbe414736ec61.webp",
    "https://diyortashkenthotel.uz/img/0df4c4147ce5830c.webp",
    "https://diyortashkenthotel.uz/img/dac01a4ffbd5aa31.webp"
  ],
  highlight_rooms: fallbackRooms,
  services: fallbackServices,
  testimonials: fallbackReviews
};

async function fetchJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const requestInit = init ?? { next: { revalidate: 60 } };
    const res = await fetch(`${API_URL}${path}`, requestInit);
    if (!res.ok) {
      throw new Error(`Failed ${path}`);
    }
    return (await res.json()) as T;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Unable to load ${path}`);
  }
}

function buildRoomQuery(filters?: RoomSearchFilters) {
  if (!filters) {
    return "";
  }
  const query = new URLSearchParams();
  if (filters.minPrice !== undefined) {
    query.set("min_price", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    query.set("max_price", String(filters.maxPrice));
  }
  if (filters.guests !== undefined) {
    query.set("guests", String(filters.guests));
  }
  if (filters.featuredOnly) {
    query.set("featured_only", "true");
  }
  if (filters.availableOnly) {
    query.set("available_only", "true");
  }
  if (filters.checkIn) {
    query.set("check_in", filters.checkIn);
  }
  if (filters.checkOut) {
    query.set("check_out", filters.checkOut);
  }
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

function filterFallbackRooms(filters?: RoomSearchFilters) {
  if (!filters) {
    return fallbackRooms;
  }

  return fallbackRooms.filter((room) => {
    if (filters.minPrice !== undefined && Number(room.display_price) < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && Number(room.display_price) > filters.maxPrice) {
      return false;
    }
    if (filters.guests !== undefined && room.capacity < filters.guests) {
      return false;
    }
    if (filters.featuredOnly && !room.is_featured) {
      return false;
    }
    if (filters.availableOnly && !room.is_available) {
      return false;
    }
    return true;
  });
}

export function getHotelSummary() {
  return fetchJson<HotelSummary>("/hotel/summary", undefined, fallbackSummary);
}

export function getRooms(filters?: RoomSearchFilters) {
  const query = buildRoomQuery(filters);
  return fetchJson<Room[]>(
    `/rooms${query}`,
    filters ? { cache: "no-store" } : undefined,
    filterFallbackRooms(filters)
  );
}

export async function getRoomBySlug(slug: string) {
  return fetchJson<Room>(
    `/rooms/${slug}`,
    undefined,
    fallbackRooms.find((room) => room.slug === slug) ?? fallbackRooms[0]
  );
}

export function getReviews(roomId?: number) {
  const query = roomId ? `?room_id=${roomId}` : "";
  return fetchJson<Review[]>(`/reviews${query}`, undefined, fallbackReviews);
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  return (await res.json()) as { access_token: string; token_type: string };
}

export async function register(payload: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error("Registration failed");
  }
  return res.json();
}

export async function getMyBookings(token: string) {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) {
    return [];
  }
  return (await res.json()) as Booking[];
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function createBooking(token: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ?? "Booking failed");
  }
  return res.json();
}

export async function quoteBooking(payload: {
  room_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  special_request?: string;
}) {
  const res = await fetch(`${API_URL}/bookings/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ?? "Quote unavailable");
  }
  return (await res.json()) as BookingQuote;
}

export async function cancelBooking(token: string, bookingId: number) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error("Cancellation failed");
  }
  return res.json();
}

export async function getAdminDashboard(token: string) {
  const res = await fetch(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Admin dashboard unavailable");
  }
  return (await res.json()) as AdminDashboard;
}

export async function updateAdminBookingStatus(token: string, bookingId: number, status: BookingStatus) {
  const res = await fetch(`${API_URL}/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    throw new Error("Admin booking update failed");
  }
  return (await res.json()) as Booking;
}

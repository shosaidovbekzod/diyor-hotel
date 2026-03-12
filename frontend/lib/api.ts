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
  check_in: string;
  check_out: string;
  guests_count: number;
  nights: number;
  total_price: number;
  status: string;
  room: Room;
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
  recent_bookings: Booking[];
  rooms: Room[];
  users: Array<{
    id: number;
    full_name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
  }>;
};

export type HotelSummary = {
  name: string;
  location: string;
  phone: string;
  telegram_url: string;
  youtube_url: string;
  hero_image: string;
  gallery: string[];
  highlight_rooms: Room[];
  services: Service[];
  testimonials: Review[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const demoServices: Service[] = [
  { id: 1, name: "Swimming Pool", icon: "waves", short_description: "Indoor heated pool", description: "Indoor heated pool with private relaxation seating." },
  { id: 2, name: "Fitness Gym", icon: "dumbbell", short_description: "Premium gym", description: "Modern cardio and strength equipment." },
  { id: 3, name: "Finnish Sauna", icon: "flame", short_description: "Dry sauna ritual", description: "A restorative Finnish sauna experience." },
  { id: 4, name: "Turkish Sauna", icon: "cloud", short_description: "Traditional hammam steam", description: "Steam therapy inspired by hammam rituals." },
  { id: 5, name: "Salt Room", icon: "sparkles", short_description: "Wellness breathing room", description: "Calm halotherapy-style recovery lounge." },
  { id: 6, name: "SPA Center", icon: "flower-2", short_description: "Luxury treatments", description: "Massages and wellness rituals." },
  { id: 7, name: "Restaurant", icon: "utensils-crossed", short_description: "Elegant dining", description: "Uzbek and international cuisine." }
];

const demoRooms: Room[] = [
  {
    id: 1,
    slug: "deluxe-city-room",
    room_number: "201",
    title: "Deluxe City Room",
    subtitle: "Elegant comfort with a city-facing view",
    description: "A refined room with layered textiles, a plush king bed, rainfall shower, and premium finishing throughout the stay.",
    size_sqm: 34,
    price_per_night: 420000,
    promo_price: 299000,
    display_price: 299000,
    capacity: 2,
    bed_type: "King Bed",
    amenities: ["Wi-Fi", "Breakfast", "Smart TV", "Minibar", "Rainfall Shower", "Air Conditioning"],
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    view_label: "City View",
    is_featured: true,
    is_available: true,
    average_rating: 4.9,
    reviews_count: 26
  },
  {
    id: 2,
    slug: "executive-suite",
    room_number: "305",
    title: "Executive Suite",
    subtitle: "Spacious premium suite for business and leisure",
    description: "A polished suite with a lounge area, king bed, dedicated workspace, and deep-soaking bathroom amenities.",
    size_sqm: 52,
    price_per_night: 690000,
    promo_price: null,
    display_price: 690000,
    capacity: 3,
    bed_type: "King Bed + Sofa",
    amenities: ["Wi-Fi", "Breakfast", "Workspace", "Coffee Station", "Bathtub", "Lounge Area"],
    image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    view_label: "Courtyard View",
    is_featured: true,
    is_available: true,
    average_rating: 4.8,
    reviews_count: 18
  },
  {
    id: 3,
    slug: "family-residence",
    room_number: "402",
    title: "Family Residence",
    subtitle: "Large family stay with flexible sleeping layout",
    description: "A generous family room with a dining corner, flexible bedding, and practical luxury for longer stays.",
    size_sqm: 68,
    price_per_night: 890000,
    promo_price: 760000,
    display_price: 760000,
    capacity: 4,
    bed_type: "2 Queen Beds",
    amenities: ["Wi-Fi", "Breakfast", "Dining Corner", "Kids Welcome Set", "Walk-in Shower"],
    image_url: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80"
    ],
    view_label: "Garden View",
    is_featured: true,
    is_available: true,
    average_rating: 4.7,
    reviews_count: 14
  }
];

const demoReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    title: "Excellent weekend stay",
    comment: "Beautiful interiors, attentive staff, and the spa access made the value feel exceptional.",
    user: { full_name: "Demo Guest", email: "guest@diyorhotel.uz" }
  }
];

const demoSummary: HotelSummary = {
  name: "DIYOR HOTEL - TASHKENT",
  location: "Olmos 74A street, Tashkent, Uzbekistan",
  phone: "+998 88 589 33 33",
  telegram_url: "https://t.me/diyor_tashkent_hotel",
  youtube_url: "https://www.youtube.com/@Diyorhoteluz",
  hero_image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
  ],
  highlight_rooms: demoRooms,
  services: demoServices,
  testimonials: demoReviews
};

async function fetchJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { ...init, next: { revalidate: 60 } });
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

export function getHotelSummary() {
  return fetchJson<HotelSummary>("/hotel/summary", undefined, demoSummary);
}

export function getRooms() {
  return fetchJson<Room[]>("/rooms", undefined, demoRooms);
}

export async function getRoomBySlug(slug: string) {
  return fetchJson<Room>(`/rooms/${slug}`, undefined, demoRooms.find((room) => room.slug === slug) ?? demoRooms[0]);
}

export function getReviews(roomId?: number) {
  const query = roomId ? `?room_id=${roomId}` : "";
  return fetchJson<Review[]>(`/reviews${query}`, undefined, demoReviews);
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
    throw new Error("Booking failed");
  }
  return res.json();
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

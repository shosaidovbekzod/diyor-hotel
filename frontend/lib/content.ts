import type { Room, Service } from "@/lib/api";
import type { Language } from "@/lib/i18n";

const amenityMap: Record<string, Record<Language, string>> = {
  "Wi-Fi": { en: "Wi-Fi", uz: "Wi-Fi", ru: "Wi-Fi" },
  Breakfast: { en: "Breakfast", uz: "Nonushta", ru: "Завтрак" },
  "Smart TV": { en: "Smart TV", uz: "Smart TV", ru: "Smart TV" },
  Minibar: { en: "Minibar", uz: "Minibar", ru: "Мини-бар" },
  "Rainfall Shower": { en: "Rainfall Shower", uz: "Yomg'ir uslubidagi dush", ru: "Тропический душ" },
  "Air Conditioning": { en: "Air Conditioning", uz: "Konditsioner", ru: "Кондиционер" },
  Workspace: { en: "Workspace", uz: "Ish zonasi", ru: "Рабочая зона" },
  "Coffee Station": { en: "Coffee Station", uz: "Kofe zonasi", ru: "Кофейная зона" },
  Bathtub: { en: "Bathtub", uz: "Vanna", ru: "Ванна" },
  "Lounge Area": { en: "Lounge Area", uz: "Dam olish zonasi", ru: "Лаунж-зона" },
  "Dining Corner": { en: "Dining Corner", uz: "Ovqatlanish burchagi", ru: "Обеденная зона" },
  "Kids Welcome Set": { en: "Kids Welcome Set", uz: "Bolalar uchun to'plam", ru: "Детский набор" },
  "Walk-in Shower": { en: "Walk-in Shower", uz: "Keng dush", ru: "Просторный душ" }
};

const roomMap: Record<string, Record<Language, Partial<Room>>> = {
  "deluxe-city-room": {
    en: {},
    uz: {
      title: "Deluxe City Room",
      subtitle: "Shahar manzarali nafis qulaylik",
      description: "Qatlamli teksturalar, yumshoq king bed, smart TV, ish stoli va premium bezaklar bilan jihozlangan nafis xona.",
      bed_type: "King karavot",
      view_label: "Shahar manzarasi"
    },
    ru: {
      title: "Deluxe City Room",
      subtitle: "Элегантный комфорт с видом на город",
      description: "Изысканный номер с мягкой king-кроватью, smart TV, рабочим столом и премиальной отделкой.",
      bed_type: "King Bed",
      view_label: "Вид на город"
    }
  },
  "executive-suite": {
    en: {},
    uz: {
      title: "Executive Suite",
      subtitle: "Biznes va dam olish uchun keng premium suit",
      description: "Dam olish zonasi, premium king bed, ish joyi va keng vannaxona bilan jihozlangan yuqori toifadagi suit.",
      bed_type: "King karavot + divan",
      view_label: "Hovli manzarasi"
    },
    ru: {
      title: "Executive Suite",
      subtitle: "Просторный премиум-сьют для бизнеса и отдыха",
      description: "Премиальный сьют с лаунж-зоной, king-кроватью, рабочим местом и увеличенной ванной комнатой.",
      bed_type: "King Bed + Sofa",
      view_label: "Вид во двор"
    }
  },
  "family-residence": {
    en: {},
    uz: {
      title: "Family Residence",
      subtitle: "Oilaviy yashash uchun katta xona",
      description: "Oilalar va kichik guruhlar uchun mos, ovqatlanish burchagi va qulay yotoq sxemasi bilan jihozlangan keng xona.",
      bed_type: "2 ta queen karavot",
      view_label: "Bog' manzarasi"
    },
    ru: {
      title: "Family Residence",
      subtitle: "Большой семейный номер с гибкой планировкой",
      description: "Просторный семейный номер с обеденной зоной и удобной конфигурацией спальных мест для длительного проживания.",
      bed_type: "2 Queen Beds",
      view_label: "Вид на сад"
    }
  }
};

const serviceMap: Record<string, Record<Language, Partial<Service>>> = {
  "Swimming Pool": {
    en: {},
    uz: { name: "Basseyn", short_description: "Issiq yopiq basseyn", description: "Dam olish uchun mo'ljallangan premium yopiq basseyn." },
    ru: { name: "Бассейн", short_description: "Теплый крытый бассейн", description: "Премиальный крытый бассейн для отдыха и восстановления." }
  },
  "Fitness Gym": {
    en: {},
    uz: { name: "Fitness zal", short_description: "Zamonaviy fitness hududi", description: "Kardio va kuch mashqlari uchun zamonaviy jihozlar." },
    ru: { name: "Фитнес-зал", short_description: "Современная фитнес-зона", description: "Современное оборудование для кардио и силовых тренировок." }
  },
  "Finnish Sauna": {
    en: {},
    uz: { name: "Fin saunasi", short_description: "Quruq sauna", description: "Chuqur dam olish uchun an'anaviy fin saunasi." },
    ru: { name: "Финская сауна", short_description: "Сухая сауна", description: "Традиционная финская сауна для глубокого расслабления." }
  },
  "Turkish Sauna": {
    en: {},
    uz: { name: "Turk saunasi", short_description: "An'anaviy hammom bug'i", description: "Hammom uslubidagi bug'li tiklanish tajribasi." },
    ru: { name: "Турецкая сауна", short_description: "Пар в стиле хаммама", description: "Восстанавливающая паровая атмосфера в стиле хаммама." }
  },
  "Salt Room": {
    en: {},
    uz: { name: "Tuz xonasi", short_description: "Tinch wellness hududi", description: "Nafas va dam olish uchun mo'ljallangan sokin tuz xonasi." },
    ru: { name: "Соляная комната", short_description: "Спокойная wellness-зона", description: "Соляная комната для отдыха и мягкого восстановления." }
  },
  "SPA Center": {
    en: {},
    uz: { name: "SPA markaz", short_description: "Premium muolajalar", description: "Massaj va wellness muolajalari uchun premium zona." },
    ru: { name: "SPA-центр", short_description: "Премиальные процедуры", description: "Премиальная зона для массажа и wellness-процедур." }
  },
  Restaurant: {
    en: {},
    uz: { name: "Restoran", short_description: "Elegant ovqatlanish", description: "O'zbek va xalqaro taomlardan iborat nafis restoran." },
    ru: { name: "Ресторан", short_description: "Элегантный ресторан", description: "Элегантный ресторан с узбекской и международной кухней." }
  }
};

export function localizeRoom(room: Room, lang: Language): Room {
  const overrides = roomMap[room.slug]?.[lang] ?? {};
  return {
    ...room,
    ...overrides,
    amenities: room.amenities.map((item) => amenityMap[item]?.[lang] ?? item)
  };
}

export function localizeRooms(rooms: Room[], lang: Language): Room[] {
  return rooms.map((room) => localizeRoom(room, lang));
}

export function localizeServices(services: Service[], lang: Language): Service[] {
  return services.map((service) => ({
    ...service,
    ...(serviceMap[service.name]?.[lang] ?? {})
  }));
}

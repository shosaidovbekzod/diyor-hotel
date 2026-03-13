import type { Room, Service } from "@/lib/api";
import type { Language } from "@/lib/i18n";

const amenityMap: Record<string, Record<Language, string>> = {
  "Wi-Fi": { en: "Wi-Fi", uz: "Wi-Fi", ru: "Wi-Fi" },
  Breakfast: { en: "Breakfast", uz: "Nonushta", ru: "Завтрак" },
  "Air Conditioning": { en: "Air Conditioning", uz: "Konditsioner", ru: "Кондиционер" },
  "Smart TV": { en: "Smart TV", uz: "Smart TV", ru: "Smart TV" },
  "Private Bathroom": { en: "Private Bathroom", uz: "Shaxsiy hammom", ru: "Собственная ванная" },
  "Lounge Area": { en: "Lounge Area", uz: "Dam olish zonasi", ru: "Лаунж-зона" },
  Kitchen: { en: "Kitchen", uz: "Oshxona", ru: "Кухня" },
  Workspace: { en: "Workspace", uz: "Ish zonasi", ru: "Рабочая зона" },
  "Dining Area": { en: "Dining Area", uz: "Ovqatlanish zonasi", ru: "Обеденная зона" }
};

const roomMap: Record<string, Record<Language, Partial<Room>>> = {
  "double-room-one-bed-or-two": {
    en: {},
    uz: {
      title: "1 ta karavotli yoki 2 alohida karavotli ikki kishilik xona",
      subtitle: "Biznes safar va qisqa shahar tashrifi uchun sokin standart xona.",
      description:
        "Bir katta karavot yoki ikkita alohida karavot bilan tayyorlanadigan qulay standart ikki kishilik xona, shahardagi osoyishta dam olish uchun mo'ljallangan.",
      bed_type: "1 katta karavot / 2 alohida karavot",
      view_label: "Shahar turar joyi"
    },
    ru: {
      title: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
      subtitle: "Спокойный стандартный номер для деловых поездок и коротких городских визитов.",
      description:
        "Удобный стандартный двухместный номер, который может быть подготовлен с одной большой кроватью или двумя отдельными кроватями для тихого отдыха в городе.",
      bed_type: "1 большая кровать / 2 отдельные кровати",
      view_label: "Городское проживание"
    }
  },
  "two-bedroom-suite": {
    en: {},
    uz: {
      title: "2 yotoqxonali suit",
      subtitle: "Maxfiylik, ko'lam va qulaylikni qadrlaydigan mehmonlar uchun keng suit.",
      description:
        "Keng yashash maydoni, yumshoq maxfiylik va kattaroq reja bilan yaratilgan hashamatli suit.",
      bed_type: "2 yotoqxonali suit",
      view_label: "Suit kolleksiyasi"
    },
    ru: {
      title: "Люкс с 2 спальнями",
      subtitle: "Просторный люкс для гостей, которые ценят приватность, масштаб и комфорт.",
      description:
        "Роскошный люкс с более просторной планировкой, мягкой приватностью и комфортной атмосферой для длительного проживания.",
      bed_type: "Люкс с 2 спальнями",
      view_label: "Коллекция люксов"
    }
  },
  "one-bedroom-deluxe-apartment": {
    en: {},
    uz: {
      title: "1 yotoqxonali deluxe apartament",
      subtitle: "Uzoqroq va mustaqilroq turar joy uchun nafis apartament rejasi.",
      description:
        "Bitta yotoqxona va nafis interyer bilan yaratilgan keng deluxe apartament, qo'shimcha qulaylik va kengroq yashash maydonini istagan mehmonlar uchun.",
      bed_type: "1 yotoqxonali apartament",
      view_label: "Deluxe apartament"
    },
    ru: {
      title: "Делюкс-апартаменты с 1 спальней",
      subtitle: "Элегантная планировка апартаментов для более длительного и независимого проживания.",
      description:
        "Просторные делюкс-апартаменты с одной спальней и элегантным интерьером для гостей, которым нужен больший комфорт и больше личного пространства.",
      bed_type: "Апартаменты с 1 спальней",
      view_label: "Делюкс-апартаменты"
    }
  },
  "deluxe-apartment-two-bedrooms": {
    en: {},
    uz: {
      title: "2 yotoqxonali deluxe apartament",
      subtitle: "Oila uchun moslashuvchan turar joy va oshxona bilan kattaroq apartament.",
      description:
        "Ikki yotoqxona va oshxona bilan oilalar yoki kichik guruhlar uchun qulay, uzoqroq turar joyga mos ideal variant.",
      bed_type: "2 yotoqxonali apartament",
      view_label: "Apartament kolleksiyasi"
    },
    ru: {
      title: "Делюкс-апартаменты с 2 спальнями",
      subtitle: "Более просторные апартаменты с кухней для гибкого семейного проживания.",
      description:
        "Идеальный выбор для семей или небольших групп: две спальни, кухня и больше пространства для длительного пребывания.",
      bed_type: "Апартаменты с 2 спальнями",
      view_label: "Коллекция апартаментов"
    }
  },
  "deluxe-apartment-three-bedrooms": {
    en: {},
    uz: {
      title: "3 yotoqxonali deluxe apartament",
      subtitle: "Katta oilalar va guruhlar uchun eng keng apartament varianti.",
      description:
        "Oshxona va yashash zonalari bilan jihozlangan katta uch yotoqxonali apartament, keng joy kerak bo'lgan mehmonlar uchun yaratilgan.",
      bed_type: "3 yotoqxonali apartament",
      view_label: "Residence kolleksiyasi"
    },
    ru: {
      title: "Делюкс-апартаменты с 3 спальнями",
      subtitle: "Самый просторный вариант апартаментов для больших семей и групп.",
      description:
        "Большие апартаменты с тремя спальнями, кухней и гостиной для гостей, которым нужно много пространства без потери приватности отдельных комнат.",
      bed_type: "Апартаменты с 3 спальнями",
      view_label: "Коллекция residence"
    }
  }
};

const serviceMap: Record<string, Record<Language, Partial<Service>>> = {
  "Buffet breakfast": {
    en: {},
    uz: {
      name: "Nonushta",
      short_description: "Shaxsiylashtirilgan nonushta xizmati",
      description: "Nonushta restoran yoki xona ichida, mehmon istagiga ko'ra individual tarzda taqdim etiladi."
    },
    ru: {
      name: "Завтрак",
      short_description: "Индивидуальный завтрак",
      description: "Завтрак может быть подан в ресторане или прямо в номер с учетом предпочтений гостя."
    }
  },
  "Indoor swimming pool": {
    en: {},
    uz: {
      name: "Yopiq basseyn",
      short_description: "Yil bo'yi ishlaydigan yopiq basseyn",
      description: "Sokin muhit, qulay suv harorati va dam olish uchun mo'ljallangan zamonaviy yopiq basseyn."
    },
    ru: {
      name: "Крытый бассейн",
      short_description: "Крытый бассейн круглый год",
      description: "Современный крытый бассейн со спокойной атмосферой и комфортной температурой воды для отдыха и плавания."
    }
  },
  Gym: {
    en: {},
    uz: {
      name: "Sport zal",
      short_description: "Zamonaviy mashg'ulot hududi",
      description: "Kardio va kuch mashqlari uchun kerakli jihozlar bilan ta'minlangan zamonaviy zal."
    },
    ru: {
      name: "Тренажерный зал",
      short_description: "Современная зона тренировок",
      description: "Современный зал с необходимым оборудованием для кардио- и силовых тренировок."
    }
  },
  "Sauna (Turkish and Finnish)": {
    en: {},
    uz: {
      name: "Turk va fin saunasi",
      short_description: "Ikki xil sauna marosimi",
      description: "Turk hammomi yumshoq bug' bilan, fin saunasi esa quruq issiqlik bilan chuqur tiklanish hissini beradi."
    },
    ru: {
      name: "Сауна (турецкая и финская)",
      short_description: "Два формата сауны",
      description: "Турецкий хаммам дает мягкий пар, а финская сауна обеспечивает сухое тепло и глубокое восстановление."
    }
  },
  Parking: {
    en: {},
    uz: {
      name: "Avtoturargoh",
      short_description: "Xavfsiz joyidagi parking",
      description: "Avtomobilda kelgan mehmonlar uchun mehmonxona yonidagi xavfsiz parking mavjud."
    },
    ru: {
      name: "Парковка",
      short_description: "Безопасная парковка на территории",
      description: "Для гостей, приезжающих на автомобиле, доступна безопасная парковка рядом с отелем."
    }
  },
  "Wi-Fi": {
    en: {},
    uz: {
      name: "Wi-Fi",
      short_description: "Yuqori tezlikdagi internet",
      description: "Bepul yuqori tezlikdagi internet xonalar va umumiy hududlarda mavjud."
    },
    ru: {
      name: "Wi-Fi",
      short_description: "Высокоскоростной интернет",
      description: "Бесплатный высокоскоростной интернет доступен в номерах и общественных зонах отеля."
    }
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

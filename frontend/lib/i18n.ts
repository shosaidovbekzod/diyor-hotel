export type Language = "en" | "uz" | "ru";

export const LANGUAGE_COOKIE = "diyor_lang";

export function normalizeLanguage(value?: string): Language {
  if (value === "uz" || value === "ru") {
    return value;
  }
  return "en";
}

export function getLocale(lang: Language) {
  if (lang === "uz") {
    return "uz-UZ";
  }
  if (lang === "ru") {
    return "ru-RU";
  }
  return "en-US";
}

export const dictionary = {
  en: {
    nav: {
      home: "Home",
      rooms: "Rooms",
      booking: "Booking",
      account: "Account",
      admin: "Admin"
    },
    footer: {
      title: "DIYOR HOTEL - TASHKENT",
      address: "Olmos 74A street, Tashkent, Uzbekistan",
      tagline:
        "A calmer hotel experience in Tashkent with premium rooms, wellness access, and attentive service.",
      telegram: "Telegram",
      youtube: "YouTube",
      visit: "Visit",
      contact: "Contact"
    },
    account: {
      eyebrow: "Guest account",
      title: "Manage bookings and guest access.",
      description:
        "Track your reservations, update your guest profile, and cancel bookings from one polished dashboard.",
      accessEyebrow: "Guest access",
      accessTitle: "Login or register",
      accessDescription:
        "Use your account to confirm reservations and review your complete stay history.",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      password: "Password",
      login: "Login",
      register: "Register",
      logout: "Logout",
      authenticated: "Authenticated",
      guestProfile: "Guest profile",
      session: "Session",
      notSignedIn: "Not signed in",
      welcomeBack: "Welcome back",
      registerHint: "Create an account to manage future stays faster.",
      bookingsEyebrow: "Bookings",
      bookingsTitle: "Your stay history",
      noBookings: "No bookings yet. Sign in or create an account to start booking.",
      cancel: "Cancel booking",
      bookingReference: "Booking reference",
      totalSpent: "Total spent",
      upcoming: "Active bookings",
      completed: "Cancelled bookings",
      pendingRequests: "Pending requests",
      historyCount: "History records",
      statusLabel: "Booking status",
      pendingStatus: "Pending",
      confirmedStatus: "Confirmed",
      cancelledStatus: "Cancelled",
      completedStatus: "Completed",
      loginSuccess: "Logged in successfully.",
      loginError: "Login failed. Check your credentials.",
      registerSuccess: "Account created successfully.",
      registerError: "Registration failed. Try a different email.",
      logoutSuccess: "You have been logged out.",
      cancelSuccess: "Booking cancelled successfully.",
      cancelError: "Cancellation failed. Please try again.",
      quickTips: "Account benefits",
      quickTip1: "Keep all booking history in one place.",
      quickTip2: "Cancel reservations directly from your dashboard.",
      quickTip3: "Reuse the same account for future bookings."
    },
    home: {
      badge: "Luxury stay in Tashkent",
      title: "A premium booking experience for DIYOR HOTEL.",
      desc:
        "Discover elegant rooms, wellness-focused facilities, and a seamless direct reservation flow inspired by leading hospitality platforms.",
      explore: "Explore rooms",
      telegram: "Chat on Telegram",
      quickSearch: "Quick search",
      findRoom: "Find your room",
      search: "Search rooms",
      promotion: "Mega promotion",
      promoTitle: "Room booking for 299,000 UZS",
      promoDesc:
        "Includes free access to the swimming pool, fitness gym, Finnish sauna, Turkish sauna, salt room, SPA, and restaurant access.",
      reserveOffer: "Reserve the offer",
      rooms: "Rooms",
      signature: "Signature stays",
      viewAll: "View all rooms",
      from: "from",
      services: "Services",
      servicesTitle: "Wellness and hospitality",
      servicesDesc:
        "Every stay is designed around restoration, comfort, and premium service details.",
      testimonials: "Testimonials",
      testimonialTitle: "Guests love the calm, comfort, and value"
    },
    rooms: {
      eyebrow: "Rooms collection",
      title: "Choose the room that matches your stay.",
      desc:
        "Filter by price, capacity, promotions, and atmosphere. Each room includes detailed amenities and direct booking support.",
      perNight: "Per night",
      guests: "guests",
      available: "Available now",
      unavailable: "Unavailable",
      details: "View details",
      amenities: "Amenities",
      reviews: "Reviews",
      view: "View",
      filtersTitle: "Search and refine",
      minPrice: "Minimum price",
      maxPrice: "Maximum price",
      checkIn: "Check-in",
      checkOut: "Check-out",
      availableOnly: "Only available rooms",
      reset: "Reset filters",
      apply: "Apply filters",
      invalidDates: "Check-out must be after check-in.",
      results: "rooms found",
      availableCount: "available now"
    },
    booking: {
      reserve: "Reserve",
      title: "Book this room",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      specialRequest: "Special request",
      requestPlaceholder: "Airport transfer, breakfast timing, celebration setup...",
      estimate: "Estimated stay total",
      nights: "Nights",
      subtotal: "Subtotal",
      taxes: "Taxes",
      total: "Total",
      liveAvailability: "Live availability",
      checking: "Checking live availability...",
      invalidDates: "Check-out must be after check-in.",
      selectDatesHint:
        "Select check-in, check-out, and guest count to load the live price.",
      availableForDates: "This room is available for the selected dates.",
      unavailableForDates: "The selected dates are no longer available for this room.",
      confirming: "Sending request...",
      confirm: "Send booking request",
      loginRequired: "Please sign in from the account page to confirm your booking.",
      success: "Booking request sent:",
      error: "Booking could not be completed. Please verify the dates and try again."
    },
    admin: {
      eyebrow: "Admin dashboard",
      title: "Oversee rooms, guests, bookings, and revenue.",
      desc:
        "This dashboard helps hotel staff monitor occupancy, manage inventory, and review customer activity.",
      access: "Admin access",
      ops: "Operations dashboard",
      email: "Admin email",
      password: "Password",
      load: "Login",
      logout: "Logout",
      initial: "Use an admin token to load live analytics.",
      loaded: "Dashboard loaded.",
      error: "Unable to load the admin dashboard. Verify your email and password.",
      revenue: "Revenue",
      bookings: "Bookings",
      active: "Active",
      occupancy: "Occupancy",
      users: "Users",
      recent: "Recent bookings"
    }
  },
  uz: {
    nav: {
      home: "Bosh sahifa",
      rooms: "Xonalar",
      booking: "Bandlov",
      account: "Kabinet",
      admin: "Admin"
    },
    footer: {
      title: "DIYOR HOTEL - TOSHKENT",
      address: "Olmos 74A ko'chasi, Toshkent, O'zbekiston",
      tagline:
        "Toshkentdagi premium xonalar, wellness hududi va e'tiborli xizmat bilan sokinroq mehmonxona tajribasi.",
      telegram: "Telegram",
      youtube: "YouTube",
      visit: "Manzil",
      contact: "Aloqa"
    },
    account: {
      eyebrow: "Mehmon kabineti",
      title: "Bronlar va mehmon akkauntingizni boshqaring.",
      description:
        "Bronlaringizni kuzating, mehmon profilingizni yangilang va bekor qilishlarni bitta qulay sahifadan boshqaring.",
      accessEyebrow: "Mehmon kirishi",
      accessTitle: "Kirish yoki ro'yxatdan o'tish",
      accessDescription:
        "Bronlarni tasdiqlash va barcha tarixni ko'rish uchun akkauntdan foydalaning.",
      fullName: "To'liq ism",
      email: "Email",
      phone: "Telefon",
      password: "Parol",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      logout: "Chiqish",
      authenticated: "Tasdiqlangan",
      guestProfile: "Mehmon profili",
      session: "Sessiya",
      notSignedIn: "Kirilmagan",
      welcomeBack: "Qaytganingizdan xursandmiz",
      registerHint: "Keyingi bronlarni tezroq boshqarish uchun akkaunt yarating.",
      bookingsEyebrow: "Bronlar",
      bookingsTitle: "Sizning turar joy tarixingiz",
      noBookings:
        "Hozircha bronlar topilmadi. Kirib ko'ring yoki yangi akkaunt yarating.",
      cancel: "Bronni bekor qilish",
      bookingReference: "Bron raqami",
      totalSpent: "Jami to'lov",
      upcoming: "Faol bronlar",
      completed: "Bekor qilinganlar",
      pendingRequests: "Kutilayotgan so'rovlar",
      historyCount: "Tarixdagi yozuvlar",
      statusLabel: "Bron holati",
      pendingStatus: "Kutilmoqda",
      confirmedStatus: "Tasdiqlangan",
      cancelledStatus: "Bekor qilingan",
      completedStatus: "Yakunlangan",
      loginSuccess: "Muvaffaqiyatli kirdingiz.",
      loginError: "Kirish amalga oshmadi. Ma'lumotlarni tekshiring.",
      registerSuccess: "Akkaunt muvaffaqiyatli yaratildi.",
      registerError: "Ro'yxatdan o'tish amalga oshmadi. Boshqa emailni sinab ko'ring.",
      logoutSuccess: "Akkauntdan chiqdingiz.",
      cancelSuccess: "Bron muvaffaqiyatli bekor qilindi.",
      cancelError: "Bekor qilish amalga oshmadi. Qayta urinib ko'ring.",
      quickTips: "Kabinet afzalliklari",
      quickTip1: "Barcha bron tarixini bir joyda saqlang.",
      quickTip2: "Bronlarni kabinetdan turib bekor qiling.",
      quickTip3: "Keyingi bronlarda shu akkauntdan foydalaning."
    },
    home: {
      badge: "Toshkentdagi premium mehmonxona",
      title: "DIYOR HOTEL uchun premium bron tajribasi.",
      desc:
        "Zamonaviy xonalar, wellness xizmatlari va qulay to'g'ridan-to'g'ri bron jarayonini kashf eting.",
      explore: "Xonalarni ko'rish",
      telegram: "Telegram orqali yozish",
      quickSearch: "Tez qidiruv",
      findRoom: "O'zingizga mos xonani toping",
      search: "Xonalarni qidirish",
      promotion: "Mega aksiya",
      promoTitle: "Xona broni 299,000 UZS",
      promoDesc:
        "Narxga basseyn, fitness, fin saunasi, turk saunasi, tuz xonasi, SPA va restoran kiradi.",
      reserveOffer: "Aksiyani bron qilish",
      rooms: "Xonalar",
      signature: "Asosiy xonalar",
      viewAll: "Barchasini ko'rish",
      from: "narxi",
      services: "Xizmatlar",
      servicesTitle: "Wellness va mehmondo'stlik",
      servicesDesc:
        "Har bir turar joy qulaylik, tiklanish va premium xizmat tafsilotlari atrofida qurilgan.",
      testimonials: "Fikrlar",
      testimonialTitle: "Mehmonlar tinchlik, qulaylik va narxdan mamnun"
    },
    rooms: {
      eyebrow: "Xonalar to'plami",
      title: "Safaringizga mos xonani tanlang.",
      desc:
        "Narx, sig'im, aksiya va atmosfera bo'yicha tanlang. Har bir xonada batafsil qulayliklar va to'g'ridan-to'g'ri bron imkoni bor.",
      perNight: "Bir kecha",
      guests: "mehmon",
      available: "Hozir mavjud",
      unavailable: "Mavjud emas",
      details: "Batafsil",
      amenities: "Qulayliklar",
      reviews: "Sharhlar",
      view: "Ko'rinish",
      filtersTitle: "Qidiruv va saralash",
      minPrice: "Minimal narx",
      maxPrice: "Maksimal narx",
      checkIn: "Kelish sanasi",
      checkOut: "Ketish sanasi",
      availableOnly: "Faqat bo'sh xonalar",
      reset: "Tozalash",
      apply: "Filterni qo'llash",
      invalidDates: "Ketish sanasi kelish sanasidan keyin bo'lishi kerak.",
      results: "ta xona topildi",
      availableCount: "tasi hozir mavjud"
    },
    booking: {
      reserve: "Bron",
      title: "Ushbu xonani bron qiling",
      checkIn: "Kelish sanasi",
      checkOut: "Ketish sanasi",
      guests: "Mehmonlar",
      specialRequest: "Maxsus so'rov",
      requestPlaceholder: "Transfer, nonushta vaqti, bayram bezagi...",
      estimate: "Taxminiy umumiy narx",
      nights: "Kechalar",
      subtotal: "Asosiy summa",
      taxes: "Soliqlar",
      total: "Jami",
      liveAvailability: "Jonli mavjudlik",
      checking: "Jonli mavjudlik tekshirilmoqda...",
      invalidDates: "Ketish sanasi kelish sanasidan keyin bo'lishi kerak.",
      selectDatesHint:
        "Jonli narxni ko'rish uchun kelish, ketish va mehmonlar sonini tanlang.",
      availableForDates: "Tanlangan sanalar uchun xona mavjud.",
      unavailableForDates: "Bu xona tanlangan sanalarda band bo'lib qoldi.",
      confirming: "So'rov yuborilmoqda...",
      confirm: "Bron so'rovini yuborish",
      loginRequired: "Bronni tasdiqlash uchun kabinet sahifasiga kiring.",
      success: "Bron so'rovi yuborildi:",
      error: "Bron amalga oshmadi. Sanalarni tekshirib qayta urinib ko'ring."
    },
    admin: {
      eyebrow: "Admin panel",
      title: "Xonalar, mehmonlar, bronlar va tushumni boshqaring.",
      desc:
        "Bu panel mehmonxona jamoasiga bandlik, inventar va mijoz faolligini kuzatish uchun mo'ljallangan.",
      access: "Admin kirishi",
      ops: "Operatsion panel",
      email: "Admin email",
      password: "Parol",
      load: "Kirish",
      logout: "Chiqish",
      initial: "Jonli analitika uchun admin tokenidan foydalaning.",
      loaded: "Panel yuklandi.",
      error: "Admin panel yuklanmadi. Email yoki parolni tekshiring.",
      revenue: "Tushum",
      bookings: "Bronlar",
      active: "Faol",
      occupancy: "Bandlik",
      users: "Foydalanuvchilar",
      recent: "So'nggi bronlar"
    }
  },
  ru: {
    nav: {
      home: "Главная",
      rooms: "Номера",
      booking: "Бронирование",
      account: "Кабинет",
      admin: "Админ"
    },
    footer: {
      title: "DIYOR HOTEL - ТАШКЕНТ",
      address: "улица Олмос 74A, Ташкент, Узбекистан",
      tagline:
        "Спокойный формат проживания в Ташкенте с премиальными номерами, wellness-зоной и внимательным сервисом.",
      telegram: "Telegram",
      youtube: "YouTube",
      visit: "Адрес",
      contact: "Контакты"
    },
    account: {
      eyebrow: "Кабинет гостя",
      title: "Управляйте бронированиями и доступом к аккаунту.",
      description:
        "Следите за бронированиями, обновляйте профиль гостя и отменяйте заказы из одной удобной панели.",
      accessEyebrow: "Вход для гостя",
      accessTitle: "Вход или регистрация",
      accessDescription:
        "Используйте аккаунт для подтверждения бронирований и просмотра полной истории проживания.",
      fullName: "Полное имя",
      email: "Email",
      phone: "Телефон",
      password: "Пароль",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      authenticated: "Авторизован",
      guestProfile: "Профиль гостя",
      session: "Сессия",
      notSignedIn: "Вход не выполнен",
      welcomeBack: "С возвращением",
      registerHint: "Создайте аккаунт, чтобы быстрее управлять будущими поездками.",
      bookingsEyebrow: "Бронирования",
      bookingsTitle: "История ваших проживаний",
      noBookings:
        "Бронирования пока не загружены. Войдите в аккаунт или создайте новый.",
      cancel: "Отменить бронь",
      bookingReference: "Номер брони",
      totalSpent: "Всего оплачено",
      upcoming: "Активные брони",
      completed: "Отмененные брони",
      pendingRequests: "Ожидающие запросы",
      historyCount: "Записей в истории",
      statusLabel: "Статус брони",
      pendingStatus: "Ожидает",
      confirmedStatus: "Подтверждено",
      cancelledStatus: "Отменено",
      completedStatus: "Завершено",
      loginSuccess: "Вход выполнен успешно.",
      loginError: "Не удалось войти. Проверьте данные.",
      registerSuccess: "Аккаунт успешно создан.",
      registerError: "Не удалось зарегистрироваться. Попробуйте другой email.",
      logoutSuccess: "Вы вышли из аккаунта.",
      cancelSuccess: "Бронирование успешно отменено.",
      cancelError: "Не удалось отменить бронь. Попробуйте еще раз.",
      quickTips: "Преимущества кабинета",
      quickTip1: "Храните всю историю бронирований в одном месте.",
      quickTip2: "Отменяйте брони прямо из кабинета.",
      quickTip3: "Используйте один и тот же аккаунт для будущих поездок."
    },
    home: {
      badge: "Премиальный отдых в Ташкенте",
      title: "Премиальный опыт бронирования для DIYOR HOTEL.",
      desc:
        "Откройте для себя элегантные номера, wellness-услуги и удобный прямой онлайн-процесс бронирования.",
      explore: "Посмотреть номера",
      telegram: "Написать в Telegram",
      quickSearch: "Быстрый поиск",
      findRoom: "Найдите свой номер",
      search: "Поиск номеров",
      promotion: "Мега акция",
      promoTitle: "Бронирование номера за 299,000 UZS",
      promoDesc:
        "В стоимость входят бассейн, фитнес-зал, финская сауна, турецкая сауна, соляная комната, SPA и доступ в ресторан.",
      reserveOffer: "Забронировать акцию",
      rooms: "Номера",
      signature: "Фирменные номера",
      viewAll: "Смотреть все",
      from: "от",
      services: "Услуги",
      servicesTitle: "Wellness и гостеприимство",
      servicesDesc:
        "Каждое проживание строится вокруг комфорта, восстановления и премиального сервиса.",
      testimonials: "Отзывы",
      testimonialTitle: "Гости ценят спокойствие, комфорт и выгодную цену"
    },
    rooms: {
      eyebrow: "Коллекция номеров",
      title: "Выберите номер под ваш формат поездки.",
      desc:
        "Выбирайте по цене, вместимости, акциям и атмосфере. Каждый номер включает подробные удобства и прямое бронирование.",
      perNight: "За ночь",
      guests: "гостей",
      available: "Доступно сейчас",
      unavailable: "Недоступно",
      details: "Подробнее",
      amenities: "Удобства",
      reviews: "Отзывы",
      view: "Категория",
      filtersTitle: "Поиск и фильтры",
      minPrice: "Минимальная цена",
      maxPrice: "Максимальная цена",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      availableOnly: "Только свободные номера",
      reset: "Сбросить",
      apply: "Применить фильтры",
      invalidDates: "Дата выезда должна быть позже даты заезда.",
      results: "номеров найдено",
      availableCount: "доступно сейчас"
    },
    booking: {
      reserve: "Бронирование",
      title: "Забронировать этот номер",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      guests: "Гости",
      specialRequest: "Особое пожелание",
      requestPlaceholder: "Трансфер, время завтрака, оформление для праздника...",
      estimate: "Предварительная стоимость",
      nights: "Ночи",
      subtotal: "Основная сумма",
      taxes: "Налоги",
      total: "Итого",
      liveAvailability: "Живая доступность",
      checking: "Проверяем актуальную доступность...",
      invalidDates: "Дата выезда должна быть позже даты заезда.",
      selectDatesHint:
        "Выберите даты заезда, выезда и количество гостей, чтобы загрузить актуальную цену.",
      availableForDates: "Этот номер доступен на выбранные даты.",
      unavailableForDates: "Выбранные даты больше недоступны для этого номера.",
      confirming: "Отправка запроса...",
      confirm: "Отправить запрос на бронь",
      loginRequired: "Чтобы подтвердить бронь, войдите в кабинет.",
      success: "Запрос на бронь отправлен:",
      error: "Не удалось завершить бронирование. Проверьте даты и попробуйте снова."
    },
    admin: {
      eyebrow: "Панель администратора",
      title: "Контролируйте номера, гостей, брони и выручку.",
      desc:
        "Панель помогает отслеживать загрузку, управлять инвентарем и видеть активность гостей.",
      access: "Доступ администратора",
      ops: "Операционная панель",
      email: "Email администратора",
      password: "Пароль",
      load: "Войти",
      logout: "Выйти",
      initial: "Используйте токен администратора для загрузки аналитики.",
      loaded: "Панель загружена.",
      error: "Не удалось загрузить панель. Проверьте email и пароль.",
      revenue: "Выручка",
      bookings: "Брони",
      active: "Активные",
      occupancy: "Заполняемость",
      users: "Пользователи",
      recent: "Последние брони"
    }
  }
} as const;

export function t(lang: Language) {
  return dictionary[lang];
}

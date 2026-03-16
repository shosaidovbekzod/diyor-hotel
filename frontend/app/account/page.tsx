import { AuthPanel } from "@/components/auth-panel";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const editorialCopy = {
  en: {
    asideTitle: "Guest access is arranged with the same calm precision as the stay itself.",
    asideBody:
      "Sign in to review confirmed reservations, manage cancellations, and keep your guest details ready for future arrivals."
  },
  uz: {
    asideTitle: "Mehmon kabineti turar joyning o'zi kabi sokin va aniq boshqaruv uchun yaratilgan.",
    asideBody:
      "Tasdiqlangan bronlarni ko'rish, bekor qilishlarni boshqarish va keyingi kelishlar uchun ma'lumotlaringizni tayyor saqlash uchun akkauntga kiring."
  },
  ru: {
    asideTitle: "Гостевой кабинет построен с той же спокойной точностью, что и само проживание.",
    asideBody:
      "Войдите, чтобы видеть подтвержденные бронирования, управлять отменами и держать данные гостя готовыми к следующим заездам."
  }
} as const;

export default async function AccountPage() {
  const lang = await getServerLanguage();
  const copy = t(lang).account;
  const editorial = editorialCopy[lang];

  return (
    <div className="pb-12 sm:pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#f1ebe1]">
        <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="section-label">{copy.eyebrow}</div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 sm:text-lg">{copy.description}</p>
          </div>
          <div className="border-t border-[#d8cfc2] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="section-label">{copy.quickTips}</div>
            <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight text-ink sm:text-4xl">
              {editorial.asideTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink/72">{editorial.asideBody}</p>
          </div>
        </div>
      </section>

      <section className="shell mt-10 sm:mt-14">
        <AuthPanel lang={lang} />
      </section>
    </div>
  );
}

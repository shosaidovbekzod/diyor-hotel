import { AdminPanel } from "@/components/admin-panel";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const editorialCopy = {
  en: {
    asideTitle: "A quieter control room for rooms, arrivals, and revenue.",
    asideBody:
      "The dashboard keeps live operations visible without clutter, so staff can review bookings, occupancy, and guest activity in one place."
  },
  uz: {
    asideTitle: "Xonalar, kelishlar va tushum uchun sokinroq boshqaruv markazi.",
    asideBody:
      "Panel jonli operatsiyalarni ortiqcha shovqinsiz ko'rsatadi, shuning uchun jamoa bronlar, bandlik va mehmon faolligini bitta joydan kuzata oladi."
  },
  ru: {
    asideTitle: "Более спокойный центр управления номерами, заездами и выручкой.",
    asideBody:
      "Панель показывает живые операции без лишнего шума, чтобы команда могла видеть брони, загрузку и активность гостей в одном месте."
  }
} as const;

export default async function AdminPage() {
  const lang = await getServerLanguage();
  const copy = t(lang).admin;
  const editorial = editorialCopy[lang];

  return (
    <div className="pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#eee6da]">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="section-label">{copy.eyebrow}</div>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.95] text-ink md:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/72">{copy.desc}</p>
          </div>
          <div className="border-t border-[#d8cfc2] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="section-label">{copy.access}</div>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-ink">
              {editorial.asideTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink/72">{editorial.asideBody}</p>
          </div>
        </div>
      </section>

      <section className="shell mt-14">
        <AdminPanel lang={lang} />
      </section>
    </div>
  );
}

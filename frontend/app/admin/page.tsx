import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { AdminPanel } from "@/components/admin-panel";

export default async function AdminPage() {
  const lang = await getServerLanguage();
  const copy = t(lang).admin;

  return (
    <div className="shell py-14">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.eyebrow}</div>
        <h1 className="mt-2 font-display text-5xl">{copy.title}</h1>
        <p className="mt-4 text-ink/70">{copy.desc}</p>
      </div>
      <div className="mt-10">
        <AdminPanel lang={lang} />
      </div>
    </div>
  );
}

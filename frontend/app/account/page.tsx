import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { AuthPanel } from "@/components/auth-panel";

export default async function AccountPage() {
  const lang = await getServerLanguage();
  const copy = t(lang).account;

  return (
    <div className="shell py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr]">
        <div className="max-w-4xl">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.eyebrow}</div>
          <h1 className="mt-2 font-display text-5xl">{copy.title}</h1>
          <p className="mt-4 text-ink/70">{copy.description}</p>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.quickTips}</div>
          <div className="mt-4 space-y-3 text-sm text-ink/75">
            <div className="rounded-2xl bg-sand px-4 py-3">{copy.quickTip1}</div>
            <div className="rounded-2xl bg-sand px-4 py-3">{copy.quickTip2}</div>
            <div className="rounded-2xl bg-sand px-4 py-3">{copy.quickTip3}</div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <AuthPanel lang={lang} />
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { LANGUAGE_COOKIE, type Language } from "@/lib/i18n";

const options: Array<{ value: Language; label: string }> = [
  { value: "en", label: "EN" },
  { value: "uz", label: "UZ" },
  { value: "ru", label: "RU" }
];

export function LanguageSwitcher({ current }: { current: Language }) {
  const router = useRouter();

  function handleChange(lang: Language) {
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-stone">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={`border-b pb-1 transition ${
            current === option.value ? "border-ink text-ink" : "border-transparent hover:border-[#bfae95] hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

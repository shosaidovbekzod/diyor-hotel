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
    <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={`rounded-full px-3 py-2 text-xs tracking-[0.25em] transition ${
            current === option.value ? "bg-white text-ink" : "text-white/65 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

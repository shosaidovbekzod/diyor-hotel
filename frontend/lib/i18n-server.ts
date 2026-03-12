import { cookies } from "next/headers";
import { normalizeLanguage, type Language } from "@/lib/i18n";

export async function getServerLanguage(): Promise<Language> {
  const store = await cookies();
  return normalizeLanguage(store.get("diyor_lang")?.value);
}

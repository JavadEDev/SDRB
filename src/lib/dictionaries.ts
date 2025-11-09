import noDict from "./dictionaries/no.json";
import enDict from "./dictionaries/en.json";

export type Dictionary = typeof noDict;

export async function getDictionary(locale: "no" | "en"): Promise<Dictionary> {
  return locale === "no" ? noDict : enDict;
}


import { getDictionary } from "@/lib/dictionaries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.about} - ${dict.site.title}`,
    description: dict.site.description,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.nav.about}</h1>
      <p className="text-lg">{dict.site.description}</p>
    </div>
  );
}


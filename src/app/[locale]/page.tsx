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
    title: dict.site.title,
    description: dict.site.description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.home.title}</h1>
      <div className="space-y-4">
        <p className="text-lg">
          {dict.home.owner} - {dict.home.address}
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{dict.home.services.title}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{dict.home.services.sewing}</li>
            <li>{dict.home.services.redesign}</li>
            <li>{dict.home.services.courses}</li>
            <li>{dict.home.services.themeEvenings}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}


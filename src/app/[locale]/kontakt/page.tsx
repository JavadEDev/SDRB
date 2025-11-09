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
    title: `${dict.nav.contact} - ${dict.site.title}`,
    description: dict.site.description,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.contact.title}</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {locale === "no" ? "Adresse" : "Address"}
          </h2>
          <p>{dict.contact.address}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {locale === "no" ? "Telefon" : "Phone"}
          </h2>
          <a href={`tel:${dict.contact.phone}`} className="text-blue-600 hover:underline dark:text-blue-400">
            {dict.contact.phone}
          </a>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {locale === "no" ? "E-post" : "Email"}
          </h2>
          <a href={`mailto:${dict.contact.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
            {dict.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}


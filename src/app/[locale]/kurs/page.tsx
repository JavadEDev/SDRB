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
    title: `${dict.nav.courses} - ${dict.site.title}`,
    description: dict.coursesPage.description,
  };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.coursesPage.title}</h1>
      <p className="text-lg mb-8">{dict.coursesPage.description}</p>
      <div className="grid gap-6 md:grid-cols-2">
        {dict.coursesPage.sections.map((section, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


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
    <div className="space-y-16">
      <section className="space-y-6">
        <h1>{dict.nav.about}</h1>
        <p className="max-w-3xl text-[var(--muted-text)]">
          {dict.site.description}
        </p>
      </section>

      <section className="grid gap-10 rounded-[calc(var(--radius)*3)] border bg-card px-8 py-12 shadow-sm md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-12">
        <div className="space-y-6">
          <h2>{dict.home.story.heading}</h2>
          {Array.isArray(dict.home.story.paragraphs) &&
            dict.home.story.paragraphs.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
        <div className="flex flex-col gap-6 rounded-[calc(var(--radius)*2)] border bg-[var(--muted-bg)]/50 p-8 shadow-inner">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "Grunnlegger" : "Founder"}
            </p>
            <p className="font-serif text-3xl">{dict.home.owner}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "Atelieradresse" : "Studio address"}
            </p>
            <p className="font-serif text-2xl">{dict.home.address}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.isArray(dict.home.heroStats) &&
              dict.home.heroStats.map((stat: any) => (
                <div key={stat.label} className="rounded-[calc(var(--radius)*2)] border bg-[var(--bg)] px-5 py-4 shadow-sm">
                  <p className="font-serif text-2xl">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">
                    {stat.label}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}


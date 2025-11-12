import { getDictionary } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import { MSection } from "@/components/anim/reveal";
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
    <div className="space-y-12">
      <MSection
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <h1>{dict.contact.title}</h1>
        <p className="max-w-3xl text-[var(--muted-text)]">
          {locale === "no"
            ? "Vi tar gjerne en prat om ditt neste prosjekt eller hjelper deg med å finne riktig kurs. Send en e-post, ring oss, eller avtale et besøk i atelieret."
            : "We would love to discuss your next project or help you find the right workshop. Send an email, give us a call, or schedule a visit to the studio."}
        </p>
      </MSection>

      <MSection
        className="grid gap-8 rounded-[calc(var(--radius)*3)] border bg-card px-8 py-12 shadow-sm md:grid-cols-2 md:px-12"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl">
              {locale === "no" ? "Besøk oss" : "Visit us"}
            </h2>
            <p className="text-sm text-[var(--muted-text)]">
              {dict.contact.address}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-lg font-semibold">
              {locale === "no" ? "Atelier timer" : "Studio hours"}
            </h3>
            <p className="text-sm text-[var(--muted-text)]">
              {locale === "no"
                ? "Mandag–torsdag etter avtale · Kveldsåpne kurs og temakvelder"
                : "Monday–Thursday by appointment · Evening workshops and events"}
            </p>
          </div>
          <Button asChild variant="secondary">
            <a href={`https://maps.google.com/?q=${encodeURIComponent(dict.contact.address)}`} target="_blank" rel="noreferrer">
              {locale === "no" ? "Åpne i kart" : "Open in maps"}
            </a>
          </Button>
        </div>
        <div className="space-y-6 rounded-[calc(var(--radius)*2)] border bg-[var(--muted-bg)]/50 p-8 shadow-inner">
          <div>
            <h3 className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "Telefon" : "Phone"}
            </h3>
            <a
              href={`tel:${dict.contact.phone}`}
              className="font-serif text-3xl text-[var(--text)] hover:opacity-80"
            >
              {dict.contact.phone}
            </a>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "E-post" : "Email"}
            </h3>
            <a
              href={`mailto:${dict.contact.email}`}
              className="font-serif text-2xl text-[var(--text)] hover:opacity-80"
            >
              {dict.contact.email}
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted-text)]">
              {locale === "no"
                ? "Send oss gjerne noen stikkord om prosjektet ditt så forbereder vi forslag til materialer og fremgang."
                : "Share a few details about your project and we will prepare material suggestions and an approach before we meet."}
            </p>
            <Button asChild>
              <a href={`mailto:${dict.contact.email}`}>{locale === "no" ? "Send e-post" : "Send email"}</a>
            </Button>
          </div>
        </div>
        </MSection>
    </div>
  );
}


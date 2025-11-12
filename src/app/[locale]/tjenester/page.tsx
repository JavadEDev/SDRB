import { getDictionary } from "@/lib/dictionaries";
import type { Metadata } from "next";
import { MDiv, MSection } from "@/components/anim/reveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Sparkles, GraduationCap, Calendar } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.services} - ${dict.site.title}`,
    description: dict.servicesPage.description,
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const services = [
    {
      key: "sewing",
      title: dict.servicesPage.services.sewing.title,
      description: dict.servicesPage.services.sewing.longDescription,
      cta: dict.servicesPage.services.sewing.cta,
      Icon: Scissors,
    },
    {
      key: "redesign",
      title: dict.servicesPage.services.redesign.title,
      description: dict.servicesPage.services.redesign.longDescription,
      cta: dict.servicesPage.services.redesign.cta,
      Icon: Sparkles,
    },
    {
      key: "courses",
      title: dict.servicesPage.services.courses.title,
      description: dict.servicesPage.services.courses.longDescription,
      cta: dict.servicesPage.services.courses.cta,
      Icon: GraduationCap,
    },
    {
      key: "themeEvenings",
      title: dict.servicesPage.services.themeEvenings.title,
      description: dict.servicesPage.services.themeEvenings.longDescription,
      cta: dict.servicesPage.services.themeEvenings.cta,
      Icon: Calendar,
    },
  ];

  return (
    <div className="space-y-16">
      <MSection
        className="space-y-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <h1>{dict.servicesPage.title}</h1>
        <p className="mx-auto max-w-3xl text-[var(--muted-text)]">
          {dict.servicesPage.description}
        </p>
      </MSection>

      <MSection
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {services.map(({ key, title, description, cta, Icon }) => (
          <MDiv
            key={key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Card className="h-full transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--action-primary-bg)]/10">
                  <Icon className="h-6 w-6 text-[var(--action-primary-bg)]" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {cta?.text && cta?.link && (
                  <Button asChild variant="secondary" className="mt-2">
                    <Link href={cta.link}>{cta.text}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </MDiv>
        ))}
      </MSection>

      <MSection
        className="grid gap-8 rounded-[calc(var(--radius)*3)] border bg-[var(--muted-bg)]/50 px-8 py-12 shadow-sm md:grid-cols-2 md:px-12"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h2 className="font-serif text-3xl">
            {locale === "no"
              ? "Tilpassede oppdrag og bedriftsavtaler"
              : "Tailored projects and corporate programs"}
          </h2>
          <p className="text-sm text-[var(--muted-text)]">
            {locale === "no"
              ? "Vi utvikler egne kurs, temakvelder og redesignprosjekter for bedrifter, lag og foreninger. Ta kontakt så finner vi formen sammen."
              : "We design custom workshops, themed evenings, and redesign projects for companies, teams, and communities. Reach out and we’ll shape the experience together."}
          </p>
          <Button asChild>
            <Link href={`/${locale}/kontakt`}>
              {locale === "no" ? "Kontakt oss" : "Contact us"}
            </Link>
          </Button>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-[calc(var(--radius)*2)] border bg-[var(--bg)] p-8 shadow-inner">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "E-post" : "Email"}
            </p>
            <p className="font-serif text-3xl">{dict.contact.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {locale === "no" ? "Telefon" : "Phone"}
            </p>
            <p className="font-serif text-2xl">{dict.contact.phone}</p>
          </div>
        </div>
      </MSection>
    </div>
  );
}

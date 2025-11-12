import { getDictionary } from "@/lib/dictionaries";
import { getCoursesWithSessions, getGalleryItems } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MDiv, MSection } from "@/components/anim/reveal";

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
  const galleryItems = (await getGalleryItems()).slice(0, 4);
  const courses = await getCoursesWithSessions();

  const upcomingSessions = courses
    .flatMap((course) =>
      (course.sessions || []).map((session) => ({
        id: session.id,
        startAt: new Date(session.startAt),
        availableSeats: session.availableSeats,
        seats: session.seats,
        courseTitle:
          (course.title as any)?.[locale] ||
          (course.title as any)?.no ||
          (course.title as any)?.en ||
          "",
        location: course.location,
      }))
    )
    .filter((session) => session.startAt.getTime() >= Date.now())
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
    .slice(0, 3);

  const localeTag = locale === "no" ? "nb-NO" : "en-GB";
  const sessionFormatter = new Intl.DateTimeFormat(localeTag, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-24">
      <MSection
        className="relative overflow-hidden rounded-[calc(var(--radius)*3)] border bg-muted px-6 py-16 shadow-sm md:px-12 md:py-24"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute -left-24 top-6 h-64 w-64 rounded-full bg-[var(--action-primary-bg)]/15 blur-2xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--action-accent-bg)]/30 blur-3xl" />
        <div className="relative z-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-text)]">
              {dict.site.title}
            </p>
            <div className="space-y-4">
              <h1>{dict.home.title}</h1>
              <p className="max-w-2xl text-base md:text-xl text-[var(--muted-text)]">
                {dict.home.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/${locale}/kurs`}>{dict.home.ctaCourses}</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/${locale}/kontakt`}>{dict.home.ctaContact}</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 rounded-[calc(var(--radius)*2)] border bg-[var(--bg)]/80 p-6 shadow-lg backdrop-blur">
            {Array.isArray(dict.home.heroStats) &&
              dict.home.heroStats.map((stat: any) => (
                <div key={stat.label} className="space-y-1">
                  <p className="font-serif text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--muted-text)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            <div className="flex items-center justify-between rounded-full border border-[var(--input-border)] px-4 py-3 text-sm text-[var(--muted-text)]">
              <span>{dict.home.owner}</span>
              <span>{dict.home.address}</span>
            </div>
          </div>
        </div>
      </MSection>

      <MSection
        className="mx-auto max-w-3xl space-y-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h2>{dict.home.story.heading}</h2>
        {Array.isArray(dict.home.story.paragraphs) &&
          dict.home.story.paragraphs.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
      </MSection>

      <section className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2>{dict.home.galleryPreview.title}</h2>
            <p className="max-w-2xl text-[var(--muted-text)]">
              {dict.home.galleryPreview.description}
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href={`/${locale}/galleri`}>
              {dict.home.galleryPreview.cta}
            </Link>
          </Button>
        </div>
        {galleryItems.length === 0 ? (
          <div className="rounded-[calc(var(--radius)*2)] border bg-card/70 p-12 text-center text-sm text-[var(--muted-text)]">
            {locale === "no"
              ? "Legg til galleriobjekter i administrasjonen for å vise dem her."
              : "Add gallery items in the admin area to display them here."}
          </div>
        ) : (
          <MDiv
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {galleryItems.map((item) => {
              const title =
                item.title?.[locale] || item.title?.no || item.title?.en || "";
              const category = item.category || "";
              return (
                <MDiv
                  key={item.id}
                  className="group overflow-hidden rounded-[calc(var(--radius)*2)] border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={item.imageUrl}
                      alt={title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="space-y-1 p-6">
                    <h3 className="font-serif text-xl">{title}</h3>
                    {category && (
                      <p className="text-sm text-[var(--muted-text)]">
                        {category}
                      </p>
                    )}
                  </div>
                </MDiv>
              );
            })}
          </MDiv>
        )}
      </section>

      <MSection
        className="space-y-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3 max-w-3xl">
          <h2>{dict.home.services.title}</h2>
          <p className="text-[var(--muted-text)]">
            {dict.home.services.description}
          </p>
        </div>
        <MDiv
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {Array.isArray(dict.home.services.items) &&
            dict.home.services.items.map((service: any) => (
              <MDiv
                key={service.title}
                className="rounded-[calc(var(--radius)*2)] border bg-card p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <h3 className="font-serif text-2xl">{service.title}</h3>
                <p className="mt-3 text-sm text-[var(--muted-text)]">
                  {service.description}
                </p>
              </MDiv>
            ))}
        </MDiv>
      </MSection>

      <MSection
        className="grid gap-10 rounded-[calc(var(--radius)*3)] border bg-card px-8 py-12 shadow-sm md:grid-cols-2 md:px-12"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-text)]">
            {dict.home.process.subtitle}
          </p>
          <h2>{dict.home.process.title}</h2>
          <div className="space-y-6">
            {Array.isArray(dict.home.process.steps) &&
              dict.home.process.steps.map((step: any, index: number) => (
                <div key={step.title} className="flex gap-4">
                  <span className="mt-1 h-9 w-9 flex-shrink-0 rounded-full bg-[var(--muted-bg)] text-center text-sm font-semibold leading-9 text-[var(--text)]">
                    {index + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p className="text-sm text-[var(--muted-text)] mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-[calc(var(--radius)*2)] border bg-[var(--muted-bg)]/50 p-10 shadow-inner">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              Atelier
            </p>
            <p className="font-serif text-3xl">{dict.home.address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              Kontakt
            </p>
            <p className="font-serif text-2xl">{dict.contact.phone}</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-[var(--muted-text)]">
              {locale === "no"
                ? "Besøk oss for private konsultasjoner, kurs og temakvelder."
                : "Visit us for private consultations, courses, and themed evenings."}
            </p>
            <Button asChild variant="secondary">
              <Link href={`/${locale}/kontakt`}>{dict.home.ctaContact}</Link>
            </Button>
          </div>
        </div>
      </MSection>

      <MSection
        className="space-y-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2>{dict.home.coursesTeaser.title}</h2>
            <p className="max-w-2xl text-[var(--muted-text)]">
              {dict.home.coursesTeaser.description}
            </p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/kalender`}>
              {dict.home.coursesTeaser.cta}
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {upcomingSessions.length === 0 ? (
            <div className="rounded-[calc(var(--radius)*2)] border bg-card p-10 text-center text-sm text-[var(--muted-text)] md:col-span-3">
              {locale === "no"
                ? "Ingen kommende økter registrert ennå. Kom tilbake snart!"
                : "No upcoming sessions yet. Check back soon!"}
            </div>
          ) : (
            upcomingSessions.map((session) => (
              <MDiv
                key={session.id}
                className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*2)] border bg-card p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-text)]">
                    {sessionFormatter.format(session.startAt)}
                  </p>
                  <h3 className="font-serif text-2xl">{session.courseTitle}</h3>
                  <p className="text-sm text-[var(--muted-text)]">
                    {locale === "no" ? "Ledige plasser" : "Seats available"}:{" "}
                    {session.availableSeats} / {session.seats}
                  </p>
                  <p className="text-sm text-[var(--muted-text)]">
                    {session.location}
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/${locale}/kalender`}>
                    {locale === "no" ? "Meld deg på" : "Register"}
                  </Link>
                </Button>
              </MDiv>
            ))
          )}
        </div>
      </MSection>

      <MSection
        className="rounded-[calc(var(--radius)*3)] border bg-[var(--muted-bg)]/60 px-6 py-12 shadow-sm md:px-16 md:py-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="space-y-3">
            <h2>{dict.home.newsletter.title}</h2>
            <p className="text-[var(--muted-text)]">
              {dict.home.newsletter.description}
            </p>
          </div>
          <form className="flex w-full flex-col gap-4 md:flex-row">
            <input
              type="email"
              required
              placeholder={dict.home.newsletter.placeholder}
              className="w-full rounded-full border border-[var(--input-border)] bg-[var(--bg)] px-6 py-3 text-base shadow-sm focus:ring-[var(--action-primary-bg)]"
            />
            <Button type="submit">{dict.home.newsletter.cta}</Button>
          </form>
        </div>
      </MSection>
    </div>
  );
}

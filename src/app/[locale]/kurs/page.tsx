import { getDictionary } from "@/lib/dictionaries";
import { getCoursesWithSessions } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { MDiv, MSection } from "@/components/anim/reveal";
import { CourseGrid } from "@/components/courses/course-grid";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const courses = await getCoursesWithSessions();
  const makeLabel = (key: string) => {
    const words = key.replace(/[-_]/g, " ").split(" ").filter(Boolean);
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };
  const categoriesFromDb = Array.from(
    new Set(
      courses
        .map((c: any) => (c.category || "").toLowerCase())
        .filter((v: string) => v && v.trim().length > 0)
    )
  ).map((key: string) => ({ key, label: makeLabel(key) }));
  const noCoursesText =
    locale === "no"
      ? "Ingen kurs tilgjengelig akkurat nå."
      : "No courses available right now.";
  const upcomingSessionsText =
    locale === "no" ? "Kommende økter" : "Upcoming sessions";
  const seatsText = locale === "no" ? "Plasser" : "Seats";
  const noSessionsText =
    locale === "no"
      ? "Ingen planlagte økter for øyeblikket."
      : "No scheduled sessions at the moment.";
  const localeTag = locale === "no" ? "nb-NO" : "en-GB";
  const sessionFormatter = new Intl.DateTimeFormat(localeTag, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-16">
      <MSection
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1>{dict.coursesPage.title}</h1>
            <p className="mt-4 max-w-3xl text-[var(--muted-text)]">
              {dict.coursesPage.description}
            </p>
          </div>
          <Button asChild variant="secondary">
            <a href={`/${locale}/kalender`}>
              {locale === "no" ? "Åpne kalender" : "Open calendar"}
            </a>
          </Button>
        </div>
        {Array.isArray(dict.coursesPage.sections) && (
          <div className="grid gap-4 rounded-[calc(var(--radius)*3)] border bg-card p-6 shadow-sm md:grid-cols-2 lg:grid-cols-4">
            {dict.coursesPage.sections.map((section: any) => (
              <div
                key={section.title}
                className="rounded-[calc(var(--radius)*2)] bg-[var(--muted-bg)]/40 p-5"
              >
                <h2 className="font-serif text-xl">{section.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted-text)]">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </MSection>

      {courses.length === 0 ? (
        <div className="rounded-[calc(var(--radius)*2)] border bg-card p-12 text-center text-sm text-[var(--muted-text)]">
          {noCoursesText}
        </div>
      ) : (
        <CourseGrid
          courses={courses as any}
          locale={locale}
          labels={{
            upcomingSessions: upcomingSessionsText,
            seats: seatsText,
            noSessions: noSessionsText,
            browseCta:
              locale === "no" ? "Planlegg deltakelse" : "Plan your spot",
            categoriesTitle: locale === "no" ? "Kategori" : "Category",
            categories: categoriesFromDb,
            allLabel: locale === "no" ? "Alle" : "All",
            calendarPath: `/${locale}/kalender`,
          }}
        />
      )}
    </div>
  );
}

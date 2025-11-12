import { getDictionary } from "@/lib/dictionaries";
import { getCoursesWithSessions, getUserRegistrations } from "@/lib/queries";
import type { Metadata } from "next";
import { MDiv, MSection } from "@/components/anim/reveal";
import { RegisterButton } from "@/components/register-button";
import { getServerSession } from "@/lib/auth";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.calendar} - ${dict.site.title}`,
    description: dict.site.description,
  };
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const session = await getServerSession();
  const coursesWithSessions = await getCoursesWithSessions();

  const userRegistrationMap: Record<string, string> = {};
  if (session?.user?.id) {
    const registrations = await getUserRegistrations((session.user as any).id);
    registrations.forEach((entry) => {
      if (entry.session?.id) {
        userRegistrationMap[entry.session.id] = entry.registration.id;
      }
    });
  }

  const allSessions = coursesWithSessions.flatMap((course) =>
    (course.sessions || []).map((session) => ({
      id: session.id,
      startAt: new Date(session.startAt).toISOString(),
      seats: session.seats,
      availableSeats: session.availableSeats,
      location: course.location,
      courseTitle:
        (course.title as any)?.[locale] ||
        (course.title as any)?.no ||
        (course.title as any)?.en ||
        "",
      category: (course.category || "").toString(),
    }))
  );

  allSessions.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  return (
    <div className="space-y-10">
      <MSection
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <h1>{dict.nav.calendar}</h1>
        <p className="max-w-3xl text-[var(--muted-text)]">
          {locale === "no"
            ? "Planlegg ditt neste kurs og reserver plass i god tid. Vi holder små grupper for å sikre personlig oppfølging."
            : "Plan your next workshop and reserve your seat early. We keep groups intimate to ensure personal guidance."}
        </p>
      </MSection>
      {allSessions.length === 0 ? (
        <div className="rounded-[calc(var(--radius)*2)] border bg-card p-12 text-center text-sm text-[var(--muted-text)]">
          {locale === "no" ? "Ingen kommende kurs" : "No upcoming courses"}
        </div>
      ) : (
        <CalendarGrid
          sessions={allSessions}
          userRegistrationMap={userRegistrationMap}
          locale={locale}
        />
      )}
    </div>
  );
}

import { getDictionary } from "@/lib/dictionaries";
import { getCoursesWithSessions } from "@/lib/queries";
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
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.coursesPage.title}</h1>
      <p className="text-lg mb-8">{dict.coursesPage.description}</p>
      {courses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{noCoursesText}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const title =
              (course.title as any)?.[locale] ||
              (course.title as any)?.no ||
              (course.title as any)?.en ||
              "";
            const description =
              (course.description as any)?.[locale] ||
              (course.description as any)?.no ||
              (course.description as any)?.en ||
              "";
            return (
              <div key={course.id} className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                {description && <p className="mb-3">{description}</p>}
                {course.price && (
                  <p className="font-medium">{course.price} kr</p>
                )}
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">{upcomingSessionsText}</p>
                  {Array.isArray(course.sessions) &&
                  course.sessions.length > 0 ? (
                    <ul className="space-y-1">
                      {course.sessions.map((s: any) => (
                        <li
                          key={s.id}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {sessionFormatter.format(new Date(s.startAt))} ·{" "}
                          {seatsText}: {s.availableSeats}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {noSessionsText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

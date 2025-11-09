import { getDictionary } from "@/lib/dictionaries";
import { getCoursesWithSessions, getSessionRegistrations } from "@/lib/queries";
import type { Metadata } from "next";
import { RegisterButton } from "@/components/register-button";
import { getServerSession } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);
  const coursesWithSessions = await getCoursesWithSessions();
  
  // Get user registrations if logged in
  let userRegistrations: string[] = [];
  if (session?.user) {
    const registrations = await Promise.all(
      coursesWithSessions.flatMap((course) =>
        course.sessions.map((s) => getSessionRegistrations(s.id))
      )
    );
    userRegistrations = registrations
      .flat()
      .filter((r) => r.userId === (session.user as any).id)
      .map((r) => r.sessionId);
  }

  const allSessions = coursesWithSessions.flatMap((course) =>
    course.sessions.map((session) => ({
      ...session,
      course,
    }))
  );

  allSessions.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.nav.calendar}</h1>
      {allSessions.length === 0 ? (
        <p className="text-lg">{locale === "no" ? "Ingen kommende kurs" : "No upcoming courses"}</p>
      ) : (
        <div className="space-y-4">
          {allSessions.map((session) => {
            const courseTitle = session.course.title?.[locale] || session.course.title?.no || session.course.title?.en || "";
            
            return (
            <div key={session.id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">{courseTitle}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {new Date(session.startAt).toLocaleDateString(locale === "no" ? "nb-NO" : "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {locale === "no" ? "Steder ledig" : "Seats available"}: {session.availableSeats} / {session.seats}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{session.course.location}</p>
              <RegisterButton
                sessionId={session.id}
                availableSeats={session.availableSeats}
                isRegistered={userRegistrations.includes(session.id)}
              />
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


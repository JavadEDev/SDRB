import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRegistrations } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { CancelRegistrationButton } from "@/components/cancel-registration-button";
import Link from "next/link";

export default async function RegistrationsPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/signin");
  }

  const registrations = await getUserRegistrations((session.user as any).id);

  return (
    <div className="space-y-6">
      <div className="rounded-[calc(var(--radius)*2)] border bg-[var(--card-bg)] p-8 shadow-sm">
        <h1 className="text-3xl font-serif font-normal mb-6 text-[var(--card-text)]">
          My Courses
        </h1>
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--muted-text)] mb-6">No registered courses yet.</p>
            <Button asChild>
              <Link href="/no/kalender">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const course = reg.course;
              const session = reg.session;
              const title = course.title?.no || course.title?.en || "";

              return (
                <div
                  key={reg.registration.id}
                  className="border rounded-[var(--radius)] p-6 bg-[var(--bg)]"
                >
                  <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">{title}</h2>
                  <p className="text-sm text-[var(--muted-text)] mb-2">
                    {new Date(session.startAt).toLocaleDateString("nb-NO", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-[var(--muted-text)] mb-4">{course.location}</p>
                  <CancelRegistrationButton registrationId={reg.registration.id} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


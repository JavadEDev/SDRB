import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRegistrations } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/signin");
  }

  const registrations = await getUserRegistrations((session.user as any).id);

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const userFirstName = (session.user as any)?.firstName || "";
  const userLastName = (session.user as any)?.lastName || "";
  const displayName = userFirstName && userLastName
    ? `${userFirstName} ${userLastName}`
    : userFirstName || userLastName || "User";

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="rounded-[calc(var(--radius)*2)] border bg-[var(--card-bg)] p-8 shadow-sm">
        <h2 className="text-3xl font-serif font-normal mb-6 text-[var(--card-text)]">Profile</h2>
        <div className="flex items-center gap-6">
          {(session.user as any)?.imageUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--input-border)]">
              <img
                src={(session.user as any).imageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center font-semibold text-xl">
              {getInitials(userFirstName, userLastName, session.user.email)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-[var(--card-text)] mb-1">
              {displayName}
            </h3>
            <p className="text-sm text-[var(--muted-text)]">
              {session.user.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      {/* Registered Courses Section */}
      <div className="rounded-[calc(var(--radius)*2)] border bg-[var(--card-bg)] p-8 shadow-sm">
        <h2 className="text-3xl font-serif font-normal mb-6 text-[var(--card-text)]">
          Registered Courses
        </h2>
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
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text)]">{title}</h3>
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
                  <p className="text-sm text-[var(--muted-text)]">{course.location}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

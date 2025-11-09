import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRegistrations } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { CancelRegistrationButton } from "@/components/cancel-registration-button";

export default async function RegistrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const registrations = await getUserRegistrations((session.user as any).id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">My Registrations</h1>
      {registrations.length === 0 ? (
        <p>You have no registrations yet.</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const course = reg.course;
            const session = reg.session;
            const title = course.title?.no || course.title?.en || "";

            return (
              <div key={reg.registration.id} className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {new Date(session.startAt).toLocaleDateString("nb-NO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {course.location}
                </p>
                <CancelRegistrationButton registrationId={reg.registration.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


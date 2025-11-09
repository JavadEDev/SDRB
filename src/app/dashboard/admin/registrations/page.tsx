import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllRegistrations } from "@/lib/queries";
import { DeleteRegistrationButton } from "@/components/admin/delete-registration-button";

export default async function AdminRegistrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  const registrations = await getAllRegistrations();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Registrations</h1>
      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const course = reg.course;
            const session = reg.session;
            const user = reg.user;
            const title = course.title?.no || course.title?.en || "";

            return (
              <div key={reg.registration.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      User: {user.name} ({user.email})
                    </p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registered: {new Date(reg.registration.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seats: {session.seats} | Available: {session.seats - (reg.registration as any).registrationsCount || 0}
                    </p>
                  </div>
                  <DeleteRegistrationButton registrationId={reg.registration.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


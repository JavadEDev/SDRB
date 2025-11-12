import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllRegistrations } from "@/lib/queries";
import { RegistrationsGrid } from "@/components/admin/registrations-grid";
import { DeleteRegistrationButton } from "@/components/admin/delete-registration-button";

export default async function AdminRegistrationsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  const registrations = await getAllRegistrations();

  const items = registrations.map((reg) => {
    const course = reg.course;
    const session = reg.session;
    const user = reg.user;
    return {
      id: reg.registration.id,
      courseTitle: course.title?.no || course.title?.en || "",
      category: (course.category || "").toString(),
      startAt: new Date(session.startAt).toISOString(),
      seats: session.seats,
      userName: (user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || ""),
      userEmail: user.email || "",
      createdAt: new Date(reg.registration.createdAt).toISOString(),
      approved: (reg.registration as any).approved === true,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Registrations</h1>
      <RegistrationsGrid items={items} />
    </div>
  );
}

import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/admin/courses">
          <Button variant="primary" className="w-full">
            Manage Courses
          </Button>
        </Link>
        <Link href="/dashboard/admin/gallery">
          <Button variant="primary" className="w-full">
            Manage Gallery
          </Button>
        </Link>
        <Link href="/dashboard/admin/registrations">
          <Button variant="primary" className="w-full">
            View Registrations
          </Button>
        </Link>
      </div>
    </div>
  );
}


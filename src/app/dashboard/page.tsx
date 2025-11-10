import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/signout-button";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        <p>Welcome, {session.user?.name || session.user?.email}!</p>
        <div className="flex gap-4">
          <Link href="/dashboard/registrations">
            <Button variant="primary">My Registrations</Button>
          </Link>
          {(session.user as any)?.role === "admin" && (
            <Link href="/dashboard/admin">
              <Button variant="secondary">Admin Panel</Button>
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}


import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const isAdmin = (session.user as any)?.role === "admin";

  return (
    <DashboardLayout user={session.user || {}} isAdmin={isAdmin}>
      {children}
    </DashboardLayout>
  );
}


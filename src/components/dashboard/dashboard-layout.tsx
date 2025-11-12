"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Home,
  Calendar,
  User,
  LogOut,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    image?: string | null;
    imageUrl?: string | null;
  };
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  user,
  isAdmin,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/dashboard/registrations", label: "My Courses", icon: Calendar },
    { path: "/dashboard/profile", label: "Profile", icon: User },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ path: "/dashboard/admin", label: "Admin", icon: User });
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleRefresh = () => {
    router.refresh();
  };

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

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || "User";

  const displayImage = (user as any).imageUrl || user.image;

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-[var(--muted-bg)]/30 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-serif font-normal text-[var(--text)]">
            Dashboard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                    : "text-[var(--text)]/70 hover:bg-[var(--muted-bg)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-[var(--text)]/70 hover:bg-[var(--muted-bg)] hover:text-[var(--text)] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
            <ArrowRight size={16} className="ml-auto" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-[var(--bg)] flex items-center justify-end px-6 gap-4">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-[var(--muted-bg)] transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={20} className="text-[var(--text)]/70" />
          </button>
          {displayImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--input-border)]">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center font-semibold">
              {getInitials(user.firstName, user.lastName, user.email)}
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

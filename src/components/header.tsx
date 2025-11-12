"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { type Dictionary } from "@/lib/dictionaries";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Shield,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  locale: "no" | "en";
  dict: Dictionary;
  currentPath: string;
}

export function Header({ locale, dict, currentPath }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const switchLocale = locale === "no" ? "en" : "no";

  // Remove current locale from path and add new locale
  const pathWithoutLocale = currentPath.replace(/^\/(no|en)/, "") || "/";
  const newPath = `/${switchLocale}${pathWithoutLocale}`;

  const isAdmin = (session?.user as any)?.role === "admin";
  const isAuthenticated = !!session;
  const avatarUrl = (session?.user as any)?.imageUrl as
    | string
    | undefined
    | null;
  const userFirstName = (session?.user as any)?.firstName || "";
  const userLastName = (session?.user as any)?.lastName || "";
  const userName =
    userFirstName && userLastName
    ? `${userFirstName} ${userLastName}`
    : userFirstName || userLastName || "";
  const userEmail = session?.user?.email || "";

  const getInitials = (
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null
  ) => {
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

  const navItems = [
    { path: `/${locale}`, label: dict.nav.home },
    { path: `/${locale}/galleri`, label: dict.nav.gallery },
    { path: `/${locale}/tjenester`, label: dict.nav.services },
    { path: `/${locale}/kurs`, label: dict.nav.courses },
    { path: `/${locale}/kalender`, label: dict.nav.calendar },
    { path: `/${locale}/om-oss`, label: dict.nav.about },
    { path: `/${locale}/kontakt`, label: dict.nav.contact },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-7xl border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="text-2xl font-serif font-normal">
          {dict.site.title}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm transition-colors hover:text-foreground/80 ${
                isActive(item.path)
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href={newPath}
            className="px-3 py-1 text-sm uppercase tracking-wide rounded-full border border-[var(--input-border)] hover:bg-[var(--muted-bg)]"
            aria-label={`Switch to ${switchLocale.toUpperCase()}`}
          >
            {switchLocale.toUpperCase()}
          </Link>
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-transparent text-[var(--text)] hover:bg-[var(--muted-bg)] transition-colors"
                aria-label="Open account menu"
                onClick={() => setProfileMenuOpen((v) => !v)}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--muted-bg)] text-[var(--text)] text-sm font-semibold">
                    {getInitials(userFirstName, userLastName, userEmail)}
                  </span>
                )}
                {profileMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-[var(--text)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--text)]" />
                )}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-[var(--input-border)] bg-[var(--bg)] shadow-lg z-50 overflow-hidden">
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--muted-bg)] transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>{locale === "no" ? "Dashboard" : "Dashboard"}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--muted-bg)] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        <span>{locale === "no" ? "Admin" : "Admin"}</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[var(--text)] hover:bg-[var(--muted-bg)] transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{locale === "no" ? "Logg ut" : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin">
              <Button size="sm">
                {locale === "no" ? "Logg inn" : "Login"}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm ${
                  isActive(item.path)
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Link
                href={newPath}
                className="px-3 py-1 text-sm uppercase tracking-wide rounded-full border border-[var(--input-border)] hover:bg-[var(--muted-bg)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {switchLocale.toUpperCase()}
              </Link>
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link href={isAdmin ? "/dashboard/admin" : "/dashboard"}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isAdmin ? "Admin" : "Dashboard"}
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    {locale === "no" ? "Logg ut" : "Logout"}
                  </Button>
                </>
              ) : (
                <Link href="/signin">
                  <Button size="sm" onClick={() => setMobileMenuOpen(false)}>
                    {locale === "no" ? "Logg inn" : "Login"}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

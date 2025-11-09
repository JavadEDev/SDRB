import Link from "next/link";
import { type Dictionary } from "@/lib/dictionaries";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  locale: "no" | "en";
  dict: Dictionary;
  currentPath: string;
}

export function Header({ locale, dict, currentPath }: HeaderProps) {
  const switchLocale = locale === "no" ? "en" : "no";
  
  // Remove current locale from path and add new locale
  const pathWithoutLocale = currentPath.replace(/^\/(no|en)/, "") || "/";
  const newPath = `/${switchLocale}${pathWithoutLocale}`;

  return (
    <header className="border-b">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href={`/${locale}`} className="text-xl font-bold">
            {dict.site.title}
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href={`/${locale}`} className="hover:underline">
              {dict.nav.home}
            </Link>
            <Link href={`/${locale}/om-oss`} className="hover:underline">
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/tjenester`} className="hover:underline">
              {dict.nav.services}
            </Link>
            <Link href={`/${locale}/kurs`} className="hover:underline">
              {dict.nav.courses}
            </Link>
            <Link href={`/${locale}/kalender`} className="hover:underline">
              {dict.nav.calendar}
            </Link>
            <Link href={`/${locale}/galleri`} className="hover:underline">
              {dict.nav.gallery}
            </Link>
            <Link href={`/${locale}/kontakt`} className="hover:underline">
              {dict.nav.contact}
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={newPath}
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={`Switch to ${switchLocale.toUpperCase()}`}
          >
            {switchLocale.toUpperCase()}
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}


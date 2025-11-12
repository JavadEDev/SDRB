import { getDictionary } from "@/lib/dictionaries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";
import { PageTransition } from "@/components/anim/page-transition";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || `/${locale}`;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <Header locale={locale} dict={dict} currentPath={pathname} />
      <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-16 md:py-24">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer dict={dict} />
    </div>
  );
}


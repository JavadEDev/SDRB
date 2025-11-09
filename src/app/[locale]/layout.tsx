import { getDictionary } from "@/lib/dictionaries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";

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
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} dict={dict} currentPath={pathname} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer dict={dict} />
    </div>
  );
}


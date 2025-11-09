import { type Dictionary } from "@/lib/dictionaries";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} {dict.site.title}
        </p>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          {dict.contact.address} | {dict.contact.phone} | {dict.contact.email}
        </p>
      </div>
    </footer>
  );
}


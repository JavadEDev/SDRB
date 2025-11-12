import { type Dictionary } from "@/lib/dictionaries";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="mt-auto border-t bg-[var(--popover-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid items-start gap-8 md:grid-cols-3">
          <div className="space-y-3 text-sm text-[var(--popover-text)]">
            <div className="text-xs uppercase tracking-[0.35em] text-[var(--muted-text)]">
              {dict.site.title}
            </div>
            <div className="font-serif text-2xl">
              {dict.contact.address}
            </div>
          </div>
          <div className="text-center text-sm text-[var(--popover-text)] md:text-base">
            © {new Date().getFullYear()} {dict.site.title}
          </div>
          <div className="text-sm text-[var(--popover-text)] md:text-right md:space-y-2">
            <div className="font-medium">{dict.contact.phone}</div>
            <div>{dict.contact.email}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}


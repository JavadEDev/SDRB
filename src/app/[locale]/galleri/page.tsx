import { getDictionary } from "@/lib/dictionaries";
import { getGalleryItems } from "@/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import { MDiv, MSection } from "@/components/anim/reveal";
import { GalleryModal } from "@/components/gallery/gallery-modal";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.gallery} - ${dict.site.title}`,
    description: dict.site.description,
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: "no" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const items = await getGalleryItems();

  return (
    <div className="space-y-10">
      <MSection
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <h1>{dict.nav.gallery}</h1>
        <p className="max-w-3xl text-[var(--muted-text)]">
          {locale === "no"
            ? "Utforsk håndplukkede prosjekter fra atelieret – fra redesign til spesialbestillinger og kunsthåndverk."
            : "Explore hand-picked projects from the studio—from redesign commissions to bespoke artful pieces."}
        </p>
      </MSection>
      {items.length === 0 ? (
        <div className="rounded-[calc(var(--radius)*2)] border bg-card p-12 text-center text-sm text-[var(--muted-text)]">
          {locale === "no" ? "Ingen bilder i galleriet" : "No items in gallery"}
        </div>
      ) : (
        <GalleryBrowser
          items={items.map((i) => ({
            id: i.id,
            title: i.title?.[locale] || i.title?.no || i.title?.en || "",
            description:
              i.description?.[locale] || i.description?.no || i.description?.en || "",
            imageUrl: i.imageUrl,
            category: i.category || "",
          }))}
          allLabel={locale === "no" ? "Alle" : "All"}
        />
      )}
    </div>
  );
}


import { getDictionary } from "@/lib/dictionaries";
import { getGalleryItems } from "@/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import { GalleryModal } from "@/components/gallery/gallery-modal";

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
    <div>
      <h1 className="text-4xl font-bold mb-6">{dict.nav.gallery}</h1>
      {items.length === 0 ? (
        <p className="text-lg">{locale === "no" ? "Ingen bilder i galleriet" : "No items in gallery"}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const title = item.title?.[locale] || item.title?.no || item.title?.en || "";
            const description = item.description?.[locale] || item.description?.no || item.description?.en || "";

            return (
              <GalleryModal
                key={item.id}
                item={{
                  id: item.id,
                  title,
                  description,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  category: item.category || "",
                }}
              >
                <div className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{title}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                    )}
                    {item.price && (
                      <p className="text-sm font-medium mt-2">{item.price} kr</p>
                    )}
                  </div>
                </div>
              </GalleryModal>
            );
          })}
        </div>
      )}
    </div>
  );
}


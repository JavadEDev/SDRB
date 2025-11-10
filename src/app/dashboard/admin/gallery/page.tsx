import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGalleryItems } from "@/lib/queries";
import { GalleryForm } from "@/components/admin/gallery-form";
import Image from "next/image";
import { EditGalleryForm } from "@/components/admin/edit-gallery-form";
import { DeleteGalleryButton } from "@/components/admin/delete-gallery-button";

export default async function AdminGalleryPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  const items = await getGalleryItems();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage Gallery</h1>
        <GalleryForm />
      </div>
      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No gallery items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => {
            const title = item.title?.no || item.title?.en || "";
            const description = item.description?.no || item.description?.en || "";

            return (
              <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col">
                <div className="relative aspect-square">
                  <Image
                    src={item.imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Category: {item.category}</p>
                    )}
                    {item.price && <p className="text-sm font-medium mt-1">{item.price} kr</p>}
                    {description && <p className="text-sm mt-2">{description}</p>}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <EditGalleryForm item={item} />
                    <DeleteGalleryButton itemId={item.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGalleryItems } from "@/lib/queries";
import { GalleryForm } from "@/components/admin/gallery-form";
import Image from "next/image";

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const title = item.title?.no || item.title?.en || "";

          return (
            <div key={item.id} className="border rounded-lg overflow-hidden">
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
                {item.price && <p className="text-sm font-medium mt-2">{item.price} kr</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


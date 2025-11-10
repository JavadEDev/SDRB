"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface EditGalleryFormProps {
  item: {
    id: string;
    title: { no?: string; en?: string };
    description?: { no?: string; en?: string } | null;
    imageUrl: string;
    price?: string | null;
    category?: string | null;
  };
}

export function EditGalleryForm({ item }: EditGalleryFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);
  const imageUrlInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await response.json();
      setUploadedUrl(data.file.url);
      if (imageUrlInputRef.current) {
        imageUrlInputRef.current.value = data.file.url;
      }
      notify.success("Image uploaded");
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error?.message || "Failed to upload image");
      notify.error(error?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: {
        no: formData.get("title_no") as string,
        en: formData.get("title_en") as string,
      },
      imageUrl: formData.get("image_url") as string,
      description:
        formData.get("description_no") || formData.get("description_en")
          ? {
              no: formData.get("description_no") as string,
              en: formData.get("description_en") as string,
            }
          : undefined,
      price: formData.get("price") ? String(formData.get("price")) : null,
      category: formData.get("category") ? (formData.get("category") as string) : null,
    };

    try {
      const response = await fetch(`/api/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.refresh();
        setIsOpen(false);
        setUploadError(null);
        setUploadedUrl(null);
        notify.success("Gallery item updated");
      } else {
        notify.error("Failed to update gallery item");
      }
    } catch (error) {
      console.error("Error updating gallery item:", error);
      notify.error("Failed to update gallery item");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Gallery Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title (Norwegian)</label>
            <input
              type="text"
              name="title_no"
              required
              defaultValue={item.title?.no || ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title (English)</label>
            <input
              type="text"
              name="title_en"
              required
              defaultValue={item.title?.en || ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image_url"
              required
              defaultValue={item.imageUrl}
              ref={imageUrlInputRef}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileUpload}
              className="w-full text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports JPG, PNG, WEBP, GIF up to 5MB. Uploaded files are stored in the project under `/public/uploads`.
            </p>
            {isUploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            {uploadedUrl && (
              <p className="text-xs text-green-600 mt-1">
                Uploaded! Image URL set to <span className="font-mono">{uploadedUrl}</span>
              </p>
            )}
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Norwegian)</label>
            <textarea
              name="description_no"
              rows={3}
              defaultValue={item.description?.no || ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (English)</label>
            <textarea
              name="description_en"
              rows={3}
              defaultValue={item.description?.en || ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={item.price ? String(item.price) : ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              defaultValue={item.category || ""}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



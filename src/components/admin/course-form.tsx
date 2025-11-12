"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function CourseForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [categorySelect, setCategorySelect] = React.useState<string>("");
  const [customCategory, setCustomCategory] = React.useState<string>("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const loadCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/courses", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const setUnique = Array.from(
        new Set<string>(
          (json.courses || [])
            .map((c: any) => (c.category || "").toString().trim())
            .filter((v: string) => v.length > 0)
        )
      );
      setCategories(setUnique);
    } catch {
      setCategories([]);
    }
  }, []);
  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, loadCategories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const selectedCategory = formData.get("category") as string;
    const categoryValue =
      selectedCategory === "__custom"
        ? (formData.get("category_custom") as string)?.trim() || ""
        : selectedCategory || "";
    const data = {
      title: {
        no: formData.get("title_no") as string,
        en: formData.get("title_en") as string,
      },
      slug: formData.get("slug") as string,
      description: {
        no: formData.get("description_no") as string,
        en: formData.get("description_en") as string,
      },
      price: formData.get("price") as string,
      location: formData.get("location") as string,
      category: categoryValue,
      active: true,
    };

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notify.success("Course created");
        router.refresh();
        setIsOpen(false);
        (e.target as HTMLFormElement).reset();
      } else {
        notify.error("Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      notify.error("Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Create Course
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title (Norwegian)</label>
            <input
              type="text"
              name="title_no"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title (English)</label>
            <input
              type="text"
              name="title_en"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Norwegian)</label>
            <textarea
              name="description_no"
              required
              rows={3}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (English)</label>
            <textarea
              name="description_en"
              required
              rows={3}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={categorySelect}
              onChange={(e) => {
                setCategorySelect(e.target.value);
                if (e.target.value !== "__custom") {
                  setCustomCategory("");
                }
              }}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom">+ Add new category…</option>
            </select>
            {categorySelect === "__custom" && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  New category
                </label>
                <input
                  type="text"
                  name="category_custom"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Course"}
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


"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
};

export function GalleryBrowser({
  items,
  allLabel = "All",
}: {
  items: GalleryItem[];
  allLabel?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(allLabel);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category && i.category.trim().length > 0) set.add(i.category);
    });
    return [allLabel, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items, allLabel]);

  const filteredItems =
    selectedCategory === allLabel
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "secondary"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {filteredItems.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
            className="group relative aspect-[3/4] overflow-hidden rounded-[calc(var(--radius)*2)] border bg-card text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="font-serif text-xl">{item.title}</p>
              {item.category && (
                <p className="text-xs opacity-90">{item.category}</p>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  {selectedItem.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius)]">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-4">
                  {selectedItem.category && (
                    <div>
                      <h4 className="mb-2 font-medium">Category</h4>
                      <p className="text-[var(--muted-text)]">
                        {selectedItem.category}
                      </p>
                    </div>
                  )}
                  {selectedItem.description && (
                    <div>
                      <h4 className="mb-2 font-medium">Description</h4>
                      <p className="text-[var(--muted-text)]">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



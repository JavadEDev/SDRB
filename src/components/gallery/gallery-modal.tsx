"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price?: string | null;
  category: string;
}

interface GalleryModalProps {
  item: GalleryItem;
  children: React.ReactNode;
}

export function GalleryModal({ item, children }: GalleryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-video">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  {item.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.category}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close modal"
                >
                  ✕
                </Button>
              </div>
              {item.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
              )}
              {item.price && (
                <p className="text-lg font-semibold">{item.price} kr</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


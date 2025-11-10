"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface DeleteGalleryButtonProps {
  itemId: string;
}

export function DeleteGalleryButton({ itemId }: DeleteGalleryButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this gallery item? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/gallery/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        notify.success("Gallery item deleted");
        router.refresh();
      } else {
        notify.error("Failed to delete gallery item");
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      notify.error("Failed to delete gallery item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}



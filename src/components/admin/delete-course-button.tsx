"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface DeleteCourseButtonProps {
  courseId: string;
}

export function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this course? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        notify.success("Course deleted");
        router.refresh();
      } else {
        notify.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      notify.error("Failed to delete course");
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



"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface DeleteRegistrationButtonProps {
  registrationId: string;
}

export function DeleteRegistrationButton({ registrationId }: DeleteRegistrationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete registration");
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}


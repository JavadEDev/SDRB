"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface CancelRegistrationButtonProps {
  registrationId: string;
}

export function CancelRegistrationButton({ registrationId }: CancelRegistrationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this registration?")) {
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
        alert("Failed to cancel registration");
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      alert("Failed to cancel registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleCancel}
      disabled={isLoading}
    >
      {isLoading ? "Canceling..." : "Cancel Registration"}
    </Button>
  );
}


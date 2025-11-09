"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RegisterButtonProps {
  sessionId: string;
  availableSeats: number;
  isRegistered?: boolean;
}

export function RegisterButton({ sessionId, availableSeats, isRegistered }: RegisterButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  if (status === "loading") {
    return <Button variant="secondary" disabled>Loading...</Button>;
  }

  if (!session) {
    return (
      <Button
        variant="primary"
        onClick={() => router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
      >
        Sign in to Register
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button variant="secondary" disabled>
        Already Registered
      </Button>
    );
  }

  if (availableSeats <= 0) {
    return (
      <Button variant="secondary" disabled>
        Full
      </Button>
    );
  }

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${sessionId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (response.ok) {
        alert("Successfully registered!");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="primary" onClick={handleRegister} disabled={isLoading}>
      {isLoading ? "Registering..." : "Register"}
    </Button>
  );
}


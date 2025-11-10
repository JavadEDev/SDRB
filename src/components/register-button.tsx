"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RegisterButtonProps {
  sessionId: string;
  availableSeats: number;
  isRegistered?: boolean;
  registrationId?: string;
  locale?: "no" | "en";
}

export function RegisterButton({
  sessionId,
  availableSeats,
  isRegistered,
  registrationId,
  locale = "en",
}: RegisterButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  if (status === "loading") {
    return <Button variant="secondary" disabled>Loading...</Button>;
  }

  if (!session) {
    return (
      <Button
        variant="primary"
        onClick={() =>
          router.push(
            `/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          )
        }
      >
        {locale === "no" ? "Logg inn for å melde deg på" : "Sign in to register"}
      </Button>
    );
  }

  if (availableSeats <= 0 && !isRegistered) {
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
        notify.success(locale === "no" ? "Påmelding vellykket!" : "Successfully registered!");
        router.refresh();
      } else {
        const error = await response.json();
        notify.error(error.error || (locale === "no" ? "Kunne ikke registrere" : "Failed to register"));
      }
    } catch (error) {
      console.error("Error registering:", error);
      notify.error(locale === "no" ? "Kunne ikke registrere" : "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!registrationId) return;
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        notify.success(locale === "no" ? "Avmelding gjennomført!" : "Registration cancelled!");
        router.refresh();
      } else {
        const error = await response.json();
        notify.error(error.error || (locale === "no" ? "Kunne ikke avmelde" : "Failed to cancel"));
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      notify.error(locale === "no" ? "Kunne ikke avmelde" : "Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isRegistered) {
    return (
      <Button
        variant="secondary"
        onClick={handleCancel}
        disabled={isCancelling || !registrationId}
      >
        {isCancelling
          ? locale === "no"
            ? "Avmelder..."
            : "Cancelling..."
          : locale === "no"
            ? "Avmeld"
            : "Cancel"}
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={handleRegister} disabled={isLoading}>
      {isLoading
        ? locale === "no"
          ? "Registrerer..."
          : "Registering..."
        : locale === "no"
          ? "Meld deg på"
          : "Register"}
    </Button>
  );
}


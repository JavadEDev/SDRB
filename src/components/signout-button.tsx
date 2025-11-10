"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 px-4 py-2 text-sm font-medium hover:opacity-90"
    >
      Sign out
    </button>
  );
}



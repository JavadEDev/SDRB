"use client";

import * as React from "react";
import { DeleteRegistrationButton } from "@/components/admin/delete-registration-button";

type RegistrationItem = {
  id: string;
  courseTitle: string;
  category?: string | null;
  startAt: string; // ISO
  seats: number;
  userName: string;
  userEmail: string;
  createdAt: string; // ISO
  approved?: boolean;
};

export function RegistrationsGrid({ items }: { items: RegistrationItem[] }) {
  const [category, setCategory] = React.useState<string>("all");
  const categories = React.useMemo(() => {
    return Array.from(
      new Set(
        (items || [])
          .map((i) => (i.category || "").toString().trim())
          .filter((v) => v.length > 0)
      )
    );
  }, [items]);

  const filtered =
    category === "all"
      ? items
      : items.filter((i) => (i.category || "").toString() === category);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <span className="text-sm text-[var(--muted-text)]">Category</span>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`rounded-full px-4 py-2 text-sm border ${
              category === "all"
                ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                : "bg-transparent text-[var(--text)]/70 hover:bg-[var(--muted-bg)]"
            }`}
            onClick={() => setCategory("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-2 text-sm border ${
                category === cat
                  ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                  : "bg-transparent text-[var(--text)]/70 hover:bg-[var(--muted-bg)]"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => {
            const start = new Date(reg.startAt);
            const created = new Date(reg.createdAt);
            return (
              <div key={reg.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {reg.courseTitle}
                    </h2>
                    {reg.category && (
                      <p className="text-xs font-medium opacity-80 mb-1">
                        Category: {reg.category}
                      </p>
                    )}
                    <p className="text-xs mb-1">
                      Status:{" "}
                      <span
                        className={
                          reg.approved ? "text-green-700" : "text-yellow-700"
                        }
                      >
                        {reg.approved ? "Approved" : "Pending"}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      User: {reg.userName} ({reg.userEmail})
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      {start.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registered: {created.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!reg.approved && (
                      <button
                        className="rounded-md border px-3 py-2 text-sm hover:bg-[var(--muted-bg)]"
                        onClick={async () => {
                          await fetch(`/api/registrations/${reg.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ approved: true }),
                          });
                          location.reload();
                        }}
                      >
                        Accept
                      </button>
                    )}
                    <DeleteRegistrationButton registrationId={reg.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

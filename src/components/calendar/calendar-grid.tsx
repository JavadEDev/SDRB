"use client";

import * as React from "react";
import { MDiv } from "@/components/anim/reveal";
import { RegisterButton } from "@/components/register-button";

type SessionItem = {
  id: string;
  startAt: string; // ISO string
  seats: number;
  availableSeats: number;
  location?: string | null;
  courseTitle: string;
  category?: string | null;
};

export function CalendarGrid({
  sessions,
  userRegistrationMap,
  locale,
}: {
  sessions: SessionItem[];
  userRegistrationMap: Record<string, string>;
  locale: "no" | "en";
}) {
  const [category, setCategory] = React.useState<string>("all");
  const categories = React.useMemo(() => {
    const setUnique = Array.from(
      new Set(
        (sessions || [])
          .map((s) => (s.category || "").toString().trim())
          .filter((v) => v.length > 0)
      )
    );
    return setUnique;
  }, [sessions]);

  const filtered =
    category === "all"
      ? sessions
      : sessions.filter((s) => (s.category || "").toString() === category);

  const localeTag = locale === "no" ? "nb-NO" : "en-GB";
  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(localeTag, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [localeTag]
  );
  const timeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(localeTag, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [localeTag]
  );
  const formatDate = React.useCallback(
    (d: Date) => {
      const parts = dateFormatter.formatToParts(d);
      const joined = parts
        .map((p) => {
          if (p.type === "literal") {
            // Normalize commas and direction marks to single spaces to avoid SSR/CSR punctuation mismatches
            return /,|\u200E|\u200F/.test(p.value) ? " " : p.value;
          }
          return p.value;
        })
        .join("");
      return joined.replace(/\s+/g, " ").trim();
    },
    [dateFormatter]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-[var(--muted-text)]">
          {locale === "no" ? "Kategori" : "Category"}
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`rounded-full px-4 py-2 text-sm border ${
              category === "all"
                ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                : "bg-transparent text-[var(--text)]/70 hover:bg-[var(--muted-bg)]"
            }`}
            onClick={() => setCategory("all")}
          >
            {locale === "no" ? "Alle" : "All"}
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

      <MDiv
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {filtered.map((session) => {
          const startDate = new Date(session.startAt);
          return (
            <MDiv
              key={session.id}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*2)] border bg-card p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-text)]">
                  {formatDate(startDate)} {locale === "no" ? "kl." : "at"}{" "}
                  {timeFormatter.format(startDate)}
                </p>
                <h2 className="font-serif text-2xl">{session.courseTitle}</h2>
                {session.category && (
                  <p className="text-xs font-medium opacity-80">
                    {locale === "no" ? "Kategori" : "Category"}:{" "}
                    {session.category}
                  </p>
                )}
                <p className="text-sm text-[var(--muted-text)]">
                  {locale === "no" ? "Ledige plasser" : "Seats available"}:{" "}
                  {session.availableSeats} / {session.seats}
                </p>
                {session.location && (
                  <p className="text-sm text-[var(--muted-text)]">
                    {session.location}
                  </p>
                )}
              </div>
              <RegisterButton
                sessionId={session.id}
                availableSeats={session.availableSeats}
                isRegistered={Boolean(userRegistrationMap[session.id])}
                registrationId={userRegistrationMap[session.id]}
                locale={locale}
              />
            </MDiv>
          );
        })}
      </MDiv>
    </div>
  );
}

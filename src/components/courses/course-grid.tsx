"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MDiv } from "@/components/anim/reveal";

type LocalizedText = { no: string; en: string };

export interface CourseWithSessions {
  id: string;
  title: LocalizedText;
  description?: LocalizedText | null;
  price?: string | number | null;
  location?: string | null;
  category?: string | null;
  sessions?: Array<{
    id: string;
    startAt: string | Date;
    availableSeats: number;
  }>;
}

interface CourseGridProps {
  courses: CourseWithSessions[];
  locale: "no" | "en";
  labels: {
    upcomingSessions: string;
    seats: string;
    noSessions: string;
    browseCta: string;
    categoriesTitle: string;
    categories: { key: string; label: string }[];
    allLabel?: string;
    calendarPath: string;
  };
}

export function CourseGrid({ courses, locale, labels }: CourseGridProps) {
  const [category, setCategory] = React.useState<string>("all");
  const df = React.useMemo(() => {
    const tag = locale === "no" ? "nb-NO" : "en-GB";
    return new Intl.DateTimeFormat(tag, { dateStyle: "medium", timeStyle: "short" });
  }, [locale]);

  const filtered = React.useMemo(() => {
    if (category === "all") return courses;
    return courses.filter((c) => (c.category || "").toLowerCase() === category);
  }, [courses, category]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-[var(--muted-text)]">{labels.categoriesTitle}</span>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`rounded-full px-4 py-2 text-sm border ${
              category === "all"
                ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                : "bg-transparent text-[var(--text)]/70 hover:bg-[var(--muted-bg)]"
            }`}
            onClick={() => setCategory("all")}
          >
            {labels.allLabel ?? "All"}
          </button>
          {labels.categories.map((cat) => (
            <button
              key={cat.key}
              className={`rounded-full px-4 py-2 text-sm border ${
                category === cat.key
                  ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                  : "bg-transparent text-[var(--text)]/70 hover:bg-[var(--muted-bg)]"
              }`}
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <MDiv
        className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {filtered.map((course) => {
          const title = course.title?.[locale] || course.title?.no || course.title?.en || "";
          const description =
            (course.description as any)?.[locale] ||
            (course.description as any)?.no ||
            (course.description as any)?.en ||
            "";
          return (
            <MDiv
              key={course.id}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*2)] border bg-card p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <h2 className="font-serif text-2xl">{title}</h2>
                {description && (
                  <p className="text-sm text-[var(--muted-text)]">{description}</p>
                )}
                {course.price && (
                  <p className="text-sm font-medium text-[var(--text)]">{course.price} kr</p>
                )}
                <div className="space-y-2 rounded-[calc(var(--radius)*1.5)] bg-[var(--muted-bg)]/40 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-text)]">
                    {labels.upcomingSessions}
                  </p>
                  {Array.isArray(course.sessions) && course.sessions.length > 0 ? (
                    <ul className="space-y-2">
                      {course.sessions.map((s) => (
                        <li key={s.id} className="text-sm text-[var(--muted-text)]">
                          {df.format(new Date(s.startAt))} · {labels.seats}: {s.availableSeats}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--muted-text)]">{labels.noSessions}</p>
                  )}
                </div>
              </div>
              <Button asChild variant="secondary" className="mt-6">
                <a href={labels.calendarPath}>{labels.browseCta}</a>
              </Button>
            </MDiv>
          );
        })}
      </MDiv>
    </div>
  );
}



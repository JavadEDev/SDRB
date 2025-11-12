"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

interface SessionFormProps {
  courseId: string;
}

export function SessionForm({ courseId }: SessionFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isListLoading, setIsListLoading] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState<string>("18:00");
  const [endTime, setEndTime] = React.useState<string>("20:00");
  const [seats, setSeats] = React.useState<number>(10);
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(
    null
  );
  const now = new Date();
  const startOfThisMonth = React.useMemo(() => {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [now]);
  const endOfNextYear = React.useMemo(() => {
    return new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999);
  }, [now]);

  function toLocalDateTimeString(date: Date | undefined, time: string): string {
    if (!date) return "";
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh || 0, mm || 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const loadSessions = React.useCallback(async () => {
    setIsListLoading(true);
    try {
      const res = await fetch("/api/courses", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load sessions");
      const json = await res.json();
      const course = (json.courses || []).find((c: any) => c.id === courseId);
      setSessions(course?.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setIsListLoading(false);
    }
  }, [courseId]);

  React.useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, loadSessions]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      start_at: toLocalDateTimeString(startDate, startTime),
      end_at: toLocalDateTimeString(endDate, endTime),
      seats,
    };

    try {
      const url = editingSessionId
        ? `/api/courses/sessions/${editingSessionId}`
        : `/api/courses/${courseId}/sessions`;
      const method = editingSessionId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notify.success(
          editingSessionId ? "Session updated" : "Session created"
        );
        router.refresh();
        await loadSessions();
        setIsOpen(false);
        // reset to defaults
        setStartDate(new Date());
        setEndDate(new Date());
        setStartTime("18:00");
        setEndTime("20:00");
        setSeats(10);
        setEditingSessionId(null);
      } else {
        notify.error(
          editingSessionId
            ? "Failed to update session"
            : "Failed to create session"
        );
      }
    } catch (error) {
      console.error("Error creating/updating session:", error);
      notify.error("Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (s: any) => {
    setEditingSessionId(s.id);
    const start = new Date(s.startAt);
    const end = new Date(s.endAt);
    setStartDate(start);
    setEndDate(end);
    const pad = (n: number) => String(n).padStart(2, "0");
    setStartTime(`${pad(start.getHours())}:${pad(start.getMinutes())}`);
    setEndTime(`${pad(end.getHours())}:${pad(end.getMinutes())}`);
    setSeats(s.seats);
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Delete this session?")) return;
    try {
      const res = await fetch(`/api/courses/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      notify.success("Session deleted");
      await loadSessions();
      router.refresh();
    } catch (e) {
      notify.error("Failed to delete session");
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Add Session
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[85vh] overflow-y-auto overflow-x-hidden">
        <h2 className="text-2xl font-bold mb-4">Create Session</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Existing Sessions</h3>
          {isListLoading ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No sessions
            </p>
          ) : (
            <ul className="space-y-2">
              {sessions.map((s) => {
                const d = new Date(s.startAt);
                return (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span>
                      {d.toLocaleString()} — seats {s.seats} (available{" "}
                      {s.availableSeats})
                    </span>
                    <span className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(s)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <div className="rounded-md border p-2 dark:border-gray-600 bg-white dark:bg-gray-700">
                {
                  // @ts-ignore
                  <Calendar
                    // @ts-ignore
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    // @ts-ignore
                    captionLayout="dropdown"
                    fromMonth={startOfThisMonth}
                    toMonth={endOfNextYear}
                    disabled={[{ before: startOfThisMonth }, { after: endOfNextYear }]}
                  />
                }
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <div className="rounded-md border p-2 dark:border-gray-600 bg-white dark:bg-gray-700">
                {
                  // @ts-ignore
                  <Calendar
                    // @ts-ignore
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    // @ts-ignore
                    captionLayout="dropdown"
                    fromMonth={startOfThisMonth}
                    toMonth={endOfNextYear}
                    disabled={[{ before: startOfThisMonth }, { after: endOfNextYear }]}
                  />
                }
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Seats</label>
            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value || "0", 10))}
              required
              min={1}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !startDate || !endDate}
            >
              {isLoading
                ? editingSessionId
                  ? "Updating..."
                  : "Creating..."
                : editingSessionId
                ? "Update Session"
                : "Create Session"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

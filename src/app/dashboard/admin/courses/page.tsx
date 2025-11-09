import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCoursesWithSessions } from "@/lib/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/course-form";
import { SessionForm } from "@/components/admin/session-form";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  const courses = await getCoursesWithSessions();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage Courses</h1>
        <CourseForm />
      </div>
      <div className="space-y-6">
        {courses.map((course) => {
          const title = course.title?.no || course.title?.en || "";

          return (
            <div key={course.id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {course.slug} | {course.location}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Sessions:</h3>
                {course.sessions.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No sessions</p>
                ) : (
                  <ul className="space-y-2">
                    {course.sessions.map((session) => (
                      <li key={session.id} className="text-sm">
                        {new Date(session.startAt).toLocaleString()} - {session.seats} seats
                        ({session.availableSeats} available)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <SessionForm courseId={course.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


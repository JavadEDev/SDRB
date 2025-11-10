import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCoursesWithSessions } from "@/lib/queries";
import { CourseForm } from "@/components/admin/course-form";
import { SessionForm } from "@/components/admin/session-form";
import { EditCourseForm } from "@/components/admin/edit-course-form";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";

export default async function AdminCoursesPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  if ((session.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  const courses = await getCoursesWithSessions(true);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage Courses</h1>
        <CourseForm />
      </div>
      {courses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No courses found.</p>
      ) : (
        <div className="space-y-6">
          {courses.map((course: any) => {
            const title = course.title?.no || course.title?.en || "";

            return (
              <div key={course.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.slug} | {course.location}
                    </p>
                    {course.category && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Category: {course.category}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Status: {course.active ? "Active" : "Inactive"}
                    </p>
                    {course.price && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Price: {course.price} kr</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <EditCourseForm course={course} />
                    <DeleteCourseButton courseId={course.id} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sessions:</h3>
                  {!course.sessions || course.sessions.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No sessions</p>
                  ) : (
                    <ul className="space-y-2">
                      {course.sessions.map((session: any) => (
                        <li key={session.id} className="text-sm">
                          {new Date(session.startAt).toLocaleString()} - {session.seats} seats (
                          {session.availableSeats} available)
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
      )}
    </div>
  );
}


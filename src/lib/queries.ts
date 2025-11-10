import { db } from "./db";
import { courses, courseSessions, registrations, galleryItems, users } from "@/drizzle/schema";
import { eq, and, gte, desc, sql, inArray } from "drizzle-orm";

// Course queries
export async function getCoursesWithSessions(includeInactive: boolean = false) {
  if (!db) {
    return [];
  }
  const allCourses = includeInactive
    ? await db.select().from(courses)
    : await db.select().from(courses).where(eq(courses.active, true));
  
  const allSessions = await db
    .select()
    .from(courseSessions)
    .where(gte(courseSessions.startAt, new Date()))
    .orderBy(courseSessions.startAt);

  // Get registration counts for each session
  const sessionIds = allSessions.map((s) => s.id);
  let registrationCounts: Array<{ sessionId: string; count: number }> = [];
  
  if (sessionIds.length > 0) {
    const counts = await db
      .select({
        sessionId: registrations.sessionId,
        count: sql<number>`count(*)::int`,
      })
      .from(registrations)
      .where(inArray(registrations.sessionId, sessionIds))
      .groupBy(registrations.sessionId);
    registrationCounts = counts;
  }

  const countMap = new Map(
    registrationCounts.map((r) => [r.sessionId, r.count])
  );

  // Combine courses with their sessions
  return allCourses.map((course) => ({
    ...course,
    sessions: allSessions
      .filter((s) => s.courseId === course.id)
      .map((session) => ({
        ...session,
        registrationsCount: countMap.get(session.id) || 0,
        availableSeats: session.seats - (countMap.get(session.id) || 0),
      })),
  }));
}

export async function createCourse(data: {
  title: { no: string; en: string };
  slug: string;
  description: { no: string; en: string };
  price?: string;
  location: string;
  category?: string;
  active?: boolean;
}) {
  if (!db) throw new Error("Database not initialized");
  return await db.insert(courses).values(data).returning();
}

export async function updateCourse(id: string, data: Partial<typeof courses.$inferInsert>) {
  if (!db) throw new Error("Database not initialized");
  return await db.update(courses).set(data).where(eq(courses.id, id)).returning();
}

export async function deleteCourse(id: string) {
  if (!db) throw new Error("Database not initialized");
  return await db.delete(courses).where(eq(courses.id, id));
}

// Course session queries
export async function createCourseSession(data: {
  courseId: string;
  startAt: Date;
  endAt: Date;
  seats: number;
}) {
  if (!db) throw new Error("Database not initialized");
  return await db.insert(courseSessions).values(data).returning();
}

export async function updateCourseSession(id: string, data: Partial<typeof courseSessions.$inferInsert>) {
  if (!db) throw new Error("Database not initialized");
  return await db.update(courseSessions).set(data).where(eq(courseSessions.id, id)).returning();
}

export async function deleteCourseSession(id: string) {
  if (!db) throw new Error("Database not initialized");
  return await db.delete(courseSessions).where(eq(courseSessions.id, id));
}

// Registration queries
export async function createRegistration(data: {
  userId: string;
  sessionId: string;
}) {
  if (!db) throw new Error("Database not initialized");
  return await db.insert(registrations).values(data).returning();
}

export async function getUserRegistrations(userId: string) {
  if (!db) return [];
  return await db
    .select({
      registration: registrations,
      session: courseSessions,
      course: courses,
    })
    .from(registrations)
    .innerJoin(courseSessions, eq(registrations.sessionId, courseSessions.id))
    .innerJoin(courses, eq(courseSessions.courseId, courses.id))
    .where(eq(registrations.userId, userId))
    .orderBy(desc(registrations.createdAt));
}

export async function deleteRegistration(id: string) {
  if (!db) throw new Error("Database not initialized");
  return await db.delete(registrations).where(eq(registrations.id, id));
}

export async function getAllRegistrations() {
  if (!db) return [];
  return await db
    .select({
      registration: registrations,
      user: users,
      session: courseSessions,
      course: courses,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(courseSessions, eq(registrations.sessionId, courseSessions.id))
    .innerJoin(courses, eq(courseSessions.courseId, courses.id))
    .orderBy(desc(registrations.createdAt));
}

export async function getSessionRegistrations(sessionId: string) {
  if (!db) return [];
  return await db
    .select()
    .from(registrations)
    .where(eq(registrations.sessionId, sessionId));
}

// Gallery queries
export async function getGalleryItems(category?: string) {
  if (!db) return [];
  const query = db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
  
  if (category) {
    return await query.where(eq(galleryItems.category, category));
  }
  
  return await query;
}

export async function createGalleryItem(data: {
  title: { no: string; en: string };
  imageUrl: string;
  description?: { no: string; en: string };
  price?: string;
  category?: string;
}) {
  if (!db) throw new Error("Database not initialized");
  return await db.insert(galleryItems).values(data).returning();
}

export async function updateGalleryItem(id: string, data: Partial<typeof galleryItems.$inferInsert>) {
  if (!db) throw new Error("Database not initialized");
  return await db.update(galleryItems).set(data).where(eq(galleryItems.id, id)).returning();
}

export async function deleteGalleryItem(id: string) {
  if (!db) throw new Error("Database not initialized");
  return await db.delete(galleryItems).where(eq(galleryItems.id, id));
}


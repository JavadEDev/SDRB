import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { createRegistration, getSessionRegistrations } from "@/lib/queries";
import { db } from "@/lib/db";
import { courseSessions } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authSession = await getSessionFromRequest(request);

    if (!authSession || !authSession.user || !(authSession.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get course session details
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }
    const courseSession = await db
      .select()
      .from(courseSessions)
      .where(eq(courseSessions.id, id))
      .limit(1);

    if (courseSession.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session is in the past
    if (new Date(courseSession[0].startAt) < new Date()) {
      return NextResponse.json(
        { error: "Cannot register for past sessions" },
        { status: 400 }
      );
    }

    // Check existing registrations
    const existingRegistrations = await getSessionRegistrations(id);
    const isAlreadyRegistered = existingRegistrations.some(
      (r) => r.userId === (authSession.user as any)?.id
    );

    if (isAlreadyRegistered) {
      return NextResponse.json(
        { error: "Already registered for this session" },
        { status: 409 }
      );
    }

    // Check capacity
    if (existingRegistrations.length >= courseSession[0].seats) {
      return NextResponse.json(
        { error: "Session is full" },
        { status: 409 }
      );
    }

    // Create registration
    const registration = await createRegistration({
      userId: (authSession.user as any)?.id,
      sessionId: id,
    });

    return NextResponse.json(registration[0], { status: 201 });
  } catch (error: any) {
    console.error("Error registering for session:", error);
    
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Already registered for this session" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


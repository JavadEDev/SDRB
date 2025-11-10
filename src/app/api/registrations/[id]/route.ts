import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { deleteRegistration } from "@/lib/queries";
import { db } from "@/lib/db";
import { registrations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session || !session.user || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get registration to check ownership
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }
    const registration = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id))
      .limit(1);

    if (registration.length === 0) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    if (registration[0].userId !== (session.user as any)?.id && (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own registrations" },
        { status: 403 }
      );
    }

    await deleteRegistration(id);

    return NextResponse.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


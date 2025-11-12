import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { saveImageFile } from "@/lib/uploads";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unable to determine user" },
        { status: 400 }
      );
    }

    const saved = await saveImageFile(file, { userId });

    // Persist new image URL immediately
    if (db) {
      try {
        await db
          .update(users)
          .set({ imageUrl: saved.url, imageFilename: saved.filename })
          .where(eq(users.id, userId));
      } catch (e) {
        console.error("Failed to persist image URL:", e);
      }
    }

    return NextResponse.json(
      {
        message: "Upload successful",
        file: saved,
        url: saved.url,
        filename: saved.filename,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

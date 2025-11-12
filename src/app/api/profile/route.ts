import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateProfileSchema = z.object({
  imageUrl: z
    .union([
      z.string(),
      z.null(),
      z.literal(""),
    ])
    .refine(
      (val) => {
        if (val === null || val === "") return true;
        if (typeof val === "string") {
          // Accept full URLs
          try {
            new URL(val);
            return true;
          } catch {
            // Accept relative paths starting with /
            return val.startsWith("/");
          }
        }
        return false;
      },
      { message: "Image URL must be a valid URL or relative path starting with /" }
    )
    .optional(),
  // Personal Information
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  // Address
  country: z.string().max(100).optional(),
  cityState: z.string().max(150).optional(),
  postalCode: z.string().max(50).optional(),
  taxId: z.string().max(100).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", issues }, { status: 422 });
    }

    const userId = (session.user as any).id;
    const updateData: {
      imageUrl?: string | null;
      imageFilename?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      bio?: string | null;
      country?: string | null;
      cityState?: string | null;
      postalCode?: string | null;
      taxId?: string | null;
    } = {};

    if (parsed.data.imageUrl !== undefined) {
      // Convert empty string to null
      const value = parsed.data.imageUrl === "" ? null : parsed.data.imageUrl;
      updateData.imageUrl = value;
      // Derive filename from URL/path when present
      if (value) {
        try {
          // If absolute URL, parse pathname
          const url = new URL(value, "http://dummy");
          const parts = url.pathname.split("/").filter(Boolean);
          updateData.imageFilename = parts.length > 0 ? parts[parts.length - 1] : null;
        } catch {
          // Fallback: treat as path string
          const parts = String(value).split("/").filter(Boolean);
          updateData.imageFilename = parts.length > 0 ? parts[parts.length - 1] : null;
        }
      } else {
        updateData.imageFilename = null;
      }
    }

    // Optional profile/address fields; empty strings normalized to null
    const normalize = (v: any) =>
      v === undefined ? undefined : (typeof v === "string" ? (v.trim() === "" ? null : v.trim()) : null);
    const fields = ["firstName", "lastName", "phone", "bio", "country", "cityState", "postalCode", "taxId"] as const;
    for (const key of fields) {
      const value = (parsed.data as any)[key];
      if (value !== undefined) {
        (updateData as any)[key] = normalize(value);
      }
    }

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: updated[0].id,
        email: updated[0].email,
        imageUrl: updated[0].imageUrl,
        imageFilename: (updated[0] as any).imageFilename ?? null,
        firstName: (updated[0] as any).firstName ?? null,
        lastName: (updated[0] as any).lastName ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


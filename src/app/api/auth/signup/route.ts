import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();

    const SignupSchema = z.object({
      firstName: z
        .string()
        .min(1, "First name is required")
        .max(100, "First name is too long"),
      lastName: z
        .string()
        .min(1, "Last name is required")
        .max(100, "Last name is too long"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must include an uppercase letter")
        .regex(/[a-z]/, "Password must include a lowercase letter")
        .regex(/[0-9]/, "Password must include a number")
        .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
      passwordConfirm: z.string(),
    }).refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Passwords do not match",
    });

    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", issues }, { status: 422 });
    }

    const { firstName, lastName, email, password } = parsed.data;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const created = await db
      .insert(users)
      .values({
        id,
        firstName,
        lastName,
        email,
        passwordHash,
        role: "user",
      })
      .returning();

    return NextResponse.json({ id: created[0].id, email: created[0].email }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



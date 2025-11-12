import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();

    const ForgotPasswordSchema = z.object({
      email: z.string().email("Invalid email address"),
    });

    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 422 }
      );
    }

    const { email } = parsed.data;

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    // In production, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with an expiration time
    // 3. Send an email with a reset link containing the token
    // 4. Create a reset password page that validates the token

    if (user.length > 0) {
      // TODO: Generate reset token and send email
      // const resetToken = crypto.randomUUID();
      // await db.update(users).set({ resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) }).where(eq(users.email, email));
      // await sendResetEmail(email, resetToken);
    }

    return NextResponse.json(
      { message: "If an account with that email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


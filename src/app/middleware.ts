import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale redirection
  if (!pathname.startsWith("/no") && !pathname.startsWith("/en") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLocale = acceptLanguage.includes("en") ? "en" : "no";
    return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = await auth();

    if (!session) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Protect admin routes
    if (pathname.startsWith("/dashboard/admin")) {
      if ((session.user as any)?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Store pathname for header component
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


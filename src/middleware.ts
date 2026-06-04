import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.get(ADMIN_AUTH_COOKIE)?.value === "true";

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin-login";

  if (isAdminRoute && !isAuthed) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin-login"],
};

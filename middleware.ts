import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  const isHomePage = request.nextUrl.pathname === "/";

  // If not logged in and trying to access protected pages
  if (!token && !isAuthPage && !isHomePage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and visiting auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/applicant/dashboard", request.url));
  }

  // If logged in and visiting home page
  if (token && isHomePage) {
    return NextResponse.redirect(new URL("/applicant/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/applicant/:path*",
    "/users/:path*",
    "/jobs/",
    "/candidates/:path*",
  ],
};
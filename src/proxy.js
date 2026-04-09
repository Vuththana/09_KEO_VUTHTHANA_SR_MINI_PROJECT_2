import { NextResponse } from "next/server";
import { auth } from "./auth";

export default async function proxy(req) {
  const session = await auth()
  const { nextUrl } = req;
  
  const isAuthenticated = !!session && !session?.user?.error;
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtectedRoute = !isAuthPage;
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/login", "/register"],
};

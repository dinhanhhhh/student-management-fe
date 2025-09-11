import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PATHS } from "@/lib/routes.ui";

type Role = "admin" | "teacher" | "student";
type MePayload = {
  user?: {
    uid: string;
    role: Role;
    username: string;
    studentRef?: string | null;
  };
};

function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  const protectedPrefixes = [
    PATHS.students,
    PATHS.classes,
    PATHS.subjects,
    PATHS.scores,
    PATHS.profile,
  ];
  const requireAuth = protectedPrefixes.some((p) => isUnder(pathname, p));
  if (!requireAuth) return NextResponse.next();

  // Hỏi BE xem user là ai
  let meRes: Response;
  try {
    meRes = await fetch(`${origin}/be/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    const loginUrl = new URL(PATHS.login, origin);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (meRes.status !== 200) {
    const loginUrl = new URL(PATHS.login, origin);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  let me: MePayload | null = null;
  try {
    me = (await meRes.json()) as MePayload;
  } catch {
    return NextResponse.next();
  }

  const role: Role | undefined = me?.user?.role;
  if (role === "student" && isUnder(pathname, PATHS.students)) {
    return NextResponse.redirect(new URL(PATHS.profile, origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/students/:path*",
    "/classes/:path*",
    "/subjects/:path*",
    "/scores/:path*",
    "/profile",
  ],
};

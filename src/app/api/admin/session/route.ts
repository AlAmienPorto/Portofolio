import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
  isAdminRequest,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** GET: is the current browser logged in? */
export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest(), configured: isAdminConfigured() });
}

/** POST { password }: log in and set the session cookie. */
export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Admin login is not configured (ADMIN_PASSWORD is missing)." },
      { status: 503 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ success: false, error: "Incorrect password. Try again." }, { status: 401 });
  }

  const { token, maxAge } = createSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
  return res;
}

/** DELETE: log out. */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}

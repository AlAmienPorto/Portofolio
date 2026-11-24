import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Server-only admin auth.
 * - The password lives in the ADMIN_PASSWORD env var (never shipped to the browser).
 * - After login the browser gets an httpOnly, signed session cookie.
 */

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  // Compare HMACs so the comparison is constant-time regardless of length.
  const key = "admin-password-check";
  const a = createHmac("sha256", key).update(input).digest("hex");
  const b = createHmac("sha256", key).update(expected).digest("hex");
  return safeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()!).update(payload).digest("hex");
}

export function createSessionToken(): { token: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

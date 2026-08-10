import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "@/lib/types";

/**
 * Session handling: short-lived signed JWT in an HTTP-only, SameSite=Lax cookie.
 * SameSite=Lax + POST-only mutations (server actions) gives CSRF-safe behaviour;
 * Next.js additionally enforces origin checks on server actions.
 */

const COOKIE_NAME = "osman_studio_session";
const SESSION_HOURS = 24 * 7;

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is not configured. Set a long random value in .env (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setSubject(user.id)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Osman",
      role:
        payload.role === "OWNER" || payload.role === "EDITOR" || payload.role === "READONLY"
          ? payload.role
          : "READONLY",
    };
  } catch {
    return null;
  }
}

/** Guard for every studio mutation and page. Throws when unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/** Editors and owners can write; read-only users cannot. */
export async function requireEditor(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role === "READONLY") throw new Error("FORBIDDEN");
  return user;
}

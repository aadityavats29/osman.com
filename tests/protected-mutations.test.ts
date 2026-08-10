/**
 * Protected-mutation tests: studio server actions must refuse unauthenticated
 * requests (redirect to login) and enforce the publish guard for ticketed
 * concerts without ticket links.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const REDIRECT = "NEXT_REDIRECT_TEST";

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`${REDIRECT}:${path}`);
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Session cookie store, controllable per test.
let cookieValue: string | undefined;
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "osman_studio_session" && cookieValue
        ? { name, value: cookieValue }
        : undefined,
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: async () => new Map(),
}));

process.env.AUTH_SECRET = "test-secret-test-secret-test-secret";

import { SignJWT } from "jose";
import { saveEventAction, deleteEventAction } from "@/server/actions/events";

async function signedInCookie(): Promise<string> {
  return new SignJWT({ email: "osman@example.com", name: "Osman", role: "OWNER" })
    .setSubject("test-user")
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
}

function eventFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const base: Record<string, string> = {
    eventType: "TICKETED_CONCERT",
    title: "Test concert",
    date: "2026-11-20",
    startTime: "20:00",
    venue: "Hall",
    city: "Amsterdam",
    country: "Netherlands",
    intent: "publish",
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  cookieValue = undefined;
});

describe("authorization", () => {
  it("rejects an unauthenticated save with a redirect to the login page", async () => {
    await expect(saveEventAction({}, eventFormData())).rejects.toThrow(
      `${REDIRECT}:/studio/login`
    );
  });

  it("rejects an unauthenticated delete with a redirect to the login page", async () => {
    const fd = new FormData();
    fd.set("id", "evt-demo-concert-1");
    fd.set("confirm", "true");
    await expect(deleteEventAction(fd)).rejects.toThrow(`${REDIRECT}:/studio/login`);
  });

  it("rejects a read-only user for mutations", async () => {
    cookieValue = await new SignJWT({
      email: "viewer@example.com",
      name: "Viewer",
      role: "READONLY",
    })
      .setSubject("viewer")
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
    await expect(saveEventAction({}, eventFormData())).rejects.toThrow(
      `${REDIRECT}:/studio/login`
    );
  });
});

describe("publish guard (authenticated)", () => {
  it("blocks publishing a ticketed concert without a ticket link and returns a warning", async () => {
    cookieValue = await signedInCookie();
    const state = await saveEventAction({}, eventFormData());
    expect(state.warning).toBeTruthy();
  });

  it("publishes after the warning is acknowledged", async () => {
    cookieValue = await signedInCookie();
    await expect(
      saveEventAction({}, eventFormData({ acknowledgeWarnings: "true" }))
    ).rejects.toThrow(`${REDIRECT}:/studio/events`);
  });

  it("saving as draft never triggers the warning", async () => {
    cookieValue = await signedInCookie();
    await expect(
      saveEventAction({}, eventFormData({ intent: "draft" }))
    ).rejects.toThrow(`${REDIRECT}:/studio/events`);
  });

  it("strips ticket links from free gigs on save", async () => {
    cookieValue = await signedInCookie();
    await expect(
      saveEventAction(
        {},
        eventFormData({
          eventType: "FREE_GIG",
          title: "Free gig ticket-strip test",
          ticketUrl: "https://example.com/should-be-stripped",
        })
      )
    ).rejects.toThrow(`${REDIRECT}:/studio/events`);

    const { getRepos } = await import("@/server/repositories");
    const events = await getRepos().events.list();
    const saved = events.find((e) => e.title === "Free gig ticket-strip test");
    expect(saved).toBeDefined();
    expect(saved?.ticketUrl).toBeNull();
  });
});

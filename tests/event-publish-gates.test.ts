import { describe, expect, it } from "vitest";
import { eventInput } from "@/lib/validation/schemas";

describe("event publish gates", () => {
  const base = {
    eventType: "TICKETED_CONCERT",
    title: "Demo: Night Session",
    date: "2026-10-18",
    startTime: "20:30",
    venue: "Night Session",
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "https://example.com/x.jpg",
    imageAlt: "Stage",
    imageCredit: "",
    status: "PUBLISHED",
  };
  it("blocks publishing with image but no credit", () => {
    const r = eventInput.safeParse(base);
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(JSON.stringify(r.error.issues)).toContain("photo credit");
    }
  });
  it("allows drafts without credit", () => {
    const r = eventInput.safeParse({ ...base, status: "DRAFT" });
    expect(r.success).toBe(true);
  });
});

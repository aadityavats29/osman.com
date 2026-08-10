import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";
import { contactInput, eventInput, isoDate, time24 } from "@/lib/validation/schemas";

describe("slug generation", () => {
  it("slugifies titles with accents and punctuation", () => {
    expect(slugify("Café de Ruimte — Solo bass & keys!")).toBe(
      "cafe-de-ruimte-solo-bass-keys"
    );
  });

  it("guarantees uniqueness against existing slugs", () => {
    const existing = new Set(["show", "show-2"]);
    expect(uniqueSlug("Show", existing)).toBe("show-3");
  });

  it("never returns an empty slug", () => {
    expect(slugify("???")).toBe("item");
  });
});

describe("input validation", () => {
  it("rejects impossible dates and malformed times", () => {
    expect(isoDate.safeParse("2026-02-30").success).toBe(false);
    expect(isoDate.safeParse("2026-11-05").success).toBe(true);
    expect(time24.safeParse("25:00").success).toBe(false);
    expect(time24.safeParse("20:30").success).toBe(true);
  });

  it("accepts a minimal valid event and applies defaults", () => {
    const parsed = eventInput.safeParse({
      eventType: "FREE_GIG",
      title: "Neighbourhood gig",
      date: "2026-09-12",
      startTime: "20:00",
      venue: "Café",
      city: "Amsterdam",
      country: "Netherlands",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe("DRAFT");
      expect(parsed.data.ticketUrl).toBeNull();
    }
  });

  it("rejects an event with an invalid ticket URL", () => {
    const parsed = eventInput.safeParse({
      eventType: "TICKETED_CONCERT",
      title: "Concert",
      date: "2026-09-12",
      startTime: "20:00",
      venue: "Hall",
      city: "Utrecht",
      country: "Netherlands",
      ticketUrl: "not-a-link",
    });
    expect(parsed.success).toBe(false);
  });

  it("contact honeypot rejects bot submissions at the schema level", () => {
    const bot = contactInput.safeParse({
      name: "Bot",
      email: "bot@example.com",
      inquiryType: "GENERAL",
      message: "Buy my product now please thanks",
      website: "https://spam.example",
    });
    expect(bot.success).toBe(false);
  });
});

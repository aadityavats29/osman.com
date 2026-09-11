/**
 * Approved-knowledge layer (AI-ready foundation §3–§7): the corpus a
 * future assistant would read must contain only published, ai-approved,
 * rights-clean content, preserve real billing on non-own releases, and
 * point every item at a real public URL.
 */
import { describe, expect, it } from "vitest";

import {
  getAllKnowledgeItems,
  getApprovedKnowledge,
  getKnowledgeByType,
} from "@/lib/knowledge/get-approved-knowledge";
import { eventToKnowledge, releaseToKnowledge } from "@/lib/knowledge/normalise-content";
import { demoReleases } from "@/data/demo/content";
import type { EventRecord } from "@/lib/types";

describe("approved knowledge corpus", () => {
  it("contains only published, aiApproved items", async () => {
    const corpus = await getApprovedKnowledge();
    expect(corpus.length).toBeGreaterThan(0);
    for (const item of corpus) {
      expect(item.status).toBe("PUBLISHED");
      expect(item.aiApproved).toBe(true);
    }
  });

  it("excludes draft releases that the site also hides", async () => {
    const draft = demoReleases.find((r) => r.status === "DRAFT");
    expect(draft).toBeDefined();
    const corpus = await getApprovedKnowledge();
    expect(corpus.find((i) => i.id === `release-${draft!.slug}`)).toBeUndefined();
  });

  it("never approves demo/fixture events for assistant use", async () => {
    const all = await getAllKnowledgeItems();
    const demoEvents = all.filter((i) => i.type === "EVENT" && i.id.includes("demo"));
    // Whatever demo fixtures exist, none may be aiApproved.
    for (const item of demoEvents) expect(item.aiApproved).toBe(false);
    const approved = await getApprovedKnowledge();
    for (const item of approved.filter((i) => i.type === "EVENT")) {
      expect(item.id.includes("demo")).toBe(false);
    }
  });

  it("keeps the real billing on appears-on and collaboration releases", async () => {
    const sparrow = demoReleases.find(
      (r) => r.relationshipType === "CONTRIBUTING_ARTIST" && r.status === "PUBLISHED"
    );
    expect(sparrow).toBeDefined();
    const item = releaseToKnowledge(sparrow!);
    expect(item.summary).toContain(sparrow!.primaryArtistName!);
    expect(item.summary).not.toMatch(/^A release by Osman Meyredi/);
  });

  it("gives every item a citable public URL (§7)", async () => {
    const corpus = await getApprovedKnowledge();
    for (const item of corpus) {
      expect(item.publicUrl.startsWith("/")).toBe(true);
    }
  });

  it("routes price and availability to contact instead of inventing them (§5)", async () => {
    const services = await getKnowledgeByType("SERVICE");
    expect(services.length).toBeGreaterThan(0);
    for (const service of services) {
      expect(service.priceGuidanceStatus).toBe("CONTACT_FOR_QUOTE");
      expect(service.availabilityPolicy).toBe("CONTACT_TEAM");
      expect(service.approvedPriceText).toBeUndefined();
    }
    const faqs = await getKnowledgeByType("FAQ");
    expect(faqs.length).toBeGreaterThan(0);
  });

  it("marks unpublished events as not ai-approved", () => {
    const draft: EventRecord = {
      id: "x",
      slug: "draft-gig",
      eventType: "FREE_GIG",
      title: "Draft gig",
      description: "",
      date: "2027-01-01",
      startTime: "20:00",
      endTime: null,
      venue: "V",
      address: null,
      city: "Amsterdam",
      country: "Netherlands",
      imageUrl: null,
      imageAlt: null,
      imageCredit: null,
      ticketUrl: null,
      venueUrl: null,
      priceText: null,
      collaborators: null,
      ticketingType: null,
      ctaLabel: null,
      timezone: "Europe/Amsterdam",
      isDemo: false,
      status: "DRAFT",
      eventState: "SCHEDULED",
      featured: false,
      publishedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    expect(eventToKnowledge(draft).aiApproved).toBe(false);
  });
});

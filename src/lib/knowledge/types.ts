/**
 * Approved-knowledge layer types (AI-ready foundation brief §3–§5).
 *
 * This is the normalized shape a future "Ask About Osman" assistant will
 * read — produced from the SAME Studio-managed repositories the website
 * renders from (§3: no second CMS). Nothing in this module talks to a
 * model, a vector store or any AI service (§1/§10).
 */

export type KnowledgeType =
  | "SERVICE"
  | "INSTRUMENT"
  | "REPERTOIRE"
  | "TECHNICAL_SETUP"
  | "AVAILABILITY_POLICY"
  | "PERFORMANCE_FORMAT"
  | "MUSIC"
  | "VIDEO"
  | "EVENT"
  | "FAQ"
  | "BOOKING";

/**
 * Safe price representation (§5): a future assistant may only repeat an
 * explicitly approved price text — it must never infer or invent one.
 */
export type PriceGuidanceStatus = "NOT_PUBLIC" | "CONTACT_FOR_QUOTE" | "APPROVED_RANGE";

/**
 * Safe availability representation (§5): today everything routes to the
 * contact page; CALENDAR_CONNECTED exists only for a possible future
 * integration and is not used anywhere yet.
 */
export type AvailabilityPolicy = "CONTACT_TEAM" | "CALENDAR_CONNECTED";

export type ApprovedKnowledgeItem = {
  id: string;
  type: KnowledgeType;
  title: string;
  /** One or two factual sentences in the approved site wording. */
  summary: string;
  /** Longer approved copy, where the source record carries one. */
  body?: string;
  /** Real public URL the item points back to (§7) — always citable. */
  publicUrl: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  /**
   * Whether the future assistant may use this item (§4). Public visibility
   * alone is NOT enough: rights-pending releases, demo fixtures and
   * anything unpublished are always false.
   */
  aiApproved: boolean;
  priceGuidanceStatus?: PriceGuidanceStatus;
  approvedPriceText?: string;
  availabilityPolicy?: AvailabilityPolicy;
  lastReviewedAt?: string;
  updatedAt: string;
};

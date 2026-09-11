/**
 * Future "Ask About Osman" assistant — policy (AI-ready foundation §8).
 *
 * DOCUMENTATION / CONFIGURATION ONLY. Nothing imports this at runtime
 * today; there is no assistant, no model call, no AI dependency anywhere
 * in this codebase (§1). When the assistant is eventually built, its
 * implementation must load this policy and honour every rule below —
 * changing a rule is a product decision for Osman/Jolene, not a code
 * convenience.
 */

export const ASSISTANT_POLICY = {
  /** Product name the feature was scoped under. */
  feature: "Ask About Osman",

  identity: {
    /** The assistant introduces itself as an information assistant. */
    isInformationAssistant: true,
    /** It must never speak as, or pretend to be, Osman (§2). */
    mayImpersonateOsman: false,
  },

  knowledge: {
    /**
     * Answers come ONLY from the approved corpus produced by
     * src/lib/knowledge/get-approved-knowledge.ts — published, ai-approved
     * items from the same Studio content the website renders (§3/§4).
     */
    allowedSource: "getApprovedKnowledge()",
    mayUseUnpublishedStudioRecords: false,
    mayUseArchivedOrDraftContent: false,
    mayUseDemoFixtures: false,
    /** No open-web browsing unless a future approved feature enables it (§8). */
    maySearchOpenWeb: false,
  },

  hardLimits: {
    /** Never invent prices; only repeat approvedPriceText when a knowledge
     *  item's priceGuidanceStatus is APPROVED_RANGE (§5). */
    mayInventPrices: false,
    /** Never confirm dates/availability — route to contact (§5). */
    mayConfirmAvailability: false,
    mayInventPersonalDetails: false,
    mayInventCredits: false,
    mayInventRepertoireOrEquipment: false,
    mayMakeContractualCommitments: false,
  },

  behaviour: {
    /** Uncertain or out-of-corpus questions route to the contact page. */
    uncertainQuestionsRouteTo: "/contact",
    /** Answers should link the visitor to the item's publicUrl (§7). */
    citeSourcePages: true,
    /** The goal is helping visitors find information and enquire (§2). */
    encourageEnquiriesVia: "/contact",
  },

  /**
   * Performance architecture the eventual implementation must follow (§9):
   * UI loaded only when opened; model called only on submitted questions;
   * the website never blocks on AI availability; small/low-cost model
   * where sufficient; safe repeated answers cached; a monthly spending
   * limit configured; contact form as the always-available fallback.
   */
  performance: {
    loadUiOnlyWhenOpened: true,
    callModelOnlyOnUserQuestion: true,
    siteIndependentOfAiAvailability: true,
    preferSmallModel: true,
    cacheSafeRepeatedAnswers: true,
    requireMonthlySpendLimit: true,
    fallback: "/contact",
  },
} as const;

export type AssistantPolicy = typeof ASSISTANT_POLICY;

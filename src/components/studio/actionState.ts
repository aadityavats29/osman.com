/**
 * Shared shape returned by every studio form action.
 * Lives outside the "use server" files so client components can import it freely.
 */
export interface ActionState {
  /** Field-level messages keyed by input name; "_form" holds form-level messages. */
  errors?: Record<string, string[]>;
  /** Raw submitted values so a failed submission re-renders with what was typed. */
  values?: Record<string, string>;
  /** Soft publish warning — shown as an amber panel with "Publish anyway". */
  warning?: string;
  /** Set after a successful save that stays on the same page (settings, services). */
  ok?: boolean;
}

export const initialActionState: ActionState = {};

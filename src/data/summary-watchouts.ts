/**
 * One-line "Watch out" reminders shown on the Summaries page, taken from the sections' Gotcha boxes.
 * Only gotchas whose lesson isn't already in the section's key points are listed here.
 */
export const WATCH_OUTS: Record<string, string[]> = {
  '1.2': ['Several agents on one tightly connected job (say, one code module) edit over each other and cost many times more. Use one agent for coupled work.'],
  '2.4': ['A 429 with no `retry-after` is usually a spend cap, not a busy moment: retrying never clears it, so alert someone instead.'],
  '2.5': ['A model alias (like a "latest" name) can move to a newer version without any change on your side, and outputs change with it. Pin the full model ID.'],
  '4.3': ['An uncalibrated LLM judge can reward the wrong thing, such as longer answers, so a "better" score can mean a worse product.'],
  '5.1': ['A big model on a simple, high-volume task (like ticket labelling) can cost more than the product earns. Test the smallest model first.'],
  '7.4': ['OAuth sign-in that works in staging can fail at go-live: each environment needs its own registered redirect URI.'],
};

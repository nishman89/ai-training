/** Site-wide constants and helpers. */

/** The real exam is scored 100-1,000 with 720 to pass; 72% is used as an approximate practice pass mark. */
export const PASS_MARK = 0.72;
export const MAIN_SET = 'A';

/** Approximate questions per domain in the 53-question exam, from the published domain weights. */
export const QUESTIONS_PER_CHAPTER: Record<number, number> = { 1: 18, 2: 9, 3: 7, 4: 6, 5: 5, 6: 4, 7: 2, 8: 2 };

/** The real exam: 53 questions in 120 minutes. */
export const EXAM_QUESTIONS = 53;
export const EXAM_MINUTES = 120;

/** Suggested minutes per question: about 2 min 15 s on average in the real exam. */
export const MINUTES_PER_K: Record<string, number> = { Recall: 1.5, Apply: 2.5 };

/** Prefix an internal path with the deployment base (e.g. /claude-developer-revision/ on GitHub Pages). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  const needsSlash = clean !== '' && !clean.includes('.') && !clean.includes('#') && !clean.endsWith('/');
  return `${base}/${clean}${needsSlash ? '/' : ''}`;
}

/** "20 min", "3 h", "2 h 10 min" */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

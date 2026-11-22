import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** One MDX page per CCDV-F exam domain. */
const chapters = defineCollection({
  loader: glob({ pattern: 'chapter-*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    number: z.number().int().min(1).max(8),
    /** Share of the exam, as a percentage of questions (CCDV-F exam guide). */
    weight: z.number(),
    title: z.string(),
    summary: z.string(),
    objectives: z.array(z.string()),
  }),
});

const block = z.discriminatedUnion('t', [
  z.object({ t: z.literal('p'), text: z.string() }),
  z.object({ t: z.literal('formula'), text: z.string() }),
  z.object({ t: z.literal('list'), items: z.array(z.object({ marker: z.string(), text: z.string(), sub: z.array(z.string()).optional() })) }),
  z.object({ t: z.literal('table'), rows: z.array(z.array(z.string())) }),
  z.object({ t: z.literal('box'), lines: z.array(z.string()) }),
  z.object({ t: z.literal('img'), src: z.string() }),
]);

const question = z
  .object({
    id: z.string(),
    exam: z.enum(['A', 'B', 'C', 'D']),
    n: z.number().int(),
    chapter: z.number().int().min(1).max(8),
    lo: z.string(),
    ref: z.string(),
    /** Recall = know the fact; Apply = use it in a scenario. */
    k: z.enum(['Recall', 'Apply']),
    select: z.union([z.literal(1), z.literal(2)]),
    blocks: z.array(block),
    options: z.array(z.object({ key: z.string(), text: z.string() })).min(4),
    answer: z.array(z.string()).min(1),
    explanation: z.object({ intro: z.string(), options: z.record(z.string()) }),
    /** The official Claude resource the question is based on. */
    source: z.object({ title: z.string(), url: z.string().url() }),
  })
  // Fail the build if the data is inconsistent, rather than showing a broken question.
  .refine((q) => q.answer.length === q.select, { message: 'answer count must match "select"' })
  .refine((q) => q.answer.every((a) => q.options.some((o) => o.key === a)), { message: 'answer is not an option' });

/** Practice question banks: set A (the main mock and domain quizzes) and sets B and D (mock exams 2a and 2b), set C (the quick mock). Written for this site, tagged by domain. */
const exams = defineCollection({
  loader: glob({ pattern: 'exam-*.json', base: './src/data/exams' }),
  schema: z.object({
    set: z.enum(['A', 'B', 'C', 'D']),
    version: z.string(),
    questions: z.array(question).min(1),
  }),
});

export type Question = z.infer<typeof question>;

export const collections = { chapters, exams };

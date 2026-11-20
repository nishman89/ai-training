import { getCollection } from 'astro:content';
import type { Question } from '../content.config';

/** All domains, in exam-guide order. */
export async function getChapters() {
  return (await getCollection('chapters')).sort((a, b) => a.data.number - b.data.number);
}

/** Questions from one sample exam set that target the given chapter. */
export async function getQuestions(set: string, chapter: number): Promise<Question[]> {
  const exams = await getCollection('exams');
  const exam = exams.find((e) => e.data.set === set);
  if (!exam) throw new Error(`Unknown exam set ${set}`);
  return exam.data.questions.filter((q) => q.chapter === chapter);
}

/** A whole sample exam set (all 40 questions), in paper order. */
export async function getExam(set: string) {
  const exams = await getCollection('exams');
  const exam = exams.find((e) => e.data.set === set);
  if (!exam) throw new Error(`Unknown exam set ${set}`);
  return exam.data;
}

/** A mock exam: the first N bank questions of each domain, N from QUESTIONS_PER_CHAPTER, in domain order. */
export async function getMockExam(perChapter: Record<number, number>): Promise<Question[]> {
  const exam = await getExam('A');
  return Object.entries(perChapter).flatMap(([ch, n]) => exam.questions.filter((q) => q.chapter === Number(ch)).slice(0, n));
}

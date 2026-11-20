/** Collects every <SectionSummary> (and the section's <Gotcha> titles) from the domain notes, for the Summaries page. */
import GithubSlugger from 'github-slugger';
import { getChapters } from './data';

export interface SectionSummaryEntry { number: string; title: string; slug: string; points: string[]; gotchas: string[]; }
export interface DomainSummary { number: number; title: string; weight: number; sections: SectionSummaryEntry[]; }

export async function getSummaries(): Promise<DomainSummary[]> {
  const out: DomainSummary[] = [];
  for (const { data, body = '' } of await getChapters()) {
    const slugger = new GithubSlugger(); // same slugs Astro gives the headings, in page order
    const slugs = new Map<number, string>();
    for (const m of body.matchAll(/^(#{2,3}) (.+)$/gm)) slugs.set(m.index!, slugger.slug(m[2].trim()));
    const heads = [...body.matchAll(/^## (\d+\.\d+) (.+)$/gm)];
    const sections = heads.map((h, i) => {
      const text = body.slice(h.index!, heads[i + 1]?.index ?? body.length);
      const pts = text.match(/<SectionSummary points=\{\[([\s\S]*?)\]\} \/>/);
      const points: string[] = pts ? JSON.parse(`[${pts[1].trim().replace(/,$/, '')}]`) : [];
      const gotchas = [...text.matchAll(/<Gotcha\s+title=\{("(?:[^"\\]|\\.)*")\}/g)].map((g) => JSON.parse(g[1]) as string);
      return { number: h[1], title: h[2].trim(), slug: slugs.get(h.index!) ?? '', points, gotchas };
    });
    out.push({ number: data.number, title: data.title, weight: data.weight, sections });
  }
  return out;
}

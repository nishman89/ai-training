/** Collects every <SectionSummary> (and the section's <Gotcha> titles) from the domain notes, for the Summaries page. */
import GithubSlugger from 'github-slugger';
import { getChapters } from './data';
import { anchor } from './anchors';

export interface Link { title: string; id: string; }
export interface SectionSummaryEntry { number: string; title: string; slug: string; points: string[]; gotchas: string[]; gotchaLinks: Link[]; code: Link[]; }
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
      const gotchaLinks = gotchas.map((g) => ({ title: g, id: anchor('gotcha', g) }));
      const code = [
        ...[...text.matchAll(/<CodeSwitch title="([^"]+)">/g)].map((c) => ({ i: c.index!, title: c[1], id: anchor('code', c[1]) })),
        ...[...text.matchAll(/<div class="config-example" id="([^"]+)" data-title="([^"]+)">/g)].map((c) => ({ i: c.index!, title: c[2], id: c[1] })),
      ].sort((a, b) => a.i - b.i).map(({ title, id }) => ({ title, id }));
      return { number: h[1], title: h[2].trim(), slug: slugs.get(h.index!) ?? '', points, gotchas, gotchaLinks, code };
    });
    out.push({ number: data.number, title: data.title, weight: data.weight, sections });
  }
  return out;
}

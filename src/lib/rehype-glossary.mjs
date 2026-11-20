/**
 * Rehype plugin: links the first use of each glossary term in every ## section of the notes to the Glossary page.
 * Hovering or focusing the term shows its plain-English definition (CSS tooltip from data-def).
 * Runs after rehype-collapsible-sections, so each section is a <details class="chapter-section">.
 * Skips code, links, headings, summaries, diagrams and buttons; all-caps terms (MCP, RAG, PII…) must match case.
 */
import { GLOSSARY, slugOf } from '../data/glossary.mjs';

const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const SKIP = new Set(['pre', 'code', 'a', 'h1', 'h2', 'h3', 'h4', 'summary', 'svg', 'figure', 'button', 'script', 'style', 'kbd']);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const phrases = GLOSSARY.flatMap((g) => g.match.map((m) => ({ m, g })))
  .sort((a, b) => b.m.length - a.m.length);
const lookup = new Map(phrases.map((p) => [p.m.toLowerCase(), p]));
const RE = new RegExp(`(?<![\\w-])(${phrases.map((p) => esc(p.m)).join('|')})(?![\\w-])`, 'gi');

function linkText(value, seen) {
  const out = [];
  let last = 0;
  for (const m of value.matchAll(RE)) {
    const hit = lookup.get(m[1].toLowerCase());
    if (!hit) continue;
    if (hit.m === hit.m.toUpperCase() && /[A-Z]/.test(hit.m) && m[1] !== hit.m) continue; // acronyms: exact case only
    if (seen.has(hit.g.term)) continue;
    seen.add(hit.g.term);
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push({
      type: 'element', tagName: 'a',
      properties: { className: ['gl'], href: `${BASE}glossary/#${slugOf(hit.g.term)}`, dataDef: `${hit.g.term}: ${hit.g.def}` },
      children: [{ type: 'text', value: m[1] }],
    });
    last = m.index + m[1].length;
  }
  if (!out.length) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node, seen) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      const linked = linkText(child.value, seen);
      if (linked) { next.push(...linked); continue; }
    } else if (child.type === 'element') {
      const cls = child.properties?.className ?? [];
      if (!SKIP.has(child.tagName) && !cls.includes('eyebrow')) walk(child, seen);
    } else if (child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') {
      walk(child, seen); // markdown written inside a component (e.g. Picture it) is prose too
    }
    next.push(child);
  }
  node.children = next;
}

export default function glossary() {
  return (tree) => {
    for (const section of tree.children) {
      if (section.type !== 'element' || section.tagName !== 'details') continue;
      walk(section.children[1], new Set());
    }
  };
}

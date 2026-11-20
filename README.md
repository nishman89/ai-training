# Sparta Global – Claude Developer (CCDV-F) Revision Site

Revision notes and practice questions for the **Claude Certified Developer – Foundations (CCDV-F)** exam, built with the
same engine and Sparta theme as the [ISTQB revision site](https://nishman89.github.io/istqb-revision/).

**Live site:** `https://nishman89.github.io/ai-training/` (once GitHub Pages is enabled, see below).

> Independent study material. Not affiliated with or endorsed by Anthropic. The practice questions are original and are
> not taken from the real exam. Model names, prices and limits change often: check the
> [Claude Platform docs](https://platform.claude.com/docs) before relying on a figure.

## What's on the site

| Page | What it does |
|---|---|
| **Home** | The eight exam domains as cards (weight, ≈ exam questions, progress), a "continue where you left off" link, Summaries and the mock exam |
| **Start here** | Claude for engineers: what's different about an LLM, a concept map onto Java / test automation / data engineering, the exam at a glance and a first API call |
| **Domains 1–8** | Collapsible notes for each domain: a plain-English summary first, then the detail, diagrams, exercises, "Watch out for…" traps and links to the official docs |
| **Summaries** | Every section summary on one page, grouped by domain, with links into the notes and to each section's Gotcha |
| **Domain quizzes** | 5–18 original questions per domain, every option explained, each linked (📚) to the official Claude doc or Anthropic article it's based on |
| **Mock exam** | 53 questions weighted like the real exam, timed (120 min), scored by domain, each with its 📚 source link |

Every code example has a **Java / Python** switch. The choice is saved in the browser and applies across pages.

### The exam

53 multiple-choice and multiple-response questions · 120 minutes · scaled score 100–1,000, 720 to pass. Source: the official
[CCDV-F exam guide v1.0](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542875/Claude+Certified+Developer+%E2%80%93+Foundations+Exam+Guide.pdf)
(effective July 2026, applies to exams up to 6 December 2026). From 7 December 2026 the exam follows
[guide v1.1](https://cc.sj-cdn.net/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1794946771/Claude_Certified_Developer_-_Foundations_Exam_Guide_Updated_Dec_7.pdf)
(70 questions, new weights); this site follows v1.0.

| # | Domain (official exam-guide v1.0 numbering) | Weight | ≈ Questions in mock |
|---|---|---|---|
| 1 | Agents and Workflows | 14.7% | 8 |
| 2 | Applications and Integration | 33.1% | 18 |
| 3 | Claude Code | 3.1% | 2 |
| 4 | Eval, Testing, and Debugging | 2.6% | 1 |
| 5 | Model Selection and Optimization | 16.8% | 9 |
| 6 | Prompt and Context Engineering | 11.0% | 6 |
| 7 | Security and Safety | 8.1% | 4 |
| 8 | Tools and MCPs | 10.6% | 5 |

## Running it

```bash
npm install
npm run dev       # http://localhost:4321 with live reload
npm run build     # type + content checks, then build to dist/
npm run preview   # serve dist/ as it will be published
```

Needs Node 20 or later.

## Publishing on GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. One-off setup: in the repository go to
**Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. The workflow sets the base path from
the repository name, so the site is served at `https://<owner>.github.io/<repo>/`.

All internal links go through `url()` in `src/lib/site.ts` so they work under that sub-path.

## Updating the content

| I want to… | Edit |
|---|---|
| Change a domain's notes | `src/content/chapters/chapter-N.mdx` |
| Change a domain's title, weight, summary or objectives | The frontmatter at the top of that file |
| Add, fix or remove a quiz question | `src/data/exams/exam-a.json` (schema below) |
| Change the "Watch out for…" traps | `src/data/traps.ts` |
| Change the official skills, their weights, coverage notes or Academy chapters shown on each domain | `src/data/blueprint.ts` |
| Change the Start here page | `src/pages/introduction.astro` |
| Change questions per domain in the mock | `QUESTIONS_PER_CHAPTER` in `src/lib/site.ts` |
| Change the pass mark | `PASS_MARK` in `src/lib/site.ts` (0.72 ≈ the real 720/1,000) |

### Notes: headings

```mdx
## 2.3 Prompt caching          ← a section: dark collapsible bar, ticked off for progress
### How it works               ← a topic inside it, listed in the side menu
```

### Notes: Java, Python and TypeScript code

Wrap one `java`, one `python` and one `typescript` fence in `<CodeSwitch>` (blank lines around the fences matter in MDX):

````mdx
<CodeSwitch title="Optional caption">

```java
Message msg = client.messages().create(params);
```

```python
msg = client.messages.create(**params)
```

</CodeSwitch>
````

### Notes: building blocks

Lists in the form `- **Title** - description · second line` become cards automatically. Reusable components
(import them at the top of the MDX file):

| Component | Use for |
|---|---|
| `Flow`, `Cycle`, `Tiles`, `Hub`, `Compare` (in `components/diagrams/`) | Diagrams from data: steps, loops, grids, a hub, side-by-side columns |
| `VsPair`, `SideBySide` | Two contrasting ideas |
| `MythReality` | Misconception → truth rows |
| `WhenThen` | "When this happens → do this" rows |
| `Exercise` | A question in the notes with a hidden answer (`<div slot="answer">`) |
| `Resource` | A link card to official docs |
| `CodeSwitch` | Java / Python code example |
| `Gotcha` | A real-world trap at the end of a section: `title`, `scenario`, `gotcha` (what goes wrong), `fix` |
| `SectionSummary` | The key points at the end of every section: `points={[ ... ]}` |
| `PictureIt` | A real-life walk-through inside a topic: the actual code, request/response JSON and log lines (Markdown and `CodeSwitch` inside) |

`Gotcha` and `SectionSummary` can be written anywhere in a section: the section plugin moves them to the end of
the section, outside the collapsible topics, gotchas first. Pass text containing quotes as expressions, e.g.
``scenario={"He said \"hi\""}``; backticks inside the text become inline code.

### Quiz questions

Each question in `src/data/exams/exam-a.json`:

```jsonc
{
  "id": "a-12", "exam": "A", "n": 12,
  "chapter": 1,                       // the domain, 1-8
  "lo": "Interpret stop_reason",      // learning objective, shown under the review
  "ref": "1.1 Response",              // shown as a pill on the question
  "k": "Apply",                       // "Recall" or "Apply"
  "select": 1,                        // 1, or 2 for "Select TWO"
  "blocks": [{ "t": "p", "text": "Question text" }],
  "options": [{ "key": "a", "text": "…" }, { "key": "b", "text": "…" }, { "key": "c", "text": "…" }, { "key": "d", "text": "…" }],
  "answer": ["b"],
  "explanation": { "intro": "Why the answer is right", "options": { "a": "Why a is wrong", "b": "Correct." } },
  "source": { "title": "Stop reasons", "url": "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons" }
}
```

`source` is required: the official Claude doc (platform.claude.com, code.claude.com) or Anthropic article the question is based on. It shows as a 📚 link on the question and in its review. `npm run build` fails if a question is inconsistent (wrong number of answers, an answer that isn't an option, fewer
than four options, no source). The mock exam takes the **first** N questions of each domain, in file order, where N comes from
`QUESTIONS_PER_CHAPTER`, so put your strongest questions first.

## Testing hooks

As on the ISTQB site, interactive elements carry stable `data-testid`, `id` and `name` attributes (for example
`take-quiz-1`, `submit-answers`, `question-3-option-b`, `code-tab-python`), so the site doubles as a target for
automated-testing practice.

## Credits

Built on the Sparta Global ISTQB revision site's Astro engine. Content is based on the official CCDV-F exam guide and the
Claude Platform and Claude Code documentation.

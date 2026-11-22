/**
 * Exam tips from the course's "Developer Foundation: essential knowledge, practical tips" deck, restructured.
 * Wording is tidied; anything the deck got wrong or out of date against current Anthropic docs is marked `updated`.
 * `read` lists the sections of the notes that explain each card.
 */
export interface Tip { text: string; sub?: string[]; }
export interface TipCard {
  id: string; icon: string; title: string; question?: string;
  tips: Tip[];
  table?: { head: string[]; rows: string[][] };
  updated?: string[];
  read: string[];
}

export const TIP_CARDS: TipCard[] = [
  {
    id: 'study', icon: '📚', title: 'How to study',
    tips: [
      { text: 'Concentrate on the five Claude modules of the course:', sub: ['MSO Foundations', 'Production-Grade Prompting, Agents & Tool Use', 'Claude Code, MCP & Integration', 'Production Engineering, Evals & Security', 'Accelerators & IP Contribution'] },
      { text: 'Use the prerequisites for reference, not as the main study material.' },
      { text: 'Read the summary at the end of each learning page. (This site has them all on one page: Summaries.)' },
      { text: 'Do a practice paper early, to find your weak areas while there is time to fix them. The deck suggests "Claude Certified Developer - Foundations [Mock Exams 2026]" on Udemy Business. It is unofficial, so check any surprising answer against the docs.' },
    ],
    updated: ['The only official practice items are the three sample questions in the exam guide (see the Mock exam page).'],
    read: [],
  },
  {
    id: 'models', icon: '🧠', title: 'The models', question: 'What are the different models?',
    tips: [
      { text: 'From most to least capable: **Fable** (deepest thinking, most expensive) → **Opus** → **Sonnet** → **Haiku** (fastest and cheapest).' },
      { text: '**Move up** a tier if the task needs deeper thinking. **Move down** if the job is simpler and quality is not compromised.' },
      { text: 'Current models tune their own thinking automatically (adaptive thinking); you steer it with the effort setting.' },
      { text: '**Triage** (routing): use Haiku to classify requests, and send only the hard cases to a bigger model.' },
    ],
    updated: ['The deck calls Sonnet "the default, start here". Anthropic\'s current guidance offers two starting points: Opus 5.5 (capability-first) or Haiku 5.5 (efficiency-first). Adjust effort before switching model, and move only on measured test results.'],
    read: ['5.1', '5.2', '1.2'],
  },
  {
    id: 'ways', icon: '🧭', title: 'Ways of using Claude', question: 'What are the different ways of using Claude, and how do you choose?',
    tips: [{ text: '**How to decide:** the use case, the customer\'s current cloud provider, data residency rules (where data may be stored and processed), and access control.' }],
    table: {
      head: ['Way', 'What it is', 'Good to know'],
      rows: [
        ['Apps for people', 'Claude.ai web chat; Claude Desktop', 'Desktop can connect to local tools through MCP'],
        ['Claude Code', 'Agentic coding tool: terminal, VS Code and JetBrains extensions, desktop app and web', 'Can run headless (no interactive screen), e.g. in CI/CD pipelines'],
        ['Building your own app', 'The Claude Messages API, called directly or through an official SDK', 'Stateless request–response: your code manages everything, including history'],
        ['Claude Agent SDK', 'A library that runs the agent loop for you', 'Handles the loop, built-in tools, context compaction and spawning subagents'],
        ['Claude Managed Agents', 'Anthropic runs the whole agent on its servers', 'Least to operate; sessions are stored server-side'],
        ['Through a cloud provider', 'Amazon Bedrock (AWS), Google Cloud Vertex AI, Microsoft Foundry (Azure)', 'Chosen when the customer already uses that cloud, or for residency'],
        ['Inside other products', 'Chrome extension, Slack, Excel, PowerPoint', 'Claude where people already work'],
      ],
    },
    read: ['2.1', '2.5', '1.4', '3.1'],
  },
  {
    id: 'evals', icon: '✅', title: 'Evaluating model output', question: 'How can we evaluate model output?',
    tips: [
      { text: 'Output is **not deterministic**: test **properties** (valid JSON, right category, under 80 words), not exact strings or keywords.' },
      { text: 'Ask **another model to judge** the output against set criteria (an LLM judge with a rubric), after checking it agrees with humans.' },
      { text: 'Use **evals**: tweak the prompt until the quality bar is reached.' },
      { text: '**Keep the evals** and run them regularly to see whether quality degrades over time.' },
      { text: 'Re-use them to test the **next model or code upgrade** before it ships.' },
      { text: 'Keep the code, the model version used and the evals in **source control**, with version tags.' },
    ],
    read: ['4.1', '4.2', '4.3'],
  },
  {
    id: 'request', icon: '📨', title: 'The three required request fields', question: 'Which THREE fields are required in every Messages API request body?',
    tips: [
      { text: 'Every request body must contain exactly these three: **`model`**, **`max_tokens`** and **`messages`**. Leave one out and the API returns **400 invalid_request_error**.' },
      { text: 'Everything else is optional, including `system`. Common distractors in the exam:', sub: ['`system`: optional; it is a top-level field, not a message with role "system"', '`temperature`: optional, and rejected on Opus 5.5 / Sonnet 5.5 if not the default', '`stream`, `tools`, `stop_sequences`: all optional', '`anthropic-version` and `x-api-key`: required, but they are **headers**, not body fields'] },
      { text: 'Smallest valid body: `{"model": "claude-sonnet-5-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello"}]}`' },
    ],
    table: { head: ['Field', 'What it is'], rows: [
      ['`model`', 'Which Claude to use: the exact model ID'],
      ['`max_tokens`', 'The most tokens Claude may write in its reply. It is a hard cut-off, not a target'],
      ['`messages`', 'The conversation so far: a list of user/assistant turns, starting with a user turn'],
    ] },
    read: ['2.1', '2.2'],
  },
  {
    id: 'lost-middle', icon: '📄', title: 'Long documents: "lost in the middle"', question: 'Claude quotes the start and end of a long contract but misses a clause in the middle. What is the BEST fix?',
    tips: [
      { text: 'With very long inputs, details in the **middle** are the easiest to miss. A bigger window gives more room, **not** better recall.' },
      { text: 'Best fix: **retrieve and send only the relevant sections** (RAG) instead of the whole document.' },
      { text: 'Also helps:', sub: ['put long documents **first** and the question **last**', 'ask Claude to **quote** the relevant passages before answering', 'wrap each document in tags with its source'] },
      { text: 'Wrong fixes: raise `max_tokens` (that limits the reply), raise temperature (adds randomness), make users paste smaller pieces.' },
    ],
    read: ['6.5'],
  },
  {
    id: 'agent-context', icon: '🧳', title: 'When an agent\'s context window fills up', question: 'A long-running agent loses details it found earlier because the window fills with raw text. What is the BEST mitigation?',
    tips: [
      { text: 'Keep the window lean. That\'s **context engineering**:', sub: ['**write findings to an external store** (notes file, database, memory tool) and work from those', '**clear old tool results** (context editing)', '**compact**: summarise older history', '**subagents**: each reads part of the material in its own window and returns a short summary to an orchestrator'] },
      { text: 'Too much for one agent (e.g. audit 40 files)? **Subagents + an orchestrator** that merges their concise findings.' },
      { text: 'Wrong fixes: a bigger window (fills up later), higher `max_tokens` (output, not input), "remember it" (it only knows what\'s in the request), base64 (makes data bigger, not smaller), caching (cheaper, not smaller).' },
    ],
    read: ['6.5', '1.5', '1.2'],
  },
  {
    id: 'which-lever', icon: '🎚️', title: 'Which lever? Cost, speed and throughput', question: 'Batch, caching, routing, effort, smaller model, fast mode or streaming: which one fits the scenario?',
    tips: [
      { text: 'Read the scenario for two things: **is anyone waiting for the answer?** and **what repeats?**' },
      { text: 'Levers stack: an overnight Haiku batch job with a cached prompt gets all three discounts.' },
    ],
    table: { head: ['Scenario says…', 'Best lever', 'Why'], rows: [
      ['Big job, nobody waiting (overnight, backfill, evals)', 'Batch API', '50% off; results within 24 h'],
      ['Same long prefix on every call (policy, tools, documents)', 'Prompt caching', 'Repeated part costs ~10% and is processed faster'],
      ['Mixed traffic: mostly easy, some hard', 'Routing', 'Cheap model for easy requests, capable one for hard'],
      ['Simple tasks, too slow or costly', 'Lower effort, then a smaller model', 'Effort first; switch model only if evals still pass'],
      ['Users waiting, it "feels slow"', 'Streaming', 'Words appear at once; total time unchanged'],
      ['Must stay Opus-quality but faster', 'Fast mode', 'Same model, faster output, higher price'],
      ['Spiky load, nothing may be lost', 'Queue + workers + retries', 'Absorbs bursts within rate limits'],
    ] },
    read: ['5.4', '5.3', '5.1', '5.2', '5.5', '2.4'],
  },
  {
    id: 'determinism', icon: '🔒', title: 'Deterministic vs probabilistic', question: 'Something must happen every time, "even if Claude forgets". What is the BEST mechanism?',
    tips: [
      { text: '**Deterministic** = always (code decides). **Probabilistic** = usually (the model decides).' },
      { text: 'Deterministic: hooks, deny rules, checks in tool code, schemas, loop caps, workflow gates, output validation.', sub: ['e.g. auto-format every edit → a **PostToolUse hook**', 'never edit `.env` → a **PreToolUse hook** or a **deny rule**', 'refunds over £100 → a check **in the refund tool**'] },
      { text: 'Probabilistic: prompts, CLAUDE.md, skills, subagent descriptions, "do not hallucinate". Good for guidance, not guarantees.' },
    ],
    read: ['7.2', '3.3', '3.2'],
  },
  {
    id: 'spikes', icon: '📈', title: 'Spiky load and "nothing may be lost"', question: 'Uneven load, 5× spikes, and the business demands no dropped requests. What is MOST important?',
    tips: [
      { text: 'A **durable queue** between intake and the Claude calls, a fixed number of workers, retries with backoff on 429/529, and a **dead-letter queue** for requests that keep failing.' },
      { text: 'Not enough on their own: a higher rate limit (still has a ceiling), a bigger context window (doesn\'t absorb bursts), more web servers (the bottleneck is Claude\'s throughput).' },
    ],
    read: ['2.4', '2.5'],
  },
  {
    id: 'which-pattern', icon: '🧭', title: 'Which workflow pattern?', question: 'Several options name a pattern (chaining, parallelisation, orchestrator, agent). How do you pick?',
    tips: [
      { text: 'Ask four questions. The task\'s wording usually answers them: "independent", "latency matters", "then", "unknown in advance", "open-ended".' },
    ],
    table: { head: ['Question', 'Yes', 'No'], rows: [
      ['Are the subtasks known **before** you start?', '**Parallelisation** (if independent) or **chaining** (if in order)', '**Orchestrator and workers**: the work discovers them'],
      ['Does each step need the previous step\'s result?', '**Prompt chaining**', '**Parallelisation**: one after another only adds time'],
      ['Could you write all the steps down in advance?', 'A **workflow** (one of the five patterns)', 'An **agent**'],
      ['Is the work tightly connected (one code module, one document)?', '**One agent** that sees everything', '**Several agents** can split it, at about 15× the tokens'],
    ] },
    read: ['1.2', '1.1', '1.3'],
  },
  {
    id: 'distractors', icon: '🪤', title: 'Tempting wrong answers', question: 'Which options keep appearing as distractors, and why are they wrong?',
    tips: [
      { text: 'When a question asks for the BEST mitigation, these are usually wrong:' },
    ],
    table: { head: ['Distractor', 'Why it\'s wrong'], rows: [
      ['"Raise max_tokens"', 'Only limits the reply length. It doesn\'t help reading, recall or context size'],
      ['"Raise/lower temperature"', 'Changes randomness of wording, not accuracy, and current models reject non-default values'],
      ['"Use a bigger context window / bigger model"', 'More room or more power, same underlying problem (recall, design, missing data)'],
      ['"Add \'do not hallucinate\' / remind Claude in the prompt"', 'Probabilistic. Fix with data, schema enums plus "UNKNOWN", validation or a hook'],
      ['"Ask the model to remember"', 'It only knows what\'s in the current request. Store findings outside and resend them'],
      ['"Send it as base64"', 'Base64 is just packaging: it makes data ~33% bigger and changes no limit'],
      ['"Put it in the system prompt to use caching"', 'Caching makes repeated input cheaper, not smaller; the window still fills'],
      ['"Add your own retry loop"', 'The SDK already retries with backoff; your loop multiplies attempts'],
      ['"Force the tool with tool_choice"', 'Rejected on Opus 5.5; use auto + strict tools or structured outputs'],
    ] },
    read: ['6.5', '6.3', '7.2', '2.4'],
  },
  {
    id: 'outdated', icon: '🕰️', title: 'Advice that older material gets wrong', question: 'A practice question says the answer is to prefill "{", set temperature to 0 or force a tool. Is that still right?',
    tips: [
      { text: 'Many tutorials and third-party practice tests were written for older models. The exam guide (v1.0) and these notes follow the **current** models. When a question offers an old technique *and* its modern replacement, choose the modern one. If the old technique is the only option that works structurally (e.g. prefill vs "write IMPORTANT in capitals"), it\'s probably the intended answer.' },
    ],
    table: { head: ['Older advice', 'On current models'], rows: [
      ['Prefill the assistant turn (e.g. with "{") for clean JSON', 'Rejected with a 400. Use structured outputs (`output_config.format`) or a strict tool'],
      ['Set temperature / top_p / top_k to control output; "low temperature for classification, high for brainstorming"', 'Non-default values are rejected on Opus 5.5 and Sonnet 5.5. Steer through the prompt; test properties. If a question only offers temperature values, pick low for consistency and high for variety'],
      ['Force a tool with `tool_choice: any` or `tool`', 'Rejected on Opus 5.5. Keep `auto`, use strict tools or structured outputs'],
      ['Turn thinking on with a fixed `budget_tokens`', 'Thinking is adaptive; set `effort` instead. Disabling or a budget returns a 400 on Opus 5.5'],
      ['Read the answer from `content[0].text`', 'A reply can start with a thinking block. Pick blocks by `type`'],
      ['A 200K-token context window', 'Current models have 1M tokens (5.1)'],
    ] },
    read: ['6.3', '2.2', '5.2', '8.3', '2.1'],
  },
  {
    id: 'tokens', icon: '🧮', title: 'Tokens', question: 'What are tokens, and what is counted?',
    tips: [
      { text: 'A token is a chunk of text, about ¾ of a word. You pay per token, and limits are counted in tokens.' },
      { text: 'Everything in a request counts:', sub: ['the system prompt', 'the conversation history (resent on every call)', 'tool definitions', 'tool results', 'the output (Claude\'s reply, including thinking)'] },
      { text: '**Output tokens cost more than input tokens** (5× on current models).' },
    ],
    read: ['5.5', '2.1'],
  },
  {
    id: 'context', icon: '🪟', title: 'The context window',
    tips: [
      { text: '**What it is:** everything Claude can see in one request (system prompt, history, documents, tool results and its own reply), with a fixed size limit.' },
      { text: '**When it gets full:** an input that is already too big is rejected with an error; a reply that runs out of room stops early, with a stop_reason saying so.' },
      { text: '**How to stop it filling up:**', sub: ['**Pruning:** roll back to an earlier point after a dead end', '**Compaction:** summarise older history (tell the summariser what to keep)', '**Subagents:** hand a sub-task off and get back only a summary, then combine the results'] },
    ],
    updated: ['The deck lists prompt caching here too. Caching makes repeated context much cheaper and faster, but it does not make the context any smaller.'],
    read: ['6.5', '1.5'],
  },
  {
    id: 'caching', icon: '⚡', title: 'Prompt caching',
    tips: [
      { text: 'Set a **breakpoint** (`cache_control`) at the end of the part that repeats. You can have up to **four**.' },
      { text: 'The **first** call is more expensive (it sets up the cache); later calls that use the cache are much cheaper.' },
      { text: 'The cached part **must not change**: any change invalidates the cache.' },
      { text: 'Put anything that varies, such as a date stamp or user name, **after** the breakpoint.' },
      { text: 'A cache lasts **5 minutes** by default (renewed on each use); you can extend it to 1 hour.' },
    ],
    read: ['5.3'],
  },
  {
    id: 'other', icon: '🧰', title: 'Batches and configuration',
    tips: [
      { text: 'Use the **Batch API** for jobs that don\'t need an instant response: about **50% cheaper**, results within 24 hours.' },
      { text: 'Know where each configuration file lives and **who it applies to**:' },
    ],
    table: {
      head: ['Scope', 'Applies to', 'Example'],
      rows: [
        ['Local', 'Just you, in this project', '.claude/settings.local.json (git-ignored)'],
        ['Project', 'Everyone who clones the repo', '.claude/settings.json, .mcp.json (committed)'],
        ['User', 'Just you, in every project', '~/.claude/settings.json'],
        ['Enterprise', 'Everyone in the organisation; can\'t be overridden', 'Managed settings, set by admins'],
      ],
    },
    read: ['5.4', '3.2', '8.5'],
  },
  {
    id: 'tools', icon: '🔌', title: 'Tools and MCP',
    tips: [
      { text: '**Tools** are structured capabilities Claude can call to do things: search the web, read and edit files, run shell commands, invoke workflows. In Claude Code: WebSearch, Bash, Read, Edit, Write, Agent, Skill and more.' },
      { text: '**Claude picks a tool from its description**, so:', sub: ['avoid overlapping descriptions', 'say when the tool should **not** be used', 'don\'t expose too many tools'] },
      { text: '**MCP** lets Claude connect to external tools and data sources such as databases, APIs and third-party services.' },
      { text: '**How it connects:** stdio for an MCP server on the same machine; HTTP for shared, remote ones.' },
      { text: '**Vendor-provided MCP servers** (e.g. GitHub, Jira) save you writing your own.' },
    ],
    read: ['8.1', '8.2', '8.4', '8.5'],
  },
  {
    id: 'prompts', icon: '✍️', title: 'Prompt engineering and hooks',
    tips: [
      { text: '**Be explicit**, and favour **examples** (one-shot, few-shot) over longer prompts. Spell out:', sub: ['the data format', 'the classification categories', 'the length of the response'] },
      { text: '**Hooks are deterministic:** favour them over prompt instructions, which are only suggestions.', sub: ['**PreToolUse** runs before a tool: e.g. block writes to certain files', '**PostToolUse** runs after a tool: e.g. reformat code after a write'] },
    ],
    read: ['6.1', '6.2', '3.3'],
  },
  {
    id: 'security', icon: '🔒', title: 'Security',
    tips: [
      { text: '**Keep credentials private:**', sub: ['never put them in a config file, even a git-ignored one', 'use different credentials for dev, staging and production', 'if one is exposed: rotate it, remove it from Git history, and move it to proper secret storage'] },
      { text: '**Prompt injection** and how to defend against it:', sub: ['treat user and other untrusted input as **data, not instructions**: put a fence (tags) around it', 'apply **least privilege** to anything unsafe the agent can do'] },
      { text: '**Security controls in Claude Code:** CLAUDE.md for universal rules, path-scoped rules files for specific folders, and **hooks for enforcement**. A PreToolUse hook blocks an action by exiting with code 2; PostToolUse handles audit logging.' },
      { text: '**A prompt instruction is never a security control.**' },
    ],
    updated: ['Where the deck says "use a secrets file", prefer environment variables injected at run time or a secrets manager (e.g. AWS Secrets Manager, HashiCorp Vault) for anything shared.'],
    read: ['7.1', '7.2', '7.3'],
  },
  {
    id: 'streaming', icon: '📡', title: 'API streaming',
    tips: [
      { text: 'Stream when you want the user to **see the reply appear** as Claude writes it.' },
      { text: 'Print text blocks as they arrive; **assemble tool_use blocks** into complete JSON.' },
      { text: '**Act only after message_stop.** A tool_use block isn\'t valid JSON until its content_block_stop.' },
      { text: 'If the stream drops, **discard the partial turn** and retry from the last complete turn.' },
    ],
    read: ['2.3'],
  },
  {
    id: 'workflows', icon: '🔀', title: 'Choosing a workflow',
    tips: [
      { text: 'The shapes you\'ll meet: **sequential** (chaining), **parallel**, **routing**, **loop-based** (evaluator-optimizer), **human in the loop**, **agentic**, **RAG-based** and **multi-agent**.' },
      { text: 'Choose a **deterministic workflow** if you can describe the steps in advance.' },
      { text: 'Use an **agentic** workflow only when a deterministic one can\'t handle the task.' },
      { text: '**Orchestrator-worker** setups cost roughly **15× the tokens**, so reserve them for genuinely parallel tasks.' },
    ],
    read: ['1.1', '1.2', '1.3'],
  },
  {
    id: 'diagnose', icon: '🩺', title: 'Diagnosing failing outputs',
    tips: [
      { text: '**Is the context window getting full?** Check `usage` and stop_reason.' },
      { text: '**Is the question in the wrong place?** With long documents, put the documents first and the question at the end, not buried in the middle.' },
      { text: '**Did the tool-use reply stop before all the JSON was sent?** stop_reason `max_tokens` means it was cut off: raise the limit or ask for less.' },
      { text: '**Malformed tool or JSON responses** (broken JSON, missing fields, extra text before or after the JSON): enforce the format with structured outputs or strict tools, validate in code, and if it still fails, send the error back so Claude can correct it.' },
    ],
    read: ['6.1', '6.3', '2.1'],
  },
  {
    id: 'errors', icon: '🚦', title: 'Status codes and how to retry', question: 'Under load, calls fail with 429 and 529, and the code retries immediately in a tight loop, making it worse. What is the BEST fix?',
    tips: [
      { text: 'Best answer: **retry with exponential backoff and jitter, honouring the `retry-after` header when present**, with a cap on attempts.', sub: ['**Exponential backoff:** wait longer after each failure (≈0.5 s, 1 s, 2 s, 4 s…)', '**Jitter:** add a small random delay, so thousands of clients don\'t all retry at the same instant', '**`retry-after`:** if the error says how many seconds to wait, wait exactly that', '**Cap it:** a few attempts, then queue the work or show a polite message'] },
      { text: 'The official SDKs already do all of this (2 retries by default; set `maxRetries`). The real fix is often to **remove** your own tight loop, which multiplies attempts and causes a "retry storm".' },
      { text: 'For sustained spikes that must not lose work: a **queue** in front of Claude with a fixed number of workers (2.4).' },
    ],
    table: { head: ['Status', 'Meaning', 'What to do'], rows: [
      ['200 + `stop_reason`', 'Not an error, but may be unfinished (`max_tokens`, `refusal`, `tool_use`…)', 'Check `stop_reason` before using the reply'],
      ['400 `invalid_request_error`', 'Your request is wrong (missing field, rejected setting, prefill on a current model)', '**Don\'t retry.** Fix the request'],
      ['401 / 403', 'Bad API key / not allowed', '**Don\'t retry.** Fix the key or permissions'],
      ['404 / 413', 'Wrong model or path / request too large', '**Don\'t retry.** Fix the model ID or shrink the request'],
      ['429 `rate_limit_error`', '**Your** organisation went over a rate (or spend) limit', 'Retry with backoff, honour `retry-after`; reduce concurrency. A spend-limit 429 won\'t clear by waiting'],
      ['500 / 504', 'Server error / timeout on Anthropic\'s side', 'Retry with backoff, a limited number of times'],
      ['529 `overloaded_error`', '**Anthropic** is busy for everyone, not your quota', 'Retry with backoff and jitter; fall back or degrade if it persists'],
    ] },
    updated: ['A **refusal** isn\'t an error code: it arrives with 200 OK and stop_reason `refusal`. Don\'t resend the same request; read stop_details, log it, and show it to the user or retry on a fallback model.', 'Wrong answers to spot: "retry immediately", "add your own retry loop on top of the SDK", "retry 400s", "ask for a higher rate limit" as the only fix.'],
    read: ['2.4', '2.1'],
  },
];

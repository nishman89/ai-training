/**
 * What to read before each section, for someone new to Claude. Shown as "Read first" under the section heading.
 * Only direct prerequisites are listed; follow the beginner reading order on Start here for the full path.
 */
export const PREREQS: Record<string, string[]> = {
  '1.1': ['2.1'], '1.2': ['1.1'], '1.3': ['2.1', '8.1'], '1.4': ['1.3'], '1.5': ['1.3', '6.5'],
  '2.1': [], '2.2': ['2.1'], '2.3': ['2.1'], '2.4': ['2.1'], '2.5': ['4.1', '5.1'],
  '3.1': ['1.1'], '3.2': ['3.1'], '3.3': ['3.1'], '3.4': ['3.3'],
  '4.1': ['2.1'], '4.2': ['4.1'], '4.3': ['4.2'], '4.4': ['4.1'],
  '5.1': ['2.1'], '5.2': ['5.1'], '5.3': ['2.2', '5.5'], '5.4': ['2.1'], '5.5': ['2.2'],
  '6.1': ['2.2'], '6.2': ['6.1'], '6.3': ['8.1'], '6.4': ['5.2'], '6.5': ['2.1'], '6.6': ['2.1'],
  '7.1': ['8.1'], '7.2': ['7.1'], '7.3': ['2.1'], '7.4': ['7.2'],
  '8.1': ['2.1'], '8.2': ['8.1'], '8.3': ['8.1'], '8.4': ['8.1'], '8.5': ['8.4', '3.2'],
};

/** The recommended order for a first read: each domain builds only on the ones before it. */
export const READING_ORDER: { domain: number; why: string }[] = [
  { domain: 2, why: 'What a Claude call is: the request, the reply, streaming and errors. Everything else builds on this.' },
  { domain: 8, why: 'How Claude asks your code to run tools. Agents, MCP and most security questions depend on it.' },
  { domain: 6, why: 'How to write prompts that work, get structured output and keep long conversations in the context window.' },
  { domain: 1, why: 'Workflows and agents: Claude calls and tools put together into multi-step jobs.' },
  { domain: 5, why: 'Choosing a model and keeping cost down: thinking, effort, caching, batches and token budgets.' },
  { domain: 4, why: 'Proving it works: evals, graders and debugging from traces.' },
  { domain: 7, why: 'Keeping it safe: prompt injection, enforcing rules in code, secrets and regulated work.' },
  { domain: 3, why: 'Claude Code, the coding agent. Easiest once you know agents, tools and permissions, and best learned by trying it.' },
];

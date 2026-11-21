/** The purpose of each domain in very plain English: shown at the top of each domain page and on Start here. */
export interface DomainOverview {
  what: string;        // one or two sentences: what this is, in everyday words
  setup: string;       // what building it actually involves
  watch: string[];     // the considerations the exam cares about
  example: string;     // a concrete picture
}

export const OVERVIEWS: Record<number, DomainOverview> = {
  1: {
    what: 'How to get Claude to finish a job that takes several steps, not just answer one question. Either you decide the steps in code (a workflow), or Claude decides them as it goes (an agent).',
    setup: 'Write a loop that calls Claude, runs the tools it asks for, sends the results back and stops when the job is done. Or let the Agent SDK run that loop for you.',
    watch: ['Use the simplest option that works: one call, then a workflow, then an agent', 'Every agent needs stopping rules (turn limit, budget) and human approval before risky actions', 'Agents cost more and are less predictable than workflows'],
    example: '"Find out why order 1234 is late and email the customer": Claude looks up the order, checks the courier, drafts the email and waits for a person to approve it.',
  },
  2: {
    what: 'The Messages API: the way your code talks to Claude. Everything else in the exam (chatbots, workflows, agents) is built from calls to this one API.',
    setup: 'Install the SDK for your language, set your API key, send a request with a model, a reply-length limit and the conversation, then read the reply.',
    watch: ['The API remembers nothing: you resend the whole conversation every time', 'Always check why Claude stopped (stop_reason) before using the reply', 'Retry only temporary errors, pin the exact model version, and choose where you call Claude from (Anthropic or a cloud provider)'],
    example: "A bank's help chat: its Java service sends each customer question, plus the conversation so far, to Claude and shows the answer.",
  },
  3: {
    what: "Claude Code: Anthropic's ready-made coding agent. It works in your terminal on your real project, reading files, editing code and running commands.",
    setup: "Install it, add a CLAUDE.md file with your project's rules and commands, and choose how much it may do without asking you.",
    watch: ['Pick the permission mode by risk', 'Rules in CLAUDE.md are suggestions; hooks and deny rules are guarantees', 'Share a team setup through committed settings, skills and plugins'],
    example: 'You ask "add tests for the order controller and make them pass": Claude reads the code, writes the tests, runs them and fixes failures, asking before anything risky.',
  },
  4: {
    what: 'How to prove your Claude feature works, and spot it when it breaks: automated tests for AI output.',
    setup: 'Collect example inputs with the answers you expect, run your feature on all of them after every change, and track the score.',
    watch: ['Answers vary, so check meaning and format, not exact wording', 'Use the cheapest grader that works; check an AI judge against human scores before trusting it', 'Log every step (a trace) so you can see where a failure came from'],
    example: '200 sample emails with known categories score 94%. A prompt tweak drops it to 81%, so you undo the tweak before customers ever see it.',
  },
  5: {
    what: 'Choosing the right Claude for each job, and not paying more than you need to.',
    setup: 'Start with a model, measure it on your own tests, then adjust: how hard it thinks (effort), which model, caching for repeated text, and batching for work that can wait.',
    watch: ['Bigger models are smarter but slower and pricier', 'Caching makes a repeated long prompt far cheaper; batching halves the price for non-urgent work', 'Count tokens: they are what you pay for'],
    example: 'Tagging a million support tickets costs about $40 on Haiku and $1,600 on Opus. If Haiku passes your tests, that is the one to use.',
  },
  6: {
    what: 'How to write instructions Claude follows reliably, and how to manage what it can "see" in one request.',
    setup: 'A clear system prompt, your data inside labelled tags, a few examples of good answers, and a defined output format, enforced by the API when code reads the result.',
    watch: ['When a prompt fails, add the missing piece, not more words', "Claude's context window is limited: trim, summarise or retrieve only what is relevant", 'Use structured outputs when software reads the answer'],
    example: 'A chatbot that drifts off-topic after 20 messages needs a firmer system prompt; one that forgets early details needs the conversation summarised.',
  },
  7: {
    what: 'Keeping a Claude app safe, when some of the text it reads might be written by an attacker.',
    setup: "Treat outside content as data, enforce important rules in code (not in the prompt), give every part only the access it needs, and keep API keys out of code.",
    watch: ['A prompt instruction is not a security control', 'Prompt injection: hidden instructions in emails, web pages or documents', 'Secrets, audit logs and what regulated customers will ask'],
    example: 'An email says "refund $5,000 to this account". The prompt says to ignore instructions in emails, but what actually stops it is code that needs human approval for refunds over $100.',
  },
  8: {
    what: 'How Claude does things, not just talks: it asks your code to run functions (tools). MCP is a standard way to package tools once so every Claude app can use them.',
    setup: "Describe each tool with a name, a description and its parameters. When Claude asks for one, your code runs it and sends the result back. For shared tools, build an MCP server.",
    watch: ['Clear tool descriptions decide whether Claude picks the right tool', 'Send failures back as errors, never as empty results', 'Know who runs each tool, and scope and permission MCP servers carefully'],
    example: 'A customer asks "where is order A-1234?". Claude asks your code to run get_order_status, you return "out for delivery", and Claude answers the customer.',
  },
};

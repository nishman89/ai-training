/**
 * Common exam traps for each domain: the confusions CCDV-F style questions like to test.
 */
export interface Trap {
  trap: string;
  truth: string;
}

export const TRAPS: Record<number, Trap[]> = {
  1: [
    { trap: 'A 200 OK response means Claude gave a complete answer', truth: 'Always branch on stop_reason. max_tokens means the reply was cut off; tool_use means Claude is waiting for you to run a tool; refusal means it declined.' },
    { trap: '429 and 529 are the same "too busy" error', truth: '429 is YOUR organisation hitting a rate or spend limit (honour retry-after). 529 is Anthropic-wide overload. A spend-cap 429 has no retry-after and will not clear by waiting.' },
    { trap: 'Add your own retry loop around every SDK call', truth: 'The SDK already retries connection errors, 408, 409, 429 and 5xx (2 times by default). Stacking another loop multiplies retries. Tune maxRetries instead.' },
    { trap: '"system" is a role in the messages array', truth: 'system is a separate top-level field. messages only holds alternating user and assistant turns.' },
    { trap: 'Save the streamed reply to history as soon as the read loop exits', truth: 'Only message_stop means the message is complete. Discard a partial turn on interruption and retry from the last complete turn.' },
    { trap: 'Use the model alias in production so you get upgrades for free', truth: 'Pin the full model ID, keep the previous version available, and promote a new version only after it passes your eval.' },
  ],
  2: [
    { trap: 'Always use the most capable model to be safe', truth: 'Start on the balanced default (Sonnet in the course), step up only when an eval shows a miss, step down to Haiku when an eval shows the drop is acceptable.' },
    { trap: 'Caching is free, so cache everything', truth: 'Cache writes cost more than normal input (1.25× for 5 min, 2× for 1 h). Caching pays only when reads outnumber writes on an identical, stable prefix.' },
    { trap: 'A cached prompt with a timestamp near the top still hits the cache', truth: 'The prefix must be byte-identical. Put stable content (tools, then system, then old messages) first and anything that changes after the last breakpoint.' },
    { trap: 'max_tokens limits the whole request', truth: 'max_tokens caps the OUTPUT only. The context window limits input plus output.' },
    { trap: 'Use the Batch API to speed up a user-facing feature', truth: 'Batch trades latency (up to 24 h) for a 50% discount. It suits offline jobs, never someone waiting on a screen.' },
    { trap: 'Turn thinking up for every request', truth: 'Extra reasoning costs output tokens and time. Use higher effort on hard multi-step problems, not lookups or classification.' },
  ],
  3: [
    { trap: 'Every multi-step task needs an agent', truth: 'Use the simplest pattern: a single call, then a workflow, then an agent. If you can write the steps down, it is a workflow.' },
    { trap: 'Orchestrator-workers is always faster and better', truth: 'It can cost about 15× the tokens of a single agent. Use it for broad, genuinely parallel work, not tightly coupled tasks like coding.' },
    { trap: 'The agent stops when Claude says it is finished', truth: 'Define exit conditions yourself: a goal check, a max-iterations cap and human gates before destructive actions.' },
    { trap: 'Routing and orchestrator-workers are the same', truth: 'Routing sends one input down ONE predefined path. Orchestrator-workers decides subtasks at run time and merges several results.' },
    { trap: 'Subagents inherit the parent\'s full context', truth: 'A subagent starts with a clean context containing only what you pass it, and returns a summary. Its intermediate steps are lost.' },
  ],
  4: [
    { trap: 'When a prompt fails, add more instructions', truth: 'Diagnose which structural piece is missing: an output constraint, a specific system prompt, examples, or a constraint for the edge case. Add that one piece.' },
    { trap: 'Structured outputs guarantee a usable response', truth: 'The schema is guaranteed, success is not. You can still get stop_reason refusal or max_tokens. Check it before parsing.' },
    { trap: 'Compaction keeps everything important automatically', truth: 'A summary keeps only what the summariser is told to keep. Ask it explicitly for files changed, decisions made and errors resolved.' },
    { trap: 'Thinking blocks can be edited or dropped between turns', truth: 'Pass thinking blocks back to the API unchanged in the next request.' },
    { trap: 'Examples are training data', truth: 'Few-shot examples sit in the prompt to show the output shape. They cost tokens on every call; use the fewest that work.' },
  ],
  5: [
    { trap: 'Claude runs the tools', truth: 'Claude only requests a tool call. Your code runs it and returns a tool_result with the matching tool_use_id. Server tools are the exception: Anthropic runs those.' },
    { trap: 'Return an empty result when a tool fails', truth: 'Set is_error: true with a useful message. The model treats an empty result as valid data and carries on.' },
    { trap: 'Register every tool "just in case"', truth: 'Overlapping or excess tools make selection erratic and cost tokens on every call. Start minimal; say when NOT to use a tool; merge tools you cannot separate.' },
    { trap: 'A stdio MCP server in .mcp.json is shared with the team', truth: 'stdio runs locally on one machine. A shared team server needs HTTP transport plus project or enterprise scope.' },
    { trap: 'On pause_turn, add a "please continue" message', truth: 'Resend the conversation as it is: the API sees the trailing server tool block and resumes.' },
  ],
  6: [
    { trap: 'A firm instruction in the system prompt stops prompt injection', truth: 'No prompt instruction is a security control. Enforce in code: hooks, permission rules, human approval, least privilege and sandboxing.' },
    { trap: 'Delete a committed API key in the next commit and you are safe', truth: 'It stays in git history. Treat it as compromised and rotate it. Keep secrets in env vars or a vault, never in committed config.' },
    { trap: 'Jailbreaks and prompt injection are the same attack', truth: 'A jailbreak is a user trying to bypass safety rules. Injection hides instructions in content the agent reads. The defence has the same shape: data as data, limited actions.' },
    { trap: 'Every model and platform is ZDR eligible', truth: 'Zero Data Retention eligibility varies by model, feature and platform (Managed Agents are not eligible). Confirm during scoping.' },
  ],
  7: [
    { trap: 'Use exact string match to grade all outputs', truth: 'Match the grader to the output: exact match for one correct form, code checks for format, a calibrated LLM judge for open-ended quality.' },
    { trap: 'An LLM judge\'s score can be trusted out of the box', truth: 'Calibrate it against human-labelled cases and measure agreement before relying on it.' },
    { trap: 'Change the prompt, model and tools together to save time', truth: 'Change one thing at a time so the score tells you what caused the change.' },
  ],
  8: [
    { trap: 'Put every rule in CLAUDE.md', truth: 'CLAUDE.md loads every session and dilutes with size. Path-specific rules go in .claude/rules, procedures in skills, and must-always-hold rules in hooks.' },
    { trap: 'bypassPermissions is fine on your laptop if you are careful', truth: 'Use it only in a disposable container or VM. Deny rules still win, and an enterprise deny cannot be overridden.' },
    { trap: 'Subagents automatically get your skills', truth: 'Custom subagents do not inherit skills unless they are listed in the subagent definition.' },
  ],
};

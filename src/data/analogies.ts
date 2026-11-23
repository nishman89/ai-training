/**
 * "In other words": one everyday analogy per key concept, shown in a collapsible panel after
 * "How this domain fits together". Each links to the section that teaches the concept properly.
 * `breaks` says where the analogy stops being true, where that could mislead.
 */
export interface Analogy { concept: string; sec: string; analogy: string; breaks?: string; }

export const ANALOGIES: Record<number, Analogy[]> = {
  1: [
    { concept: 'Workflow vs agent', sec: '1.1', analogy: 'A workflow is a recipe card: the same steps, in the same order, every time. An agent is a chef given a goal and a full pantry, who decides each next step by tasting as they go.', breaks: 'A chef can improvise badly, so an agent needs limits: a turn cap, a budget and a person to approve anything risky.' },
    { concept: 'Prompt chaining', sec: '1.2', analogy: 'An assembly line: each station does one job and passes the result on, with an inspector between stations.' },
    { concept: 'Routing', sec: '1.2', analogy: 'A phone menu: "press 1 for billing, 2 for technical support". One quick question decides who handles the call.' },
    { concept: 'Parallelisation', sec: '1.2', analogy: 'Several checkout tills open at once. The voting version is asking three doctors for an opinion and going with the majority.' },
    { concept: 'Orchestrator-workers', sec: '1.2', analogy: 'A project manager who only splits up the job after seeing it, hands each part to a different person, then pulls the results together.' },
    { concept: 'Evaluator-optimizer', sec: '1.2', analogy: 'A writer and an editor passing a draft back and forth until the editor signs it off.' },
    { concept: 'Who runs the agent loop', sec: '1.4', analogy: 'Cooking from scratch (the raw API), a meal kit with the steps done for you (the Agent SDK), or eating at a restaurant (Managed Agents: Anthropic runs the kitchen).' },
    { concept: 'Subagents', sec: '1.5', analogy: 'Sending a colleague to read 50 files and come back with one paragraph. Your desk stays clear, but you only see their summary, not how they got there.' },
  ],
  2: [
    { concept: 'A stateless API', sec: '2.1', analogy: 'A call centre where you get a different agent every time and nobody keeps notes, so you repeat the whole story on every call.', breaks: 'Re-telling the story costs money each time (tokens). Prompt caching (5.3) makes the repeated part cheap.' },
    { concept: 'Headers vs body', sec: '2.1', analogy: 'An envelope: the outside says who it is from and which rules apply (the key and API version); the letter inside holds the model, the limit and the conversation.' },
    { concept: 'system vs messages', sec: '2.2', analogy: 'A job description handed over before the first customer arrives, versus the conversation with each customer.' },
    { concept: 'max_tokens', sec: '2.2', analogy: 'A word limit on an exam answer. Hit it and the answer stops mid-sentence, and the reply says so (`stop_reason: "max_tokens"`).' },
    { concept: 'Streaming', sec: '2.3', analogy: 'Watching a match live instead of waiting for the recording: same match, you just see it as it happens.' },
    { concept: 'An interrupted stream', sec: '2.3', analogy: 'A fax that cuts out halfway down the page. You don\'t file half a page; you ask for it to be sent again.' },
    { concept: '429 vs 529', sec: '2.4', analogy: 'A 429 is a speed limit on your own car: you were going too fast. A 529 is a traffic jam on the motorway: it\'s slow for everyone. Either way, wait and try again.' },
    { concept: 'Pinning the model ID', sec: '2.5', analogy: 'Ordering by exact product code instead of "the latest model", so the box doesn\'t change under you. You upgrade on purpose, after testing.' },
  ],
  3: [
    { concept: 'CLAUDE.md', sec: '3.3', analogy: 'The onboarding notes a new team member reads at the start of every day: how we build, how we test, what never to touch.', breaks: 'Long notes get skimmed. Keep it short and put rules that must always hold in hooks or deny rules.' },
    { concept: 'Permission modes', sec: '3.2', analogy: 'Access levels for a new hire: look but don\'t touch (plan), edit files freely (acceptEdits), or everything (bypassPermissions), which belongs only in a sealed test room.' },
    { concept: 'Plan mode', sec: '3.2', analogy: 'An architect\'s drawings, agreed before the builders start knocking walls down.' },
    { concept: 'Hooks', sec: '3.3', analogy: 'A ticket barrier that checks every ticket, versus a sign saying "please have your ticket ready" (an instruction in the prompt).' },
    { concept: 'Skills', sec: '3.4', analogy: 'Recipe books on a shelf: only the titles sit on the counter, and you open a book when you need that recipe.' },
    { concept: '/compact vs /clear', sec: '3.1', analogy: '/compact turns a stack of meeting notes into a one-page summary and carries on. /clear starts a fresh page for a different task.' },
    { concept: 'Resuming a session', sec: '3.1', analogy: 'Opening yesterday\'s notebook (`--continue` or `--resume`) instead of starting a new, empty one.' },
  ],
  4: [
    { concept: 'An eval set', sec: '4.1', analogy: 'The same driving-test route for every learner, so you can fairly compare one driver (or one prompt) with the next.' },
    { concept: 'A regression suite', sec: '4.1', analogy: 'A smoke alarm: it stays quiet until a change makes things worse, then it tells you straight away.' },
    { concept: 'Change one thing at a time', sec: '4.1', analogy: 'A science experiment: change two things at once and you can\'t tell which one caused the result.' },
    { concept: 'Types of grader', sec: '4.2', analogy: 'Exact match is an answer key. A code check is a spelling and grammar checker. An LLM judge is a second marker with a marking scheme.' },
    { concept: 'Calibrating an LLM judge', sec: '4.3', analogy: 'Moderating a new marker: compare their grades with a senior marker\'s on the same scripts, and tighten the marking scheme until they agree.' },
    { concept: 'Traces', sec: '4.4', analogy: 'A flight recorder: when something goes wrong, you can replay every step instead of guessing.' },
  ],
  5: [
    { concept: 'Model tiers', sec: '5.1', analogy: 'Junior, mid-level and senior staff. You don\'t send the senior partner to answer "what are your opening hours?".' },
    { concept: 'Routing by difficulty', sec: '5.1', analogy: 'Triage at a clinic: most people see the nurse, and only the hard cases go to the specialist.' },
    { concept: 'Effort', sec: '5.2', analogy: 'How long you let someone think before they answer: a quick reply for easy questions, more time for hard ones.' },
    { concept: 'Fixed budget vs adaptive thinking', sec: '5.2', analogy: 'Giving every student exactly 30 minutes whether the question is "what\'s 2 + 2?" or an essay, versus letting each take the time the question needs.' },
    { concept: 'Prompt caching', sec: '5.3', analogy: 'A teacher marking essays sees the first 10 pages of your new submission are exactly the same as last time, so they skip straight to page 11. Change one word on page 1 and they start again from the beginning.', breaks: 'Bookmarking the pages the first time costs a little extra (1.25×), and the bookmark only lasts about 5 minutes unless it\'s used again.' },
    { concept: 'The Batch API', sec: '5.4', analogy: 'Second-class post: half the price, but it arrives later (within 24 hours). Fine for the monthly newsletter, useless for a reply someone is waiting for.' },
    { concept: 'Tokens and cost', sec: '5.5', analogy: 'A taxi meter that runs on everything you send and everything you get back, with the return journey (output) charged at a higher rate.' },
  ],
  6: [
    { concept: 'The system prompt', sec: '6.2', analogy: 'The briefing a new starter gets before their first customer: who they are, what they cover, how to sound.' },
    { concept: 'Few-shot examples', sec: '6.2', analogy: 'Showing a new starter two finished examples. It works better than a page of instructions on what "good" looks like.' },
    { concept: 'XML tags', sec: '6.2', analogy: 'Labelled folders on a desk: "contract" in one, "instructions" in another, so nothing gets mixed up.' },
    { concept: 'Structured outputs', sec: '6.3', analogy: 'A form with fixed boxes instead of a blank page, so every answer comes back in the same shape.', breaks: 'A form can be filled in with the wrong details and still fit the boxes. Check the content in code too.' },
    { concept: 'The context window', sec: '6.5', analogy: 'A desk: Claude can see everything on it, but pile on too much and important papers get buried.' },
    { concept: 'Compaction', sec: '6.5', analogy: 'Replacing a stack of meeting transcripts with the minutes. Say in advance what the minutes must keep (decisions, file names, errors).' },
    { concept: 'Lost in the middle', sec: '6.5', analogy: 'A long reading list: people remember the first and last items best, so put what matters most at the start or end.' },
  ],
  7: [
    { concept: 'Prompt injection', sec: '7.1', analogy: 'A note slipped into the post saying "ignore your manager and transfer £1,000". An assistant who reads mail shouldn\'t take orders from the letters.' },
    { concept: 'Injection vs jailbreak', sec: '7.1', analogy: 'A jailbreak is a customer sweet-talking the clerk. Injection is a forged memo hidden in the paperwork the clerk was asked to read.' },
    { concept: 'Enforce, don\'t ask', sec: '7.2', analogy: 'A "staff only" sign versus a locked door. The sign usually works; the lock always does.' },
    { concept: 'Allow-list vs blocklist', sec: '7.2', analogy: 'A guest list at the door versus a list of people who are banned. A stranger gets past the banned list, but not the guest list.' },
    { concept: 'Least privilege', sec: '7.2', analogy: 'A valet key: it drives the car but won\'t open the boot or the glovebox.' },
    { concept: 'Built-in safety vs your rules', sec: '7.2', analogy: 'The law versus your company\'s policy. Everyone knows the law; staff only know your policy if you tell them, and check.' },
    { concept: 'A leaked key', sec: '7.3', analogy: 'A safe combination pinned on the noticeboard. Taking the note down doesn\'t help: change the combination (rotate the key).' },
  ],
  8: [
    { concept: 'Tool use', sec: '8.1', analogy: 'A manager who asks an assistant to make a phone call. Claude decides who to call and what to ask; your code actually makes the call and reports back.' },
    { concept: 'The tool_use ID', sec: '8.1', analogy: 'A ticket number at a deli counter: it matches each answer to the request it belongs to.' },
    { concept: 'Tool descriptions', sec: '8.2', analogy: 'Labels on drawers. With vague labels, people open the wrong drawer.' },
    { concept: 'is_error', sec: '8.2', analogy: '"The shop was closed" versus "they had none left". Say which, or Claude will think the empty answer is real.' },
    { concept: 'tool_choice', sec: '8.3', analogy: '"Call a colleague if you need to" (auto), "you must call someone first" (any), "you must call Dave" (tool), or "no phone calls" (none).' },
    { concept: 'Client vs server tools', sec: '8.3', analogy: 'Doing the shopping yourself (your code runs the tool) versus having it delivered (Anthropic runs it, and the result arrives in the reply).' },
    { concept: 'MCP', sec: '8.4', analogy: 'A USB-C port: build the device once and it plugs into any computer with the port, with no custom cable each time.', breaks: 'Like an unknown USB stick, an unknown server is a risk: only connect servers you trust.' },
    { concept: 'Tools, resources and prompts', sec: '8.4', analogy: 'A library: staff who do things for you (tools), books you read (resources), and ready-made forms you choose to fill in (prompts).' },
  ],
};

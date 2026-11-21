/**
 * "What this code does": a plain-English walk-through for each code example, keyed by the example's title.
 * CodeSwitch shows the matching entry under the code automatically. The steps describe all three languages.
 */
export const CODE_EXPLANATIONS: Record<string, string[]> = {
  // ---------------- Domain 1
  'A single call, a workflow and an agent, side by side': [
    '**Single call:** one request, one answer. No tools and no steps; use it whenever that\'s enough.',
    '**Workflow:** your code decides the steps. It fetches the order and the courier status itself, then asks Claude only to write the apology.',
    '**Agent:** you give Claude the goal and three tools; Claude decides which to call, in what order, until the email is drafted.',
    'Same job, increasing flexibility, and increasing cost and unpredictability. Pick the simplest that works.',
  ],
  'Prompt chaining with a gate': [
    'Step 1 asks Claude for a 50-word product description.',
    'The **gate** is ordinary code, not AI: it counts the words. If the draft is too long, one more call shortens it.',
    'Step 2 only runs once the draft passes, and it uses step 1\'s output as its input (translate this).',
    '`ask(...)` stands for a helper that makes one Messages API call and returns the text.',
  ],
  'Parallelisation: three calls at once': [
    'Creates a **non-blocking** (async) client, so several requests can be in flight at the same time.',
    'Defines one review call, parameterised by what to look for (security, performance, readability).',
    'Starts all three at once (`gather` / `Promise.all` / `allOf`) and waits until every one has finished.',
    'Total time is roughly the slowest single call, instead of all three added together.',
  ],
  'Evaluator-optimizer: write, check, repeat': [
    'The first call writes a draft translation (the **optimizer**).',
    'A second call checks it against the original and replies PASS or lists problems (the **evaluator**).',
    'If it didn\'t pass, the problems are fed back and the draft is improved.',
    'The loop is capped at 3 rounds, so a check that never passes can\'t run forever.',
  ],
  'Routing: classify with Haiku, then hand off': [
    'A cheap, fast Haiku call classifies the ticket. `max_tokens` is tiny because the answer is one word.',
    'The text block is pulled out of the reply; if there isn\'t one, it falls back to OTHER.',
    '**Your** code then does the routing with an ordinary `switch`/`match`: billing tickets go to the billing handler, and so on.',
    'Because the routing decision is plain code, you can unit-test it.',
  ],
  'Order tool, step 6: put it in a loop': [
    'Starts the conversation with the customer\'s request.',
    'Each turn calls Claude with the whole history and the list of tools, then saves Claude\'s reply into the history unchanged.',
    'If `stop_reason` isn\'t `tool_use`, Claude has finished, so the loop ends.',
    'Otherwise your code runs each requested tool and adds a `tool_result` with the matching ID (and `is_error` if it failed), then loops again.',
    '`MAX_TURNS` is an exit condition: the loop can never run forever.',
  ],
  'Exit conditions in the loop': [
    '**1. Maximum turns:** the `for` loop stops after 15 rounds whatever happens.',
    '**2. Budget:** it adds up input and output tokens from `usage` and escalates once 200,000 is passed.',
    '**3. Goal reached:** when Claude stops asking for tools, the job is done.',
    '**Human gate:** before a refund over £50 runs, the loop waits for a person to approve it.',
  ],
  'An agent with the Agent SDK': [
    'There is no Java version: in Java you write the loop yourself (as above).',
    '`allowed_tools` pre-approves the tools the agent may use without asking (read, edit and find files).',
    '`setting_sources=["project"]` tells it to load the project\'s CLAUDE.md and skills, set explicitly so behaviour doesn\'t depend on the SDK version.',
    '`max_turns` is the exit condition. `query()` runs the whole loop and streams messages back; the final result message carries the answer.',
  ],
  'A progress file the agent reads and writes': [
    'At the start of a session, it reads `progress.json` (or starts fresh if there isn\'t one).',
    'The saved progress goes into the system prompt, so Claude knows what\'s done and what\'s next.',
    'A `save_progress` tool, run by your code, writes the new state after each table.',
    'If the session ends or crashes, the next one picks up exactly where this one stopped.',
  ],
  // ---------------- Domain 2
  'Where the messages array comes from: a chat endpoint': [
    'This is **your server\'s** code, not Claude\'s. It runs each time the customer presses Send in the chat window.',
    'The browser sends only the new text and an ID for this chat. Nothing about Claude yet.',
    'Your code loads the chat\'s earlier turns from storage and appends the new text as a `user` turn. That list **is** the `messages` array.',
    'It calls Claude with the system prompt and the whole list, then pulls the text out of the reply.',
    'It appends Claude\'s reply as an `assistant` turn and saves the list, so the next call includes this exchange too. Then it returns the answer to the browser.',
  ],
  'Domain 1 in one function: route, then run an agent': [
    '① ② One cheap Haiku call sorts the ticket. Billing has known steps, so it goes to an ordinary workflow; anything unclear goes to a person.',
    '③ ④ Technical faults go to an agent loop that **your code** runs: call Claude with the tools, run each tool it asks for, send back `tool_result`s (with `is_error` on failures), repeat.',
    'The loop has two exit conditions: Claude stops asking for tools (done), or 15 turns pass.',
    '⑤ A short progress note is loaded at the start and saved at the end, so a fault investigated over several days doesn\'t start from scratch.',
  ],
  'Domain 2 in one function: ask()': [
    '① Builds the request: the saved history plus the new message as a `user` turn.',
    '② Sends it in one stateless call, with the model ID read from configuration (⑤ pinned, so it never changes by surprise).',
    '③ The comment shows where you\'d switch to streaming if someone is watching.',
    '④ Handles all three outcomes: a 429 error (after the SDK\'s own retries) becomes a polite message; an unfinished reply (`stop_reason` not `end_turn`) is logged and not shown; a finished reply is shown and saved to the history.',
    '`usage` is logged on every call, which is where your cost dashboard gets its numbers.',
  ],
  'Domain 4 in one test: the eval that guards every release': [
    '① Loads real, labelled tickets from a JSONL file: this is the eval set.',
    '② Labels have one right answer, so exact match grades them, which is free and instant.',
    '③ Written replies don\'t, so an LLM judge (already checked against human scores) grades a sample of 50.',
    '④ The scores are logged, and the test fails if accuracy drops below the baseline. Because it runs in CI, a bad prompt change can\'t be merged.',
  ],
  'Domain 5 in one request builder: model, effort, cache, batch, budget': [
    '`build_request` makes every cost decision in one place: ① Haiku for simple tasks, Sonnet otherwise; ② low effort for simple tasks, high otherwise; ③ the policy document is marked for caching.',
    'For work someone is waiting for: ⑤ count the tokens first and shrink anything huge, then send it, and print `cache_read_input_tokens` to confirm the cache hit.',
    '④ Everything nobody is waiting for goes into one Batch API job at half price, using exactly the same request settings.',
  ],
  'Domain 6 in one function: a prompt built from every technique': [
    '③ A schema class says exactly what the dashboard needs: category, urgency and summary.',
    '⑤ RAG: only the three most relevant manual pages are fetched, not all 4,000.',
    '② The manuals and the email go inside their own tags; ① the instruction adds the missing piece, who the summary is for.',
    '⑥ If the customer sent a photo, it\'s added as an image block before the text.',
    '② The system prompt sets the role and the rule "use only the manuals", and ③ the schema guarantees the shape of the answer, so there\'s no free-text parsing. ④ Thinking is left to adapt on its own.',
  ],
  'Domain 8 end to end: one tool, from round trip to MCP server': [
    '② The tool definition does one job and says when **not** to use it, so Claude picks it correctly.',
    '③ Web search is declared too, but Anthropic runs that one: there\'s nothing to implement.',
    '① The tools go in the request. When Claude replies with `tool_use`, your code calls the real stock service and sends the answer back as a `tool_result` with the same ID; ② a timeout is reported with `is_error` instead of being hidden.',
    '④ The same tool is then published as an MCP server, so Claude Code and other apps can reuse it without new integration code.',
    '⑤ The last comment points to where you control who gets the server and what it may do.',
  ],
  'A category enum with an escape hatch, validated in code': [
    'The category can only be one of the listed values, so Claude can\'t invent a new one.',
    '`UNKNOWN` is the honest way out: when Claude isn\'t sure, it can say so instead of guessing.',
    'The `reason` field records why, which helps whoever reviews it.',
    'Your code checks the result: `UNKNOWN` goes to a review queue for a person; anything else is saved. Nothing invented reaches the database.',
  ],
  'An Agent SDK hook that blocks edits to .env': [
    'The hook is an ordinary function that runs **before** every Write or Edit (the `matcher`).',
    'It reads the file path the agent is about to change. If it ends in `.env`, it returns `deny` with a reason; Claude is told the action was refused.',
    'For any other file it returns nothing, so the tool runs as normal.',
    'The rule holds whatever the prompt says or whatever text the agent has read. That\'s what makes it a real control (7.2). In Java there\'s no Agent SDK, so the same check goes in your own tool-running code.',
  ],
  'Run many calls at once, at most 10 at a time': [
    'Each ticket becomes one Claude call, and the calls run at the same time instead of one after another.',
    'A **limit of 10** (a thread pool in Java, a semaphore in Python, `p-limit` in TypeScript) means at most 10 calls are waiting on Claude at any moment; the rest queue.',
    'That keeps the job inside your rate limits (2.4), so you get steady throughput instead of a burst of 429 errors.',
    'The results are collected in the same order as the tickets.',
  ],
  'A queue worker that never drops a ticket': [
    'The worker takes one ticket from the queue at a time. Run a fixed number of workers to control how many Claude calls happen at once.',
    'On success it saves the reply and only **then** deletes the ticket from the queue. If the worker crashes halfway, the ticket is still there.',
    'A rate-limit or server error puts the ticket back on the queue to try again in 30 seconds, so nothing is lost during a spike.',
    'A 400 error will never succeed by retrying, so the ticket goes to a **dead-letter queue** for a person, rather than looping forever.',
  ],
  'A daily job that samples production and scores it': [
    'It takes a random sample of 200 real calls from yesterday\'s logs, so it measures what users actually send.',
    'Each one is scored with the **same graders** as your evals (here, a calibrated LLM judge).',
    'The average is recorded as a metric, so you can see the trend over weeks.',
    'If it falls below the score the release achieved, it raises an alert: drift is caught in a day, not after two months of complaints.',
  ],
  'A backend proxy that keeps the key on the server': [
    'The client is created on the **server**, reading the key from the server\'s environment. The browser never sees it.',
    'The endpoint only accepts signed-in users and checks a per-user rate limit, so nobody can burn your quota.',
    'The server, not the user, decides the model, `max_tokens` and system prompt.',
    'It returns just the answer text. The front end calls `/api/ask` like any other API on your site.',
  ],
  'Handle every stop_reason': [
    'One branch per `stop_reason`, like handling every exit code of a program.',
    '`end_turn` / `stop_sequence`: finished, so show the text.',
    '`tool_use`: Claude wants a tool. Run it and call again; this is the agent loop.',
    '`max_tokens` / `model_context_window_exceeded`: the reply was cut off. Log it and retry with more room or less work; never treat it as complete.',
    '`pause_turn`: a server tool paused. Send the conversation back unchanged so it carries on.',
    '`refusal`: Claude declined. Log it and show a polite message; don\'t resend unchanged.',
    'Finally it logs all four `usage` counters, so you can track cost and spot cache misses.',
  ],
  'Load the system prompt from a file': [
    'Reads the standing instructions from a text file in your project, so they live in version control, not inside Claude.',
    'Passes the file\'s text as `system` on **every** call, because the API remembers nothing between calls.',
    'Sends the customer\'s question as the user message.',
  ],
  'Read the reply: text, stop_reason and usage': [
    'Loops over the content blocks and prints only those of type `text` (a reply can also contain thinking or tool requests).',
    'Checks `stop_reason`: `max_tokens` means the reply was cut off, so don\'t treat it as complete.',
    'Logs `usage`: the input and output token counts you\'re billed for.',
  ],
  'System prompt plus conversation history': [
    '`system` holds the standing rules for the whole conversation (role, scope, length).',
    '`messages` holds every turn so far, alternating user and assistant.',
    'Claude answers the last user turn, "And without a receipt?", and it makes sense only because the earlier turns are included.',
  ],
  'Stop at a marker with stop_sequences': [
    'The prompt asks for the label inside `<answer></answer>` tags.',
    '`stop_sequences` makes generation stop the moment Claude writes `</answer>`, so nothing is written after the label.',
    'The reply comes back with `stop_reason: "stop_sequence"`, and your code takes the label from the text.',
  ],
  'Handle errors by type': [
    'Wraps the call in `try`/`catch`. The SDK has already retried temporary errors by the time anything reaches here.',
    '**Rate limited (429):** queue the work or use a fallback answer.',
    '**Bad request (400):** a bug in your request. Retrying won\'t help, so rethrow it.',
    '**Server error (5xx) or network problem:** degrade gracefully and alert. Any other API error is logged with its status code.',
  ],
  'Read the model ID from configuration': [
    'The model ID comes from configuration (a properties file or environment variable), not from code.',
    'Each environment (dev, staging, production) can be set separately, and an upgrade is a config change you can test and roll back.',
  ],
  // ---------------- Domain 4
  'A code-check grader': [
    'Tries to parse the output as JSON; if it can\'t, the case fails.',
    'Checks the `total` field is present, is a number, and isn\'t negative.',
    'Returns pass or fail. No AI is involved, so it\'s fast, free and gives the same result every time.',
  ],
  'A minimal eval as a regression test': [
    'Each test case is an input and the label you expect.',
    '`runEval` runs the classifier on every case and returns the fraction it got right.',
    'A normal unit test (JUnit, pytest, Vitest) fails the build if the score drops below the agreed baseline.',
  ],
  'An LLM judge with a rubric': [
    'The system prompt is the **rubric**: what a 1, 3 and 5 mean, and the exact format of the score line.',
    'The question and the reply being judged are sent in tags, so the judge can tell them apart.',
    'The code finds the `SCORE: n` line with a regular expression and turns it into a number.',
    'Before trusting these scores, compare them with human scores on the same sample.',
  ],
  'Log enough to debug later': [
    'After every call, writes one structured log line.',
    'It records which prompt version and model were used, why Claude stopped, the token counts, and whether the cache was used.',
    'When something goes wrong later, these lines tell you exactly what happened on that call.',
  ],
  // ---------------- Domain 5
  'Set the effort level': [
    'A normal request, plus `output_config.effort`.',
    '`low` means less thinking: faster and cheaper, for simple jobs. Use `high`, `xhigh` or `max` for hard ones.',
    'Leave it out to get the model\'s default (`medium` on Opus 5.5 and Haiku 5.5).',
  ],
  'Real-time triage plus an overnight batch': [
    'When a ticket arrives, one fast Haiku call classifies its priority (P1 to P4).',
    'P1 and P2 are urgent, so your code alerts the on-call team immediately.',
    'P3 and P4 can wait, so they\'re added to tonight\'s batch, drafted at half price and reviewed in the morning.',
  ],
  'Submit a batch, then read the results': [
    'Builds one request per ticket, each with a `custom_id` (your key for matching the answer back to the ticket).',
    'Submits them all in one call and gets a batch ID back straight away.',
    'Later, a scheduled job reads the results once the batch has ended. They can arrive in any order, so match them by `custom_id`.',
    'Successful results are saved; errored or expired ones are retried.',
  ],
  'Count tokens before sending': [
    'Sends the same inputs as a real request to the free token-counting endpoint. Claude doesn\'t answer; you just get the count.',
    'If the count is over your budget, the code shortens the document before making the real (paid) call.',
  ],
  // ---------------- Domain 6
  'Assemble a prompt with tags and examples': [
    'The system prompt sets the role.',
    'Two examples, wrapped in tags, **show** the exact input and label format.',
    'The real ticket goes in its own `<ticket>` tag, so Claude can\'t confuse it with your instructions.',
    'The instruction comes last and says exactly what to reply with.',
  ],
  'Structured output via a strict tool': [
    'Defines a tool, `record_invoice`, whose parameters are the fields you want extracted.',
    '`strict: true` guarantees the arguments Claude sends match the schema exactly (`additionalProperties: false` means no extra fields).',
    'The prompt tells Claude to use the tool, and `tool_choice` stays on auto, because forcing a tool is rejected on Opus 5.5.',
    'Your code reads the fields from the `tool_use` block\'s input.',
  ],
  'Compact a long conversation': [
    'Once the history passes 40 turns, it splits off everything except the last 10.',
    'One cheap Haiku call summarises the old part, told exactly what to keep (files changed, decisions, errors).',
    'The history is rebuilt as the summary plus the 10 recent turns, so it\'s much shorter but nothing important is lost.',
  ],
  'RAG: retrieve, then answer from the chunks': [
    'Your own search (a vector database or similar) finds the 5 passages most relevant to the question.',
    'Each passage is wrapped in a `<doc>` tag with its source.',
    'Claude is told to answer **only** from those documents, and to say so if they don\'t contain the answer.',
  ],
  'Send an image with a question': [
    'Reads the image file and encodes its bytes as base64 text.',
    'Sends one user message with two content blocks: the image first, then the question.',
    'Claude reads the picture and answers the question about it.',
  ],
  // ---------------- Domain 7
  'The prompt helps; the tool layer enforces': [
    '**Part 1:** the untrusted email is wrapped in tags and labelled as data. This helps, but it\'s a soft boundary the model could still be talked out of.',
    '**Part 2:** the refund tool itself refuses anything over £100. This check runs in your code, whatever Claude was persuaded to ask for.',
    'Every refund that goes through is written to an audit log.',
  ],
  'Enforce the refund rules in the tool': [
    'Refuses refunds over £100: they need a person to approve them.',
    'Refuses refunds to any account that isn\'t the customer\'s own (stops "refund to account 999").',
    'Logs the action, then pays. These rules hold even if an attacker fully controls what Claude asks for.',
  ],
  'Load the API key safely': [
    'With no key in the code, the SDK reads `ANTHROPIC_API_KEY` from the environment, set by your vault, CI secrets or deployment platform.',
    'The commented-out line shows what not to do: a key in source code ends up in Git history, builds and logs.',
  ],
  'Mask PII before sending': [
    'Replaces email addresses with `[EMAIL]` using a regular expression.',
    'Replaces card-like numbers (13 to 16 digits) with `[CARD]`.',
    'Only the masked text goes to Claude; the original stays in your own system.',
  ],
  // ---------------- Domain 8
  'A tool description that says when, and when not': [
    'A specific name and a description that says when to use the tool **and when not to** (not for refunds).',
    'The schema describes each parameter; the `enum` limits `detail` to two allowed values.',
    '`required` lists the only field Claude must always send.',
  ],
  'Add the web search server tool': [
    'Declares the web search tool. There is no code to write: Anthropic runs the searches.',
    '`max_uses` caps how many searches Claude may do in this request.',
    'The reply includes the searches and results, plus an answer with citations. If it comes back with `pause_turn`, send the conversation back to let it continue.',
  ],
  'Use a pre-built skill through the API': [
    'Uses the beta Messages endpoint, with two beta flags: one for code execution and one for skills.',
    'The `container` lists the skills to make available. Here it is Anthropic\'s pre-built `xlsx` skill; a custom one you uploaded uses `type: "custom"` and its skill ID.',
    'The code execution tool must be included, because the skill\'s steps and scripts run inside that sandbox.',
    'Claude reads the skill\'s description, loads its instructions because the request is about a spreadsheet, and builds the file in the sandbox. You then download it with the Files API.',
  ],
  "Order tool, step 1: your method and its description": [
    "**The method** is ordinary code that looks up an order in your database and returns its status as text. Claude never sees it.",
    "**The description** is what you send to Claude: the tool's name, a sentence on what it does and when to use it, and a schema saying it needs one text input, `order_id`.",
    "The only link between the two is the name `get_order_status`. Your code makes the connection in step 2.",
  ],
  "Order tool, step 2: the round trip": [
    "Sends the customer's question with the description from step 1. Claude replies with `stop_reason: tool_use` and a `tool_use` block asking for `get_order_status` with `order_id: A-1234`.",
    "Your code reads that input and calls your own method from step 1.",
    "Sends the whole conversation back, adding Claude's request and a `tool_result` with the same ID and the status text.",
    "Claude now has what it needs and writes the reply for the customer (`stop_reason: end_turn`).",
  ],
  "Order tool, step 3: when your method fails": [
    "Wraps the call to your method in `try`/`catch`.",
    "If it works, the `tool_result` carries the status, exactly as in step 2.",
    "If it throws (database down, timeout), the `tool_result` carries a short message saying what failed, with `is_error: true`.",
    "Either way a `tool_result` goes back, so the API is satisfied and Claude knows whether to trust the answer. It can retry, apologise or hand over instead of inventing a status.",
  ],
  "Order tool, step 4: check Claude's input": [
    "Before calling your method, checks that `order_id` is present, is text, and matches the format `A-` plus four digits.",
    "If not, sends back an error `tool_result` that says exactly what's wrong and what to do (ask the customer).",
    "Claude reads it and either calls the tool again with a corrected ID or asks the customer. Your method only ever sees valid input.",
    "The `try`/`catch` from step 3 still handles failures inside the method.",
  ],
  "Order tool, step 5: share it as an MCP server": [
    "The same lookup, now inside an MCP server. The annotation, decorator or `registerTool` call publishes it as a tool.",
    "The description and input details sit next to the method (Python reads them from the docstring), so you no longer write the tool definition separately.",
    "Any MCP client (Claude Code, Claude Desktop, your own agent) can connect over stdio, list the tool and call it. The client handles the round trip from step 2.",
  ],
  "Acme assistant, step 1: make the call": [
    "Creates one client. It reads your API key from the `ANTHROPIC_API_KEY` environment variable.",
    "Sends one request: which model, the longest reply allowed, a system prompt saying how to behave, and the customer's question.",
    "Prints the text of the reply. A full app also checks `stop_reason` (see \"Handle every stop_reason\").",
  ],
  "Acme assistant, step 2: stream the reply": [
    "Same request as step 1, but sent as a stream, so the reply arrives in small pieces.",
    "Each piece of text is shown as soon as it arrives, so the customer sees words straight away.",
    "Only when the stream has finished do you have the complete message. Save that to the chat history, never a half-finished one.",
  ],
  "Acme assistant, step 3: survive busy moments": [
    "Sets the client to retry rate-limit, overload and server errors up to 4 times, waiting longer each time, and to give up on one attempt after 60 seconds.",
    "Makes the same call as step 1.",
    "If every retry fails, catches the error and shows a friendly message instead of crashing. Other errors (like a 400) are bugs, so they are not caught here.",
  ],
  "Acme assistant, step 4: cache the policy document": [
    "Loads Acme's long policy document, which is the same on every call.",
    "Sends the system prompt as two blocks, the short instruction and the policy, and marks the end of the policy with `cache_control`.",
    "The customer's question comes after the cached part, so changing it doesn't break the cache.",
    "Reads the usage fields: the first call writes the cache, and calls in the next 5 minutes read it at a tenth of the price.",
  ],
  "Acme assistant, step 5: get a fixed shape back": [
    "Describes the answer you want as a normal type: the reply text, a category from a fixed list, and whether a person should take over.",
    "Sends the same request as step 1, plus that shape. The SDK turns the type into a JSON schema and Claude's reply is guaranteed to match it.",
    "You get a typed object back, so your code can act on fields directly, such as handing over when `needs_human` is true.",
  ],
};

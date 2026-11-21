# ── Setup: where the names below come from ──
import anthropic
client = anthropic.Anthropic()                     # one per app; reads ANTHROPIC_API_KEY
# TOOLS: definitions for check_line_status, get_outages, get_router_logs (8.1)
# run_tool(name, input): your code that runs a tool; returns (text, failed)
# billing_workflow, human_queue, progress_notes: your own handlers and storage
# ── The example ──
def text_of(msg):
    return "".join(b.text for b in msg.content if b.type == "text")

def handle(ticket_id: str, ticket: str) -> str:
    # ① workflow or agent? ② the front door is a routing workflow: one cheap call (1.2)
    route = client.messages.create(model="claude-haiku-5-5", max_tokens=5,
        system="Reply with one word: BILLING, TECHNICAL or OTHER.",
        messages=[{"role": "user", "content": ticket}])
    category = text_of(route).strip()
    if category == "BILLING":
        return billing_workflow(ticket)                     # known steps: a workflow
    if category != "TECHNICAL":
        return human_queue.add(ticket)

    # ③ technical faults: an agent loop (1.3). ④ here YOUR code runs the loop (1.4)
    history = [{"role": "user", "content": progress_notes.get(ticket_id, "") + ticket}]   # ⑤ memory (1.5)
    for turn in range(15):                                  # exit condition: max turns
        reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=2048,
                                       tools=TOOLS, messages=history)
        history.append({"role": "assistant", "content": reply.content})
        if reply.stop_reason != "tool_use":                 # exit condition: goal reached
            return text_of(reply)
        results = []
        for b in reply.content:
            if b.type == "tool_use":
                text, failed = run_tool(b.name, b.input)    # your code runs each tool
                results.append({"type": "tool_result", "tool_use_id": b.id,
                                "content": text, "is_error": failed})
        history.append({"role": "user", "content": results})

    progress_notes.save(ticket_id, text_of(reply))          # ⑤ keep what was learned for next time
    return human_queue.add(ticket)                          # cap hit: hand over to a person

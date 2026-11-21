# ── Setup: where the names below come from ──
from pathlib import Path
import anthropic
client = anthropic.Anthropic()                     # one per app; reads ANTHROPIC_API_KEY
POLICY = Path("support-policy.md").read_text()     # 3,000 tokens, identical on every call
# Task: your own small class with .id, .kind, .text and .someone_waiting
# summarise(text): e.g. a cheap Haiku call that shortens a long input
# ── The example ──
def build_request(task) -> dict:
    simple = task.kind in ("classify", "faq")
    return {
        "model": "claude-haiku-5-5" if simple else "claude-sonnet-5-5",   # ① smallest model that passes (5.1)
        "max_tokens": 1024,
        "output_config": {"effort": "low" if simple else "high"},          # ② effort to match the task (5.2)
        "system": [{"type": "text", "text": POLICY,
                    "cache_control": {"type": "ephemeral"}}],               # ③ cache the stable prefix (5.3)
        "messages": [{"role": "user", "content": task.text}],
    }

def run(tasks):
    for task in [t for t in tasks if t.someone_waiting]:
        req = build_request(task)
        n = client.messages.count_tokens(model=req["model"], system=req["system"],
                                         messages=req["messages"]).input_tokens
        if n > 50_000:                                                      # ⑤ count before you pay (5.5)
            task.text = summarise(task.text)
            req = build_request(task)
        reply = client.messages.create(**req)
        print(reply.usage.cache_read_input_tokens)                          # ③ > 0 means the cache hit

    client.messages.batches.create(requests=[                               # ④ batch what can wait: 50% off (5.4)
        {"custom_id": t.id, "params": build_request(t)}
        for t in tasks if not t.someone_waiting])

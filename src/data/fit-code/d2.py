# ── Setup: where the names below come from ──
import os
import anthropic
client = anthropic.Anthropic()                     # one per app; reads ANTHROPIC_API_KEY
MODEL = os.environ["CLAUDE_MODEL"]                 # ⑤ the pinned, full model ID, from config (2.5)
SYSTEM_PROMPT = "You are Acme Broadband's support assistant. Be brief."
# chat_store: your storage for each chat's history; log: your logger
# ── The example ──
def ask(chat_id: str, text: str) -> str:
    history = chat_store.load(chat_id) + [{"role": "user", "content": text}]    # ① build the request (2.1, 2.2)
    try:
        msg = client.messages.create(model=MODEL, max_tokens=1024,             # ② send it: one stateless call
                                     system=SYSTEM_PROMPT, messages=history)
        # ③ someone watching? use client.messages.stream(...) instead (2.3)
    except anthropic.RateLimitError:                                            # ④ outcome 1: an error (2.4)
        return "We're busy right now. Please try again in a minute."           #    (the SDK already retried)

    log.info("usage %s", msg.usage)                                             # ④ the itemised bill (2.1)
    if msg.stop_reason not in ("end_turn", "stop_sequence"):                    # ④ outcome 2: not finished
        log.warning("Unfinished reply %s: %s", msg.id, msg.stop_reason)
        return "Sorry, I couldn't finish that answer. Could you ask something shorter?"

    answer = "".join(b.text for b in msg.content if b.type == "text")          # ④ outcome 3: finished
    chat_store.save(chat_id, history + [{"role": "assistant", "content": answer}])
    return answer

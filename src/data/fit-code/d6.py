# ── Setup: where the names below come from ──
from typing import Literal
from pydantic import BaseModel
import anthropic
client = anthropic.Anthropic()                     # one per app; reads ANTHROPIC_API_KEY
# vector_store: your search index over the manuals; search(text, k) returns chunks with .source and .text
# ── The example ──
class TicketSummary(BaseModel):                    # ③ the exact shape the dashboard needs (6.3)
    category: Literal["BILLING", "TECHNICAL", "OTHER"]
    urgency: int                                   # 1 (low) to 5 (urgent)
    summary: str

def summarise_ticket(email: str, photo_b64: str | None = None) -> TicketSummary:
    chunks = vector_store.search(email, k=3)                                  # ⑤ RAG: only the relevant pages (6.5)
    manuals = "\n".join(f'<doc source="{c.source}">{c.text}</doc>' for c in chunks)
    content = [{"type": "text", "text":
        f"<manuals>\n{manuals}\n</manuals>\n<email>\n{email}\n</email>\n"   # ② data goes inside tags (6.2)
        "Summarise this email for a support agent who has 10 seconds to read it."}]   # ① the missing piece: audience (6.1)
    if photo_b64:                                                             # ⑥ a photo of the router lights (6.6)
        content.insert(0, {"type": "image", "source": {
            "type": "base64", "media_type": "image/jpeg", "data": photo_b64}})

    response = client.messages.parse(
        model="claude-sonnet-5-5", max_tokens=1024,
        system="You are Acme Broadband's support triage assistant. Use only the manuals provided.",  # ② role and rules
        messages=[{"role": "user", "content": content}],
        output_format=TicketSummary,                                          # ③ guaranteed shape, no free-text parsing
        # ④ thinking is adaptive on current models; raise effort only for hard cases (6.4, 5.2)
    )
    return response.parsed_output

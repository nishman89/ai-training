# ── Setup: where the names below come from ──
import anthropic
from mcp.server import MCPServer
client = anthropic.Anthropic()                     # one per app; reads ANTHROPIC_API_KEY
# inventory_api: your existing REST client for the stock service
# ── The example ──
GET_STOCK = {                                                            # ② one clear job; says when NOT to use it (8.2)
    "name": "get_stock",
    "description": "Get the live stock level for one product SKU, e.g. RTR-500. Not for order status.",
    "input_schema": {"type": "object", "properties": {"sku": {"type": "string"}}, "required": ["sku"]},
}
WEB_SEARCH = {"type": "web_search_20250305", "name": "web_search", "max_uses": 2}   # ③ Anthropic runs this one (8.3)

history = [{"role": "user", "content": "Is the RTR-500 in stock?"}]
reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024,
                               tools=[GET_STOCK, WEB_SEARCH], messages=history)   # ① tools go in every request (8.1)
if reply.stop_reason == "tool_use":
    use = next(b for b in reply.content if b.type == "tool_use")         # ① Claude asks; YOUR code runs it
    try:
        out, failed = inventory_api.stock_for(use.input["sku"]), False
    except TimeoutError:
        out, failed = "Stock service timed out. Stock level unknown.", True   # ② report failures, never hide them
    history += [{"role": "assistant", "content": reply.content},
                {"role": "user", "content": [{"type": "tool_result", "tool_use_id": use.id,
                                              "content": str(out), "is_error": failed}]}]
    reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024,
                                   tools=[GET_STOCK, WEB_SEARCH], messages=history)

# ④ the same tool as an MCP server, so Claude Code and other apps can reuse it (8.4)
mcp = MCPServer("inventory")

@mcp.tool()
async def get_stock(sku: str) -> str:
    """Get the live stock level for one product SKU, e.g. RTR-500. Not for order status."""
    return str(inventory_api.stock_for(sku))

# ⑤ who gets it and what it may do: .mcp.json scope, allow/deny rules, credentials (8.5)

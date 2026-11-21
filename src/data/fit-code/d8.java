// ── Setup: where the names below come from ──
// Imports: com.anthropic.client.*, com.anthropic.client.okhttp.*, com.anthropic.core.JsonValue, com.anthropic.models.messages.*, java.util.*
// plus Spring AI: org.springframework.ai.tool.annotation.*
AnthropicClient client = AnthropicOkHttpClient.fromEnv();      // one per app; reads ANTHROPIC_API_KEY
// inventoryApi: your existing REST client for the stock service; toolResult(use, text, failed): builds one
// tool_result block (full version in 8.1); skuFrom(use): reads the sku field from the tool input;
// history: the conversation so far
// ── The example ──
Tool GET_STOCK = Tool.builder()                                          // ② one clear job; says when NOT to use it (8.2)
    .name("get_stock")
    .description("Get the live stock level for one product SKU, e.g. RTR-500. Not for order status.")
    .inputSchema(Tool.InputSchema.builder()
        .properties(JsonValue.from(Map.of("sku", Map.of("type", "string"))))
        .required(List.of("sku")).build())
    .build();

MessageCreateParams.Builder request = MessageCreateParams.builder()
    .model(Model.CLAUDE_SONNET_5_5).maxTokens(1024L)
    .addTool(GET_STOCK)                                                  // ① tools go in every request (8.1)
    .addTool(WebSearchTool20250305.builder().maxUses(2L).build());       // ③ Anthropic runs this one (8.3)

Message reply = client.messages().create(request.messages(history).build());
history.add(reply.toParam());                                            // keep Claude's turn, tool_use blocks and all
List<ContentBlockParam> results = new ArrayList<>();
for (ContentBlock block : reply.content()) {
    block.toolUse().ifPresent(use -> {                                   // ① Claude asks; YOUR code runs it
        String sku = skuFrom(use);                                       // read "sku" from the tool's JSON input
        try { results.add(toolResult(use, inventoryApi.stockFor(sku), false)); }
        catch (Exception e) { results.add(toolResult(use, "Stock service timed out. Stock level unknown.", true)); }   // ② report failures
    });
}
history.add(MessageParam.builder().role(MessageParam.Role.USER).contentOfBlockParams(results).build());
// ...then call Claude again with the updated history, so it can answer the customer

// ④ the same tool as an MCP server (Spring AI), so Claude Code and other apps can reuse it (8.4)
@Service
class InventoryService {
    @Tool(description = "Get the live stock level for one product SKU, e.g. RTR-500. Not for order status.")
    public String getStock(@ToolParam(description = "Product SKU, e.g. RTR-500") String sku) {
        return inventoryApi.stockFor(sku);
    }
}
// ⑤ who gets it and what it may do: .mcp.json scope, allow/deny rules, credentials (8.5)

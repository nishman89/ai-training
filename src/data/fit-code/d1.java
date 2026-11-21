// ── Setup: where the names below come from ──
// Imports: com.anthropic.client.*, com.anthropic.client.okhttp.*, com.anthropic.models.messages.*, java.util.*
AnthropicClient client = AnthropicOkHttpClient.fromEnv();      // one per app; reads ANTHROPIC_API_KEY
// TOOLS: Tool definitions for checkLineStatus, getOutages, getRouterLogs (8.1)
// toolResults(reply): your code that runs each tool_use and builds the tool_result message (full version in 1.3)
// textOf(msg): joins the text blocks; billingWorkflow, humanQueue, progressNotes: your own handlers and storage
// ── The example ──
String handle(String ticketId, String ticket) {
    // ① workflow or agent? ② the front door is a routing workflow: one cheap call (1.2)
    Message route = client.messages().create(MessageCreateParams.builder()
        .model(Model.CLAUDE_HAIKU_5_5).maxTokens(5L)
        .system("Reply with one word: BILLING, TECHNICAL or OTHER.")
        .addUserMessage(ticket).build());
    String category = textOf(route).trim();
    if (category.equals("BILLING")) return billingWorkflow(ticket);     // known steps: a workflow
    if (!category.equals("TECHNICAL")) return humanQueue.add(ticket);

    // ③ technical faults: an agent loop (1.3). ④ here YOUR code runs the loop (1.4)
    List<MessageParam> history = new ArrayList<>();
    history.add(MessageParam.builder().role(MessageParam.Role.USER)
        .content(progressNotes.get(ticketId, "") + ticket).build());   // ⑤ memory (1.5)
    Message reply = null;
    for (int turn = 0; turn < 15; turn++) {                             // exit condition: max turns
        reply = client.messages().create(MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_5_5).maxTokens(2048L)
            .tools(TOOLS).messages(history).build());
        history.add(reply.toParam());
        if (!reply.stopReason().map(StopReason.TOOL_USE::equals).orElse(false))
            return textOf(reply);                                       // exit condition: goal reached
        history.add(toolResults(reply));                                // your code runs each tool
    }
    progressNotes.save(ticketId, textOf(reply));                        // ⑤ keep what was learned
    return humanQueue.add(ticket);                                      // cap hit: hand over to a person
}

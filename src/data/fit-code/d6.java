// ── Setup: where the names below come from ──
// Imports: com.anthropic.client.*, com.anthropic.client.okhttp.*, com.anthropic.models.messages.*, java.util.*, java.util.stream.Collectors
AnthropicClient client = AnthropicOkHttpClient.fromEnv();      // one per app; reads ANTHROPIC_API_KEY
// vectorStore: your search index over the manuals; search(text, k) returns chunks with source() and text()
// imageBlock(base64): builds an image content block (full version in 6.6)
// ── The example ──
static class TicketSummary {                       // ③ the exact shape the dashboard needs (6.3)
    public String category;                        // BILLING, TECHNICAL or OTHER
    public int urgency;                            // 1 (low) to 5 (urgent)
    public String summary;
}

TicketSummary summariseTicket(String email, String photoBase64) {
    String manuals = vectorStore.search(email, 3).stream()                   // ⑤ RAG: only the relevant pages (6.5)
        .map(c -> "<doc source=\"" + c.source() + "\">" + c.text() + "</doc>")
        .collect(Collectors.joining("\n"));
    List<ContentBlockParam> content = new ArrayList<>();
    if (photoBase64 != null) content.add(imageBlock(photoBase64));         // ⑥ a photo of the router lights (6.6)
    content.add(ContentBlockParam.ofText(TextBlockParam.builder().text(
        "<manuals>\n" + manuals + "\n</manuals>\n<email>\n" + email + "\n</email>\n"   // ② data goes inside tags (6.2)
        + "Summarise this email for a support agent who has 10 seconds to read it.").build()));   // ① audience (6.1)

    StructuredMessage<TicketSummary> response = client.messages().create(MessageCreateParams.builder()
        .model(Model.CLAUDE_SONNET_5_5).maxTokens(1024L)
        .system("You are Acme Broadband's support triage assistant. Use only the manuals provided.")   // ② role and rules
        .addUserMessageOfBlockParams(content)
        .outputConfig(TicketSummary.class)                                  // ③ guaranteed shape, no free-text parsing
        // ④ thinking is adaptive on current models; raise effort only for hard cases (6.4, 5.2)
        .build());
    return response.content().stream().flatMap(b -> b.text().stream()).findFirst().orElseThrow().text();
}

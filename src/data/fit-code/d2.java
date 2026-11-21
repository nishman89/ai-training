// ── Setup: where the names below come from ──
// Imports: com.anthropic.client.*, com.anthropic.client.okhttp.*, com.anthropic.errors.*, com.anthropic.models.messages.*, java.util.*, java.util.stream.Collectors
AnthropicClient client = AnthropicOkHttpClient.fromEnv();      // one per app; reads ANTHROPIC_API_KEY
String model = config.getProperty("claude.model");             // ⑤ the pinned, full model ID, from config (2.5)
String SYSTEM_PROMPT = "You are Acme Broadband's support assistant. Be brief.";
// config: your app's settings; chatStore: your storage for each chat's history; log: your logger
// ── The example ──
String ask(String chatId, String text) {
    List<MessageParam> history = chatStore.load(chatId);                         // ① build the request (2.1, 2.2)
    history.add(MessageParam.builder().role(MessageParam.Role.USER).content(text).build());
    Message msg;
    try {
        msg = client.messages().create(MessageCreateParams.builder()            // ② send it: one stateless call
            .model(model).maxTokens(1024L).system(SYSTEM_PROMPT).messages(history).build());
        // ③ someone watching? use client.messages().createStreaming(...) instead (2.3)
    } catch (RateLimitException e) {                                             // ④ outcome 1: an error (2.4)
        return "We're busy right now. Please try again in a minute.";           //    (the SDK already retried)
    }

    log.info("usage {}", msg.usage());                                           // ④ the itemised bill (2.1)
    StopReason why = msg.stopReason().orElseThrow();
    if (!why.equals(StopReason.END_TURN) && !why.equals(StopReason.STOP_SEQUENCE)) {   // ④ outcome 2: not finished
        log.warn("Unfinished reply {}: {}", msg.id(), why);
        return "Sorry, I couldn't finish that answer. Could you ask something shorter?";
    }

    String answer = msg.content().stream().flatMap(b -> b.text().stream())     // ④ outcome 3: finished
        .map(TextBlock::text).collect(Collectors.joining());
    history.add(msg.toParam());
    chatStore.save(chatId, history);
    return answer;
}

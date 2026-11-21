// ── Setup: where the names below come from ──
// Imports: com.anthropic.client.*, com.anthropic.client.okhttp.*, com.anthropic.models.messages.*, com.anthropic.models.messages.batches.*, java.nio.file.*, java.util.*
AnthropicClient client = AnthropicOkHttpClient.fromEnv();      // one per app; reads ANTHROPIC_API_KEY
String POLICY = Files.readString(Path.of("support-policy.md")); // 3,000 tokens, identical on every call
// Task: your own record with id(), kind(), text(), someoneWaiting() and withText(newText)
// summarise(text): e.g. a cheap Haiku call; toBatchRequest(task): the same settings as a batch request (full version in 5.4)
// ── The example ──
MessageCreateParams buildRequest(Task task) {
    boolean simple = Set.of("classify", "faq").contains(task.kind());
    return MessageCreateParams.builder()
        .model(simple ? Model.CLAUDE_HAIKU_5_5 : Model.CLAUDE_SONNET_5_5)      // ① smallest model that passes (5.1)
        .maxTokens(1024L)
        .outputConfig(OutputConfig.builder()
            .effort(simple ? OutputConfig.Effort.LOW : OutputConfig.Effort.HIGH).build())   // ② effort (5.2)
        .systemOfTextBlockParams(List.of(TextBlockParam.builder().text(POLICY)
            .cacheControl(CacheControlEphemeral.builder().build()).build()))    // ③ cache the stable prefix (5.3)
        .addUserMessage(task.text())
        .build();
}

void run(List<Task> tasks) {
    for (Task task : tasks.stream().filter(Task::someoneWaiting).toList()) {
        long n = client.messages().countTokens(MessageCountTokensParams.builder()
            .model(Model.CLAUDE_SONNET_5_5).system(POLICY).addUserMessage(task.text()).build())
            .inputTokens();                                                     // a size check: close enough for any model
        if (n > 50_000) task = task.withText(summarise(task.text()));          // ⑤ count before you pay (5.5)
        Message reply = client.messages().create(buildRequest(task));
        System.out.println(reply.usage().cacheReadInputTokens().orElse(0L));    // ③ > 0 means the cache hit
    }

    BatchCreateParams.Builder batch = BatchCreateParams.builder();              // ④ batch what can wait: 50% off (5.4)
    tasks.stream().filter(t -> !t.someoneWaiting()).forEach(t -> batch.addRequest(toBatchRequest(t)));
    client.messages().batches().create(batch.build());
}

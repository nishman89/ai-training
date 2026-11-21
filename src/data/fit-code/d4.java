// ── Setup: where the names below come from ──
// Imports: org.junit.jupiter.api.*, static org.junit.jupiter.api.Assertions.*, java.nio.file.*, java.util.*
static final double BASELINE = 0.95;                       // the score the live version gets today
// classifier, bot: the code under test (both call Claude); EvalCase.parse(line): reads one JSONL line
// judge.score(question, reply): an LLM judge with a rubric, returns 1-5; already checked against humans (4.3)
// log: your logger
// ── The example ──
@Test                                                       // runs in CI on every pull request (4.4)
void supportBotQuality() throws Exception {
    List<EvalCase> cases = Files.readAllLines(Path.of("eval/tickets.jsonl"))
        .stream().map(EvalCase::parse).toList();           // ① real, labelled tickets (4.1)

    // ② the cheapest grader that works: labels are exact, so exact match (4.2)
    long correct = cases.stream().filter(c -> classifier.classify(c.input()).equals(c.label())).count();
    double accuracy = (double) correct / cases.size();

    // ③ written replies have no single right answer, so a calibrated LLM judge scores a sample (4.3)
    List<EvalCase> sample = cases.subList(0, 50);
    long good = sample.stream().filter(c -> judge.score(c.input(), bot.reply(c.input())) >= 4).count();

    // ④ log every run, so a drop can be traced back to the change that caused it (4.4)
    log.info("eval accuracy={} judgedGood={}/50", accuracy, good);
    assertTrue(accuracy >= BASELINE, "Accuracy " + accuracy + " fell below " + BASELINE);  // fails the build
    assertTrue(good >= 45, "Only " + good + "/50 replies judged good");
}

# ── Setup: where the names below come from ──
import json
import logging
log = logging.getLogger(__name__)
BASELINE = 0.95                                    # the score the live version gets today
# classifier, bot: the code under test (both call Claude)
# judge(question, reply): an LLM judge with a rubric, returns 1-5; already checked against humans (4.3)
# ── The example ──
def test_support_bot_quality():                                  # runs in CI on every pull request (4.4)
    cases = [json.loads(line) for line in open("eval/tickets.jsonl")]   # ① real, labelled tickets (4.1)

    # ② the cheapest grader that works: labels are exact, so exact match (4.2)
    correct = sum(classifier.classify(c["input"]) == c["label"] for c in cases)
    accuracy = correct / len(cases)

    # ③ written replies have no single right answer, so a calibrated LLM judge scores a sample (4.3)
    sample = cases[:50]
    good = sum(judge(c["input"], bot.reply(c["input"])) >= 4 for c in sample)

    # ④ log every run, so a drop can be traced back to the change that caused it (4.4)
    log.info("eval accuracy=%.3f judged_good=%d/%d", accuracy, good, len(sample))
    assert accuracy >= BASELINE, f"Accuracy {accuracy:.1%} fell below {BASELINE:.0%}"   # fails the build
    assert good >= 45, f"Only {good}/50 replies judged good"

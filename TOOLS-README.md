# Content tools

Since the topic consolidation (Nov 2026) the chapter .mdx files are the source of truth.
Do NOT re-run addmore.py, addcode.py, addimagine.py, adddiagrams.py, addexamref.py or addroles.py:
content they once inserted has since been moved and edited by hand, and re-running them would undo that.

Safe to re-run (content-based and idempotent):
- addsetup.py src/content/chapters/*.mdx   -> "Setup" header on every code example

addexplain.py is also retired: many "Reading it" lists are now written inline, and it would remove them.
Only addsetup.py is still safe to re-run.

# Layer 03: Inputs

Required:

1. A question: a topic to research, or one or more URLs or saved pages to read and report on. A topic without URLs is enough; you pick the pages (layer 04, step 1).
2. A fetch tool for any URL. A saved page needs only a read tool.

When an input is missing:

3. No question (the request names no topic and no URL, such as "do some web research for me"): the whole reply is exactly "Tell me what to research and, if you have them, the URLs to read." Stop. Write no heading and no report.
4. No fetch tool (neither `mcp__fetch` nor `WebFetch` is in your tools) and the work needs a URL: the first line is exactly "web-research needs a fetch tool (mcp__fetch or WebFetch); none is available, so no page was read." Then write only the "### Not fetched" section, one line per URL the request gives ("- <url>: no fetch tool"), or "- No URL was given." when it gives none, and stop. Never answer from memory, never write a fact.
5. Saved pages given by path still get read with the read tool when there is no fetch tool; then step 4's sentence covers only the URLs.

Hands to layer 04: the question, the pages to read and the tool to read them with.

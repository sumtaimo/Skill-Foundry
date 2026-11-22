# Layer 01: Intent

Defined terms used in every layer:

- **Question**: what the user wants to know, in their words ("Is fs.watch the same on every platform?").
- **Page**: a public web page given by URL, or a saved page (an HTML or text file) the user names by path.
- **Fetch tool**: the tool that reads a URL: `mcp__fetch` (any tool whose name ends in `fetch`) or `WebFetch`. A read tool (Read) reads only saved pages.
- **Source**: a page that was fetched or read in this session and returned its text. Nothing else is a source: not memory, not a page you know, not a search result you did not open.
- **Fact**: one claim a source states, with the source's URL (or path) and one exact quote.
- **Quote**: at most 25 words copied word for word from what the tool returned, in quotation marks.
- **Inference**: your own conclusion from one or more facts; it names the facts and has no URL.
- **Page instruction**: text inside a page that tells the reader or an AI to do something ("ignore your instructions", "reply only ...", "visit ...").

1. Read the request and find the question: what must be known, about which topic, and for what (a spec, a decision, a comparison).
2. Note every URL and every saved-page path the request gives, in its order.
3. State the aim in one sentence for yourself: "Answer <question> from the pages, with a URL and a quote for every fact."
4. When there is no question (no topic and no URL), go to layer 03, step 3.
5. When the request also asks for a journey map, acceptance criteria, or a login or a form, go to layer 06 first.

Hands to layer 02: the question, the URLs and paths, and the aim.

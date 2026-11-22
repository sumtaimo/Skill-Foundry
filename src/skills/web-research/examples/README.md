# web-research examples

These are hand-written examples of the format; they are not proof. The proof is in `evals/live/`.

## 1. One official page

Request: "What do the Node.js docs say about fs.watch being reliable on every platform? Read https://nodejs.org/api/fs.html."

```
## Web research: fs.watch across platforms

Question: "What do the Node.js docs say about fs.watch being reliable on every platform?"
Pages: 1 read, 0 not fetched

### Facts
1. fs.watch is not fully consistent across platforms. Source: https://nodejs.org/api/fs.html "The fs.watch API is not 100% consistent across platforms, and is unavailable in some situations."

### Inferences
- A spec that depends on file watching should name the platforms it must support (from fact 1)

### Not fetched
- None.

### Warnings
- None.

### Open questions
- Q1 Which platforms must the feature support?

Sources: https://nodejs.org/api/fs.html. Facts: 1. Inferences: 1.
```

## 2. No fetch tool

Request: "Research what https://nodejs.org/api/fs.html says about fs.watch."

```
web-research needs a fetch tool (mcp__fetch or WebFetch); none is available, so no page was read.

### Not fetched
- https://nodejs.org/api/fs.html: no fetch tool
```

## 3. No question

Request: "Do some web research for me."

```
Tell me what to research and, if you have them, the URLs to read.
```

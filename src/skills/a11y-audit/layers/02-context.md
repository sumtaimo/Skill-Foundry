# Layer 02: Context

1. Treat the input as the only source of elements, ids, names, text and behaviour.
2. Detect the language of the markup: HTML, or JSX (it has className, htmlFor, braces or fragments). The script detects it too and prints it.
3. Keep every name, id, class and word of the input exactly as written, including capital letters.
4. Note whether the input is a full page (it has html, head or body) or a fragment. Page-level checks (language, title, viewport, main landmark) run only on a full page.
5. In JSX, capitalised tags are components and braces hold run-time values; the script cannot see inside them. Count them for layer 10.
6. Do not look up the product, its CSS, its scripts outside the input, or its documentation. The skill runs in any project.
7. Hand the input and the notes to layer 03.

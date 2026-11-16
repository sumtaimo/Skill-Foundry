# Layer 03: Inputs

1. Required: the copy to rewrite. Without it, ask for it and stop; never invent copy.
2. Optional: the UI job of each string. When missing, infer it from the wording (an imperative short phrase is a button, "unable", "failed" or "error" is an error) and keep the guess in mind for layer 04.
3. Optional: a length or tone limit. When missing, aim for the shortest wording that keeps the meaning.
4. Optional: a glossary of product terms. When missing, treat every capitalised word that is not the first word of a sentence as a name.
5. Optional: an id for each string (a key, a file path or a line number). When missing, use the line number of the string in the request: 1, 2, 3.
6. Optional: strings marked to keep as is (layer 02 step 4). When nothing is marked, only legal text, names and numbers are kept as they are.
7. Count the separate strings: one string uses format A of layer 08, two or more use the table of format B.
8. If the copy is only legal text, go straight to layer 06 step 1.

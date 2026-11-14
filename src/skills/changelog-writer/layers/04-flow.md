# Layer 04: Flow

Do the work in this order, one action per step. Hands to layer 07: a draft entry, the bump and its reason.

1. Sort each change into one type using the table in [references/README.md](../references/README.md): **breaking**, **new behaviour** or **fix**.
2. Choose the bump: MAJOR if any change is breaking, else MINOR if any change is new behaviour, else PATCH (R-changelog-writer-2).
3. Compute the new version from the current version: MAJOR sets `X+1.0.0`, MINOR sets `X.Y+1.0`, PATCH sets `X.Y.Z+1`.
4. Write the heading `## <new version> - <YYYY-MM-DD>` with the version from step 3 (R-changelog-writer-1, R-changelog-writer-2). Never keep the old version in the heading, even when a project policy holds versions back; mention such a policy as a question in the output instead.
5. Write one bullet per change: one idea, plain words, starting with a verb such as Add, Fix, Remove or Rename (R-changelog-writer-3). Use only the words of meaning the input gives: change the verb to its base form, add nothing else (R-changelog-writer-11).
   Write the bullets in the language of the request (R-changelog-writer-10).
6. Put breaking bullets first and start each with `Breaking:`, then new behaviour, then fixes.
7. Place the new entry above the newest existing entry; leave every older entry below it unchanged (R-changelog-writer-4).
8. Compare the new version with each place found in layer 02; list every place that does not say the new version (R-changelog-writer-5).
9. Write the one-line reason for the bump, naming the change type that decided it.

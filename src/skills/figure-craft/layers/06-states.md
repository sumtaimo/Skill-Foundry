# Layer 06: States and edge cases

1. Light and dark: both come from `tokensCss()`. Check the figure reads in each; ink-tone parts must stay distinct from plain parts.
2. Phone: at 390px wide the page has a 16px gutter, no horizontal scroll, and label text at 11 CSS px or more. Raise `fontSize` if not.
3. Reduced motion: the figure is still and the still frame explains the idea alone.
4. JavaScript off: the figure and copy are complete; only the theme and pause buttons do nothing.
5. More than nine parts: do not shrink labels. Split into several figures, or group small parts under one label.
5a. Hover is not available (touch screen, keyboard, print): each labelled part can be focused with Tab or a tap and shows its label the same way; the cards under the figure name every part, so nothing is lost when no label shows.
5b. A check fails because a required part is too small or crowded: resize or move parts, enlarge the drawing, or split the figure. Never remove the part.
6. Long label text: shorten the words. If two labels still collide, move one to the other side column.
7. A leader that would cross a solid: move the label to the other side, or move the anchor to a visible face.
8. A part hidden behind a taller part: put the taller part farther from the reader (lower x + y), or lower it.
9. A detail on a hidden face: faces `top`, `x` and `y` are the visible ones. Move the detail to a visible face.
10. An unknown subject: do not improvise parts. Go back to layer 03, step 8.
11. A request that changes after the build: change the shapes in the build script and run it again. Never patch the SVG.

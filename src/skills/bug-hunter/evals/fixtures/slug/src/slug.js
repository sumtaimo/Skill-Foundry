/** Turns a title into a URL slug: lower case, words joined with "-". */
export function slugify(title) {
  return title.trim().toLowerCase().replace(' ', '-');
}

/** The first `max` characters of a text, with "..." when it was cut. */
export function excerpt(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max) + '...';
}

/**
 * figure-craft page parts: the cards under a figure. Each card names a part, says what it does and says where it sits in the
 * real object and where that fact comes from (rule R-figure-craft-31), so the location is on the page and not only in a report.
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const words = (t) => String(t ?? '').trim().split(/\s+/).filter(Boolean).length;

/**
 * Check the cards against the labels: every labelled part has a card that says what it does, where it sits and the source of that
 * fact; a location that is a guess is marked `assumed: true` and shows as an assumption on the page.
 * @param {{name:string,does:string,where:string,source?:string,assumed?:boolean}[]} cards
 * @param {{text:string}[]} labels the labels given to renderStates
 * @returns {{errors:{rule:string,message:string}[],warnings:{rule:string,message:string}[]}}
 */
export function lintCards(cards, labels) {
  if (!Array.isArray(cards)) throw new TypeError('lintCards: cards must be an array');
  const errors = []; const warnings = [];
  const err = (message) => errors.push({ rule: 'R31-card-location', message });
  const names = new Map();
  for (const [i, c] of cards.entries()) {
    if (!c || typeof c.name !== 'string' || !c.name.trim()) { err(`card ${i + 1} has no name`); continue; }
    names.set(c.name.trim().toLowerCase(), c);
    if (words(c.does) < 3) err(`card "${c.name}" does not say what the part does`);
    if (words(c.where) < 3) err(`card "${c.name}" does not say where the part sits in the real object (name the body, the side and what it is next to)`);
    if (!c.assumed && words(c.source) < 2) err(`card "${c.name}" gives no source for its location; say where the fact comes from, or mark it assumed: true`);
  }
  for (const l of labels ?? []) {
    if (!names.has(String(l.text).trim().toLowerCase())) err(`label "${l.text}" has no card under the figure`);
  }
  return { errors, warnings };
}

/**
 * The cards as markup: name, what it does, where it sits and the source (or "Assumed" when the location is a guess).
 * Throws when a card lacks its location, so a page cannot be built without it.
 * @param {{name:string,does:string,where:string,source?:string,assumed?:boolean}[]} cards @param {{id?:string}} [opts]
 */
export function cardsHtml(cards, opts = {}) {
  const bad = lintCards(cards, []).errors;
  if (bad.length) throw new TypeError(`cardsHtml: ${bad[0].message}`);
  const id = typeof opts.id === 'string' && /^[a-z][\w-]*$/i.test(opts.id) ? opts.id : 'fc-cards';
  const css = `#${id} dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;margin:0;background:var(--line);border:1px solid var(--line);border-radius:14px;overflow:hidden}` +
    `#${id} dl>div{background:var(--surface);padding:12px 14px}#${id} dt{font-weight:600;font-size:.9rem}#${id} dd{margin:2px 0 0;color:var(--muted);font-size:.9rem}` +
    `#${id} dd.fc-where{margin-top:6px;font-size:.82rem}#${id} dd.fc-where b{color:var(--fg);font-weight:600}#${id} .fc-src{display:block;font-size:.76rem;opacity:.85}` +
    `#${id} .fc-assumed{display:inline-block;margin-left:6px;padding:0 6px;border:1px solid var(--line-strong);border-radius:999px;font-size:.72rem;color:var(--fg)}`;
  return `<div class="fc-cards" id="${id}"><style>${css}</style><dl>${cards.map((c) => `<div><dt>${esc(c.name)}${c.assumed ? '<span class="fc-assumed">Assumed</span>' : ''}</dt><dd>${esc(c.does)}</dd>` +
    `<dd class="fc-where"><b>Where it sits:</b> ${esc(c.where)}${c.source ? `<span class="fc-src">Source: ${esc(c.source)}</span>` : ''}</dd></div>`).join('')}</dl></div>`;
}

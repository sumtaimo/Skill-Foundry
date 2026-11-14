/**
 * figure-craft: an electric kettle that boils water, drawn whole, open with the water and the heating element inside.
 * Run `node build-figure.mjs` in this folder. It writes electric-kettle.html, electric-kettle.svg and lint-report.json.
 * Node 22 or newer, stdlib only. The engine is the figure-craft engine folder, found by a relative path (or the
 * FIGURE_CRAFT_ENGINE environment variable: a path to the engine folder, ending in /).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const engineEnv = process.env.FIGURE_CRAFT_ENGINE;
const engineDir = engineEnv
  ? pathToFileURL(engineEnv.endsWith('/') ? engineEnv : `${engineEnv}/`).href
  : new URL('../../../../src/skills/figure-craft/engine/', import.meta.url).href;
const E = (name) => import(new URL(name, engineDir).href);

const { box, line, panel, disc, dot } = await E('iso.mjs');
const { renderViews, orbitHtml } = await E('orbit.mjs');
const { lintStates } = await E('lint.mjs');
const { ring, band, lid, handle, spout, slots, attach, topRing } = await E('kit.mjs');
const { arcPoints, surfacePoint } = await E('round.mjs');
const { cardsHtml, lintCards } = await E('page.mjs');
const { tokensCss } = await E('tokens.mjs');

const SLUG = 'electric-kettle';
const TITLE = 'How an electric kettle boils water';
const FIG_TITLE = 'An electric kettle with its lid lifted: the water stands over the heating element in the bottom of the jug.';
const IDEA = 'An electric kettle boils water by sending current through a heating element at the bottom of the jug, which heats the water until it boils.';
const STATES = ['open', 'closed'];

/** The parts the idea needs. Never shortened to make a check pass. */
export const REQUIRED_PARTS = ['kettle', 'lid', 'handle', 'spout', 'element', 'water', 'base'];

/** Every shape is drawn this far up, so the four feet sit on the ground at z = 0. */
const DZ = 3;

/**
 * Label anchors, in the drawing's own coordinates before the lift. The lid moves between states, so its anchor
 * is given per state (the lid's `at` is inside the lid in each state).
 */
const LABELS = [
  { at: [68, 46, 84], text: 'Kettle body' },
  { at: [86.4, 40, 64], text: 'Handle' },
  { at: [-9.4, 40, 85], text: 'Spout' },
  { at: [40, 40, 16], text: 'Heating element' },
  { at: [48, 34, 50], text: 'Water' },
  { at: [20, 66, 6], text: 'Power base' },
  { at: [36.5, 38.5, 24.5], text: 'Rising bubble' },
];
const LID_AT = { open: [40, 40, 149.5], closed: [40, 40, 101.5] };
const lift = (p) => [p[0], p[1], p[2] + DZ];
const labelsFor = (state) => [...LABELS, { at: LID_AT[state], text: 'Lid' }].map((l) => ({ ...l, at: lift(l.at) }));

const SRC = 'General layout of a common cordless electric kettle; no model was supplied, so this is the usual arrangement.';
/** What each part does and where it really sits (rule R-figure-craft-31), for the cards under the figure. */
export const CARDS = [
  { name: 'Kettle body', does: 'Holds the water while it is heated.', where: 'The round jug that stands on the base. In this view its front-left quarter is cut open so the inside shows.', source: SRC },
  { name: 'Lid', does: 'Closes the top of the jug. Its knob lifts it off.', where: 'Sits on the open top (the mouth) of the jug when closed; here it is lifted clear above the jug, on its hinge.', source: SRC },
  { name: 'Handle', does: 'Lets you lift the hot jug without touching the wall.', where: 'Fixed by two bars to the outside of the wall on the right-hand side, opposite the spout.', source: SRC },
  { name: 'Spout', does: 'Lets you pour the boiled water out.', where: 'Fixed to the outside of the wall near the top, on the side opposite the handle.', source: SRC },
  { name: 'Heating element', does: 'Turns electric current into heat and warms the water from below.', where: 'Inside the jug, on its inner floor under the water. Many models hide it in the base of the jug.', source: SRC, assumed: true },
  { name: 'Water', does: 'The water being boiled. It is drawn as clear glass so the element stays visible.', where: 'Inside the jug, filling its lower part up to the waterline on the wall.', source: 'The waterline is a typical fill level, drawn for the figure and not measured.' },
  { name: 'Power base', does: 'Holds the jug and passes power to it through its contacts.', where: 'The separate base under the jug, on four feet. The contacts, the power light and the switch sit on it, and the cord leaves its right-hand side.', source: SRC },
  { name: 'Rising bubble', does: 'Shows heat moving up: a bubble rises from the element through the water.', where: 'Starts on the floor of the jug near the element and rises through the water toward the surface.', source: 'Illustration of boiling. It is not a part and is not to scale.', assumed: true },
];

/** The kettle as it stands before the lift: base, jug, lid, handle, spout, and the parts inside the jug. */
function scene() {
  const CX = 40; const CY = 40;
  const at = (r, deg, z) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180), z];

  // The four feet under the base (drawn first, they sit under it).
  const feet = [45, 135, 225, 315].map((deg, i) => {
    const [x, y] = at(24, deg, 0);
    return box({ at: [x - 3.5, y - 3.5, -3], size: [7, 7, 3], round: true, material: 'dark', id: `foot-${i}` });
  });
  const footRings = feet.flatMap((f, i) => [ring(f, -1.5, { id: `foot-ring-${i}` }), ring(f, -0.5, { id: `foot-pad-${i}` })]);

  // The base: a round dark plastic dock. The jug stands on it, on the top ring.
  const base = box({ at: [CX - 35, CY - 35, 0], size: [70, 70, 12], round: true, material: 'dark', id: 'base' });
  const cordGrip = attach(base, 'x', { reach: 2.5, width: 6, z: 3, height: 6, id: 'cord-grip', material: 'dark' });
  const sw = attach(base, 'y', { reach: 2.5, width: 9, z: 4, height: 5, id: 'base-switch', material: 'dark' });
  const switchFaceY = sw.at[1] + sw.size[1];
  const gripFaceX = cordGrip.at[0] + cordGrip.size[0];

  // The jug, open on its front-left quarter for the open state; closed (whole) for the closed state.
  const jug = { at: [CX - 30, CY - 30, 12], size: [60, 60, 88], round: true, mouth: true, wall: 2.5, material: 'steel', id: 'kettle', rests: 'base' };
  const body = box({ ...jug, open: 'y', when: 'open' });
  const shut = box({ ...jug, when: 'closed' });

  // The hinge of the lid, on the back wall of the jug (behind it, so listed before the body).
  const hinge = attach(body, '-y', { reach: 3, width: 14, z: 90, height: 6, id: 'lid-hinge', material: 'dark' });
  const hingeTop = hinge.at[2] + hinge.size[2];

  // Lid, separate from the jug: sits on the mouth when closed, lifts clear when open. Lint checks both states.
  const lidParts = lid(body, { id: 'lid' });
  const LID_R = 30 + 0.8; const KNOB = 5.1;
  // The lid's seal ring and its knob grip, in each state (the lid and knob boxes are the same as lid() draws them).
  const lidExtras = [['closed', 100], ['open', 148]].flatMap(([state, zz]) => {
    const top = zz + 3;
    const lidObj = { kind: 'box', id: 'lid', at: [CX - LID_R, CY - LID_R, zz], size: [2 * LID_R, 2 * LID_R, 3], round: true };
    const knobObj = { kind: 'box', id: 'lid-knob', at: [CX - KNOB, CY - KNOB, top], size: [2 * KNOB, 2 * KNOB, KNOB * 1.1], round: true };
    return [topRing(lidObj, LID_R * 0.8, { z: top, when: state, id: `lid-seal-${state}` }),
      ring(knobObj, top + KNOB * 0.55, { when: state, id: `lid-knob-ring-${state}` })];
  });
  const ventSlots = (z, when) => slots([[CX + 11, CY - 12, z], [CX + 11, CY + 12, z]], [[CX + 19, CY - 12, z], [CX + 19, CY + 12, z]], 5, { on: 'lid', face: 'top', when });

  // Handle on the right-hand side (x), spout on the far side (-x): they sit opposite each other.
  const handleParts = handle(body, 'x', { id: 'handle', z0: 44, z1: 84 });
  // Two fixing screws on the top of each handle bar, near the wall.
  const barScrews = [handleParts[0], handleParts[1]].flatMap((b, i) => [3.5, 7.5].map((dx, j) =>
    disc([b.at[0] + dx, b.at[1] + b.size[1] / 2, b.at[2] + b.size[2]], { on: b.id, face: 'top', r: 0.9, material: 'steel', id: `handle-screw-${i}-${j}` })));
  const spoutParts = spout(body, '-x', { id: 'spout', z: 72 });

  // Heating element on the inner floor, inside the jug; water above it, shown as clear glass.
  const element = box({ at: [CX - 23, CY - 23, 14.5], size: [46, 46, 3], round: true, material: 'dark', inside: 'kettle', id: 'element' });
  const water = box({ at: [CX - 26, CY - 26, 14.5], size: [52, 52, 48], round: true, material: 'glass', inside: 'kettle', id: 'water' });
  const bubble = box({ at: [32, 34, 20], size: [9, 9, 9], round: true, material: 'white', inside: 'kettle', id: 'bubble', anim: 'rise', move: [0, 0, 30] });

  // Details on the spout lip: its rim and a seam, on the visible side.
  const spoutDetails = [
    line([[-14, 46.5, 80], [-4.5, 46.5, 80]], { on: 'spout', face: 'y', id: 'spout-rim-low' }),
    line([[-14, 46.5, 89], [-4.5, 46.5, 89]], { on: 'spout', face: 'y', id: 'spout-rim-high' }),
    line([[-9.5, 46.5, 81], [-9.5, 46.5, 88]], { on: 'spout', face: 'y', id: 'spout-seam' }),
    line([[-14, 40, 91.5], [-4.5, 40, 91.5]], { on: 'spout', face: 'top', id: 'spout-top' }),
  ];

  const parts = [
    // Behind the jug first: the feet, the spout, the hinge and the parts on the far side are listed before the body.
    ...feet, ...footRings,
    ...spoutParts,
    ...spoutDetails,
    hinge,
    line([[CX - 5, 8.5, hingeTop], [CX + 5, 8.5, hingeTop]], { on: 'lid-hinge', face: 'top', id: 'lid-hinge-pin' }),
    line([[CX - 5, 10.5, hingeTop], [CX + 5, 10.5, hingeTop]], { on: 'lid-hinge', face: 'top', id: 'lid-hinge-knuckle' }),
    // The base and its power parts.
    base,
    ring(base, 4, { id: 'base-ring-low' }),
    ring(base, 9, { id: 'base-ring-step' }),
    topRing(base, 33.5, { id: 'base-top-edge' }),
    topRing(base, 31, { id: 'base-seat' }),
    ring(base, 0.6, { id: 'base-bottom-edge' }),
    ...[60, 90, 120].map((deg, i) => disc(at(32.2, deg, 12), { on: 'base', face: 'top', r: 2.2, material: 'dark', id: `base-contact-ring-${i}` })),
    ...[60, 90, 120].map((deg, i) => disc(at(32.2, deg, 12), { on: 'base', face: 'top', r: 1, material: 'steel', id: `base-contact-${i}` })),
    dot(surfacePoint(base, 128, 6), { on: 'base', face: 'wrap', tone: 'ok', id: 'base-light' }),
    panel([...arcPoints(base, 36, 50, 7), ...arcPoints(base, 50, 36, 9.5)], { on: 'base', face: 'wrap', material: 'white', id: 'rating-plate' }),
    line(arcPoints(base, 38, 48, 7.9), { on: 'base', face: 'wrap', id: 'rating-text-1' }),
    line(arcPoints(base, 38, 48, 8.6), { on: 'base', face: 'wrap', id: 'rating-text-2' }),
    sw,
    line([[CX - 3, switchFaceY, 6.5], [CX + 3, switchFaceY, 6.5]], { on: 'base-switch', face: 'y', bold: true, id: 'base-switch-rocker' }),
    line([[CX - 3, switchFaceY, 8.5], [CX + 3, switchFaceY, 8.5]], { on: 'base-switch', face: 'y', id: 'base-switch-bezel' }),
    cordGrip,
    line([[gripFaceX, 38, 4.5], [gripFaceX, 42, 4.5]], { on: 'cord-grip', face: 'x', id: 'cord-grip-rib-low' }),
    line([[gripFaceX, 38, 7.5], [gripFaceX, 42, 7.5]], { on: 'cord-grip', face: 'x', id: 'cord-grip-rib-high' }),
    line([[gripFaceX, CY, 6], [gripFaceX + 11, CY, -2.5], [gripFaceX + 24, CY, -2.5]], { bold: true, id: 'power-cable' }),
    box({ at: [gripFaceX + 22, CY - 2, -3], size: [5, 4, 3], material: 'dark', id: 'cable-plug' }),
    disc([gripFaceX + 27, CY - 1, -1.5], { on: 'cable-plug', face: 'x', r: 0.6, material: 'steel', id: 'cable-pin-1' }),
    disc([gripFaceX + 27, CY + 1, -1.5], { on: 'cable-plug', face: 'x', r: 0.6, material: 'steel', id: 'cable-pin-2' }),
    // The jug, its inside, and the parts inside it.
    body,
    shut,
    ring(body, 14, { id: 'kettle-ring-foot' }),
    ring(body, 18, { id: 'kettle-ring-base' }),
    ring(body, 92, { id: 'kettle-ring-waist' }),
    ring(body, 97, { id: 'kettle-ring-rim' }),
    line([surfacePoint(body, 30, 14), surfacePoint(body, 30, 97)], { on: 'kettle', face: 'wrap', id: 'kettle-weld' }),
    line([surfacePoint(body, 150, 14), surfacePoint(body, 150, 97)], { on: 'kettle', face: 'wrap', id: 'kettle-weld-back' }),
    band(body, 40, 72, { from: 20, to: 40, material: 'glass', id: 'level-window' }),
    line(arcPoints(body, 20, 40, 40), { on: 'kettle', face: 'wrap', id: 'level-frame-low' }),
    line(arcPoints(body, 20, 40, 72), { on: 'kettle', face: 'wrap', id: 'level-frame-high' }),
    line([surfacePoint(body, 20, 40), surfacePoint(body, 20, 72)], { on: 'kettle', face: 'wrap', id: 'level-edge-low' }),
    line([surfacePoint(body, 40, 40), surfacePoint(body, 40, 72)], { on: 'kettle', face: 'wrap', id: 'level-edge-high' }),
    ...[46, 52, 58, 64, 70].map((z, i) => line(arcPoints(body, 22, 30, z), { on: 'kettle', face: 'wrap', id: `level-mark-${i}` })),
    topRing(body, 27.5, { z: 100, id: 'kettle-rim-in' }),
    topRing(body, 29.2, { z: 100, id: 'kettle-rim-out' }),
    element,
    ...Array.from({ length: 9 }, (_, i) => topRing(element, 3 + i * 2, { id: `element-coil-${i + 1}` })),
    ring(element, 16, { id: 'element-band' }),
    // Central fixing nut, the thermostat disc and the terminal block with its two screws, all on the element.
    box({ at: [CX - 3, CY - 3, 17.5], size: [6, 6, 2], round: true, material: 'steel', inside: 'kettle', rests: 'element', id: 'element-nut' }),
    ring(box({ at: [CX - 3, CY - 3, 17.5], size: [6, 6, 2], round: true, material: 'steel', id: 'element-nut' }), 18.5, { id: 'element-nut-ring' }),
    disc([CX + 4, CY + 6, 17.5], { on: 'element', face: 'top', r: 2.6, material: 'steel', id: 'element-thermostat' }),
    // Two terminal pins, one at each end of the element, each with two screws on top.
    ...[[CX - 20, 'terminal-left'], [CX + 16, 'terminal-right']].flatMap(([x0, tid], k) => [
      box({ at: [x0, CY - 10, 17.5], size: [4, 20, 3], material: 'white', inside: 'kettle', rests: 'element', id: tid }),
      disc([x0 + 2, CY - 5, 20.5], { on: tid, face: 'top', r: 0.9, material: 'steel', id: `terminal-screw-${k}-a` }),
      disc([x0 + 2, CY + 5, 20.5], { on: tid, face: 'top', r: 0.9, material: 'steel', id: `terminal-screw-${k}-b` }),
    ]),
    water,
    topRing(water, 26, { z: 62.5, id: 'water-surface' }),
    topRing(water, 25, { z: 62.5, id: 'water-meniscus' }),
    ring(water, 62.5, { id: 'water-line' }),
    ring(water, 14.5, { id: 'water-floor' }),
    bubble,
    ring(bubble, 24.5, { id: 'bubble-rim' }),
    // The outside parts that stand on the jug's wall (handle on the right), and the lid on top.
    ...handleParts,
    ...barScrews,
    ...lidParts,
    ...lidExtras,
    ...ventSlots(103, 'closed'),
    ...ventSlots(151, 'open'),
  ];
  return parts.map((s) => {
    const t = { ...s };
    if (t.at) t.at = [t.at[0], t.at[1], t.at[2] + DZ];
    if (t.points) t.points = t.points.map(lift);
    return t;
  });
}

const RENDER = { requiredParts: REQUIRED_PARTS, title: FIG_TITLE };

/** Both states, four views each: what the page shows and what lint checks. Shapes with `when` show in their state only. */
export function kettleStates() {
  const all = scene();
  return Object.fromEntries(STATES.map((name, i) => [name, renderViews(all.filter((s) => s.when === undefined || s.when === name), { ...RENDER, labels: labelsFor(name), idPrefix: `fc${'ab'[i]}` })]));
}

/** Lint of every state and view, plus the cards under the figure. */
export function kettleLint() {
  const r = lintStates(kettleStates());
  const c = lintCards(CARDS, LABELS);
  return { errors: [...r.errors, ...c.errors], warnings: [...r.warnings, ...c.warnings] };
}

/** The standalone front view (the open state, view 1): the SVG file. */
export function frontSvg(states) {
  return states.open[0].svg + '\n';
}

/** The page: one self-contained HTML file. */
function page(figure) {
  if (typeof figure !== 'string' || !figure.startsWith('<div class="fc-orbit"')) throw new TypeError('page: orbit markup required');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<script>try{var t=localStorage.getItem('fc-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
<style>
${tokensCss()}*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-size:1.4rem;line-height:1.25;margin:0;font-weight:600}
.kicker{color:var(--muted);font-size:.8rem;margin:0 0 4px;letter-spacing:.06em}
button{font:inherit;font-size:.85rem;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:5px 12px;cursor:pointer}
button:hover{border-color:var(--line-strong)}
button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
.lede{color:var(--muted);max-width:60ch}
figure{margin:20px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:14px}
figcaption{color:var(--muted);font-size:.9rem;margin-top:10px;text-align:center}
.paused svg *{animation-play-state:paused!important}
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p class="lede">${IDEA}</p>
<figure id="fig">
${figure}
<figcaption>Hover or tap a part to see its name. Turn it to see every side, and close it to see it as it stands. <button type="button" id="play" aria-pressed="true">Pause motion</button></figcaption>
</figure>
${cardsHtml(CARDS)}
</main>
<script>
(function(){
  var root=document.documentElement, tb=document.getElementById('theme'), pb=document.getElementById('play'), fig=document.getElementById('fig');
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':mq.matches;}
  function sync(){var d=isDark();tb.textContent=d?'Light theme':'Dark theme';tb.setAttribute('aria-pressed',String(d));}
  tb.addEventListener('click',function(){var next=isDark()?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('fc-theme',next);}catch(e){}sync();});
  if(mq.addEventListener)mq.addEventListener('change',sync);
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){pb.hidden=true;}
  pb.addEventListener('click',function(){var p=fig.classList.toggle('paused');pb.textContent=p?'Play motion':'Pause motion';pb.setAttribute('aria-pressed',String(!p));});
  sync();
})();
</script>
</body>
</html>
`;
}

/** Build the page and the SVG from the engine, lint included. */
export function build() {
  const states = kettleStates();
  const report = kettleLint();
  const html = page(orbitHtml(states, { label: 'Electric kettle', stateLabels: { open: 'Open it', closed: 'Close it' } }));
  return { html, svg: frontSvg(states), report };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { html, svg, report } = build();
  const at = (p) => fileURLToPath(new URL(p, import.meta.url));
  writeFileSync(at(`./${SLUG}.html`), html);
  writeFileSync(at(`./${SLUG}.svg`), svg);
  writeFileSync(at('./lint-report.json'), JSON.stringify({ errors: report.errors, warnings: report.warnings }, null, 2) + '\n');
  console.log(`errors: ${report.errors.length}, warnings: ${report.warnings.length}`);
  for (const e of report.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
  for (const w of report.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
  if (report.errors.length) process.exitCode = 1;
}

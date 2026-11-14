/**
 * Builds the CDN edge cache figure for this run from the figure-craft engine.
 * Writes only into this run's output folder. Node ESM, stdlib only.
 *
 * Steps:
 *  1. Import the skill's own demo builder (buildDemo) and the engine (renderSvg, box, dot, lint).
 *  2. Rebuild the same shape model here (buildDemo does not export its model) and prove it
 *     renders byte-identical SVG to buildDemo's page, so lint runs on the real figure.
 *  3. Run lint(model) and write the results.
 *  4. Write the self-contained page, the cover svg and the lint report.
 */
import { writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const SKILL = '/home/user/Skill-Foundry/src/skills/figure-craft';
const OUT = fileURLToPath(new URL('.', import.meta.url));
const engine = (p) => import(pathToFileURL(`${SKILL}/${p}`).href);

const { box, dot, renderSvg, layoutLabels, labelBox, FONT_SIZE, LABEL_GAP } = await engine('engine/iso.mjs');
const { lint } = await engine('engine/lint.mjs');
const { buildDemo, DEMO_FONT_SIZE } = await engine('examples/build-demo.mjs');

// Same shapes as examples/build-demo.mjs `shapes(true)`, with the same labels and font size.
const shapes = [
  box({ at: [0, 0, 0], size: [160, 60, 4], r: 4, id: 'ground' }),
  box({ at: [8, 22, 4], size: [18, 18, 16], id: 'client' }),
  box({ at: [30, 26, 4], size: [8, 8, 8], id: 'request', move: [26, 0, 0], delay: 0 }),
  box({ at: [64, 14, 4], size: [32, 32, 36], tone: 'ink', id: 'edge' }),
  box({ at: [128, 14, 4], size: [24, 32, 52], id: 'origin' }),
  dot([80, 30, 40], { face: 'top', on: 'edge', tone: 'ok' }),
];
const labels = [
  { at: [17, 31, 20], text: 'Client', side: 'l' },
  { at: [34, 30, 12], text: 'Request', side: 'l' },
  { at: [80, 30, 50], text: 'Edge cache', side: 'r' },
  { at: [140, 30, 56], text: 'Origin (skipped)', side: 'r' },
];
const TITLE = 'How a CDN edge cache serves a request';
const FIG_TITLE = 'A request travels from the client to the edge cache, which answers it without asking the origin.';

const { demoHtml, coverSvg } = buildDemo();
const { svg, model } = renderSvg(shapes, { labels, title: FIG_TITLE, fontSize: DEMO_FONT_SIZE });

const svgInPage = demoHtml.slice(demoHtml.indexOf('<svg'), demoHtml.indexOf('</svg>') + '</svg>'.length);
const parity = svgInPage === svg;
if (!parity) throw new Error('rebuilt figure differs from buildDemo output; lint would not check the real figure');

const result = lint(model);

// Label size check from layout.md: fontSize * availableWidth / viewBoxWidth >= 11 at 390px.
// Page: main padding 16px each side, figure padding 8px (<=480px) and 1px border each side.
const available = 390 - 2 * 16 - 2 * 8 - 2 * 1;
const [, , vbW] = model.viewBox;
const renderedLabelPx = (DEMO_FONT_SIZE * Math.min(available, 560)) / vbW;

const report = {
  figure: 'figure-craft: CDN edge cache',
  idea: FIG_TITLE,
  viewBox: model.viewBox,
  parity: { demoSvgMatchesEngineRender: parity },
  labelPxAt390: Math.round(renderedLabelPx * 100) / 100,
  labelPxOk: renderedLabelPx >= 11,
  errors: result.errors,
  warnings: result.warnings,
  animations: model.animations,
  fills: model.fills,
  strokes: model.strokes,
};

writeFileSync(`${OUT}cdn-edge-cache.html`, demoHtml);
writeFileSync(`${OUT}cover.svg`, coverSvg);
writeFileSync(`${OUT}lint-report.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ parity, viewBox: model.viewBox, labelPxAt390: report.labelPxAt390, errors: result.errors.length, warnings: result.warnings.length }));

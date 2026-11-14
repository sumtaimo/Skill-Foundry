/**
 * Runs a skill's evals/cases.json against a produce(prompt) function.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} skillDir
 * @param {(prompt:string)=>{text:string,files?:string[]}} produce
 */
export function runEvals(skillDir, produce) {
  if (typeof skillDir !== 'string' || !skillDir) throw new TypeError('runEvals: skillDir required');
  if (typeof produce !== 'function') throw new TypeError('runEvals: produce function required');
  const cases = JSON.parse(readFileSync(join(skillDir, 'evals', 'cases.json'), 'utf8'));
  if (!Array.isArray(cases)) throw new TypeError('runEvals: cases.json must be an array');
  const results = cases.map((c) => {
    const failures = [];
    const out = produce(c.prompt) ?? {};
    const text = String(out.text ?? '');
    const files = Array.isArray(out.files) ? out.files : [];
    for (const e of c.expect ?? []) {
      if (e.type === 'contains') {
        if (!text.includes(e.value)) failures.push(`missing text: ${e.value}`);
      } else if (e.type === 'notContains') {
        if (text.includes(e.value)) failures.push(`unexpected text: ${e.value}`);
      } else if (e.type === 'maxLines') {
        const n = text.split('\n').length;
        if (n > e.value) failures.push(`too many lines: ${n} > ${e.value}`);
      } else if (e.type === 'fileExists') {
        if (!files.includes(e.value)) failures.push(`missing file: ${e.value}`);
      } else failures.push(`unknown expect type: ${e.type}`);
    }
    return { id: c.id, ok: failures.length === 0, failures };
  });
  const passed = results.filter((r) => r.ok).length;
  return { passed, failed: results.length - passed, results };
}

/**
 * Minimal deterministic ZIP writer/reader (deflate, no extra fields).
 * @governed-by PO_ARCHITECT
 */
import { deflateRawSync, inflateRawSync } from 'node:zlib';

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

/** @param {Buffer|Uint8Array} buf @returns {number} unsigned CRC-32 */
export function crc32(buf) {
  if (!(buf instanceof Uint8Array)) throw new TypeError('crc32: buffer required');
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const DOS_TIME = 0;
const DOS_DATE = 0x0021;

/** @param {{path:string,data:Buffer}[]} entries @returns {Buffer} */
export function makeZip(entries) {
  if (!Array.isArray(entries)) throw new TypeError('makeZip: entries array required');
  const norm = entries.map((e) => {
    if (typeof e?.path !== 'string' || !e.path) throw new TypeError('makeZip: entry path required');
    return { path: e.path.replace(/\\/g, '/'), data: Buffer.isBuffer(e.data) ? e.data : Buffer.from(e.data ?? '') };
  });
  norm.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { path, data } of norm) {
    const name = Buffer.from(path, 'utf8');
    const comp = deflateRawSync(data);
    const crc = crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6);
    lh.writeUInt16LE(8, 8); lh.writeUInt16LE(DOS_TIME, 10); lh.writeUInt16LE(DOS_DATE, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(8, 10); ch.writeUInt16LE(DOS_TIME, 12);
    ch.writeUInt16LE(DOS_DATE, 14); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(offset, 42);
    locals.push(lh, name, comp);
    centrals.push(ch, name);
    offset += 30 + name.length + comp.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(norm.length, 8); end.writeUInt16LE(norm.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

/** @param {Buffer} buf @returns {{path:string,data:Buffer}[]} */
export function readZip(buf) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('readZip: Buffer required');
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('readZip: end of central directory not found');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('readZip: bad central header');
    const method = buf.readUInt16LE(p + 10);
    const crc = buf.readUInt32LE(p + 16);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const loff = buf.readUInt32LE(p + 42);
    const path = buf.subarray(p + 46, p + 46 + nlen).toString('utf8');
    const start = loff + 30 + buf.readUInt16LE(loff + 26) + buf.readUInt16LE(loff + 28);
    const raw = buf.subarray(start, start + csize);
    const data = method === 8 ? inflateRawSync(raw) : Buffer.from(raw);
    if (crc32(data) !== crc) throw new Error(`readZip: CRC mismatch in ${path}`);
    out.push({ path, data });
    p += 46 + nlen + xlen + clen;
  }
  return out;
}

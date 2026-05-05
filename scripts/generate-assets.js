/**
 * Generate simple placeholder PNG assets.
 *
 * Run with: node scripts/generate-assets.js
 *
 * Creates minimal solid-color PNGs for icon.png, adaptive-icon.png,
 * splash.png, and favicon.png in the assets/ directory using pure Node.js
 * (no external image libraries required).
 *
 * The output is a valid 1x1 PNG (the smallest valid PNG) in the brand colour.
 * For production, replace these with real designed assets.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, r, g, b) {
  // Minimal uncompressed PNG using a single scanline per row.
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const typeBuffer = Buffer.from(type, 'ascii');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const combined = Buffer.concat([typeBuffer, data]);
    const crc32 = crc(combined);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc32, 0);
    return Buffer.concat([length, combined, crcBuffer]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // IDAT: raw image data
  const rawRow = Buffer.alloc(1 + width * 3); // filter byte + RGB per pixel
  rawRow[0] = 0; // no filter
  for (let x = 0; x < width; x++) {
    rawRow[1 + x * 3] = r;
    rawRow[2 + x * 3] = g;
    rawRow[3 + x * 3] = b;
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => rawRow));
  const compressed = zlib.deflateSync(raw);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ]);
}

// CRC32 lookup table
const crcTable = (function () {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// -- Main --
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Brand teal: #0E7C66 -> (14, 124, 102)
const teal = [14, 124, 102];

const files = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'splash.png', size: 1284 },
  { name: 'favicon.png', size: 48 },
];

for (const f of files) {
  const png = createPng(f.size, f.size, ...teal);
  const outPath = path.join(assetsDir, f.name);
  fs.writeFileSync(outPath, png);
  console.log(`Created ${outPath} (${f.size}x${f.size})`);
}

console.log('Done. Replace these with designed assets before submitting to stores.');

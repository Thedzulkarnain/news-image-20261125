// Copy the submitted front page image to /output/entry.png, verifying byte identity.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'art.png');
const outDir = '/output';
const out = join(outDir, 'entry.png');

const original = readFileSync(src);
mkdirSync(outDir, { recursive: true });
writeFileSync(out, original);

const copied = readFileSync(out);
if (!copied.equals(original)) {
  console.error('copied bytes differ from art.png');
  process.exit(1);
}

// The entry must be exactly 1024x1024: PNG signature (8 bytes), then the IHDR
// chunk; image width is a big-endian uint32 at offset 16, height at offset 20.
if (copied.length < 24 || copied.readUInt32BE(16) !== 1024 || copied.readUInt32BE(20) !== 1024) {
  console.error('entry.png is not 1024x1024');
  process.exit(1);
}
console.log(`wrote ${out} (${copied.length} bytes, 1024x1024)`);

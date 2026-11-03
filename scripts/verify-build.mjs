import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)].map(
  (match) => match[1],
);

assert.ok(scripts.length > 0, 'Production HTML must load a compiled JavaScript entry.');

for (const source of scripts) {
  assert.match(source, /^\/assets\/.+\.js$/, `Unbuilt or unexpected script in dist: ${source}`);
  assert.ok(
    (await stat(path.join(outputDirectory, source.slice(1)))).isFile(),
    `Compiled script is missing: ${source}`,
  );
}

assert.doesNotMatch(
  html,
  /\/src\/|\.tsx?["']/,
  'Production HTML must never load TypeScript source.',
);
console.log(
  'Production entry verified: dist/index.html loads existing compiled JavaScript assets.',
);

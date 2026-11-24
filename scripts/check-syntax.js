import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
function getJsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? getJsFiles(path) : (path.endsWith('.js') ? [path] : []);
  });
}
let checked = 0;
for (const file of [...getJsFiles('src'), ...getJsFiles('migrations')]) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(1);
  checked += 1;
}
console.log(`OK: ${checked} file JavaScript lolos pemeriksaan sintaks.`);

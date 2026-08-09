// Vercel's static deployment silently strips any directory literally named
// "node_modules" from the upload, at any depth — including
// dist/assets/node_modules, where Expo's web export puts bundled font files.
// That made every custom font 404 in production, which left the whole app on
// a permanent blank screen (app/_layout.tsx returns null until fonts load).
// This renames that folder and patches the one JS bundle that references it.
// Run after every `expo export --platform web`, before `vercel deploy`.

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const oldDir = path.join(distDir, 'assets', 'node_modules');
const newDir = path.join(distDir, 'assets', 'fonts-cdn');

if (fs.existsSync(oldDir)) {
  fs.renameSync(oldDir, newDir);
  console.log('Renamed dist/assets/node_modules -> dist/assets/fonts-cdn');
} else if (!fs.existsSync(newDir)) {
  console.warn('WARNING: neither dist/assets/node_modules nor dist/assets/fonts-cdn found — did the export layout change?');
}

const jsDir = path.join(distDir, '_expo', 'static', 'js', 'web');
let patchedCount = 0;
if (fs.existsSync(jsDir)) {
  for (const file of fs.readdirSync(jsDir)) {
    if (!file.endsWith('.js')) continue;
    const filePath = path.join(jsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('assets/node_modules')) {
      fs.writeFileSync(filePath, content.split('assets/node_modules').join('assets/fonts-cdn'));
      patchedCount++;
    }
  }
}
console.log(`Patched ${patchedCount} JS bundle(s) to reference assets/fonts-cdn`);

// vercel.json isn't picked up from the project root when deploying the
// dist/ subdirectory directly — Vercel only reads it from the deploy target.
fs.copyFileSync(path.join(__dirname, '..', 'vercel.json'), path.join(distDir, 'vercel.json'));
console.log('Copied vercel.json into dist/');

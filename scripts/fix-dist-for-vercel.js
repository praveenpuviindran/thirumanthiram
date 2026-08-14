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

const oldDirExists = fs.existsSync(oldDir);
const newDirExists = fs.existsSync(newDir);

if (oldDirExists) {
  fs.renameSync(oldDir, newDir);
  console.log('Renamed dist/assets/node_modules -> dist/assets/fonts-cdn');
} else if (newDirExists) {
  // Benign, idempotent case: a previous run of this script already did the
  // rename (e.g. someone re-ran the script by hand without re-exporting).
  // Nothing left to do here — do not treat this as a failure.
  console.log('dist/assets/fonts-cdn already exists and dist/assets/node_modules is absent — already renamed, skipping (idempotent re-run).');
} else {
  console.error(
    [
      'ERROR: fix-dist-for-vercel.js expected to find either',
      `  ${oldDir}  (fresh \`expo export --platform web\` output), or`,
      `  ${newDir}  (already renamed by a previous run of this script)`,
      'but found neither.',
      '',
      'This script exists to prevent shipping a blank-screen web build: Vercel',
      'silently strips any folder literally named "node_modules" from the',
      'deploy, which breaks custom fonts unless that folder is renamed first.',
      'Since neither expected path exists, the Expo web export layout has',
      'likely changed, and this script cannot safely guess where the font',
      'assets now live — continuing would risk deploying a broken build',
      'that looks like it succeeded.',
      '',
      'Next steps:',
      '  1. Run `expo export --platform web` fresh and inspect dist/assets/',
      '     to see where the font files actually landed.',
      '  2. Update oldDir/newDir at the top of scripts/fix-dist-for-vercel.js',
      '     to match the new layout.',
      '  3. Re-run `npm run build:web`.',
    ].join('\n')
  );
  process.exit(1);
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

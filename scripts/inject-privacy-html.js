// expo-router's web export produces a byte-identical client-side-only SPA
// shell for every route (no content in the raw HTML, everything renders after
// the JS bundle hydrates). That's invisible to human visitors but means any
// crawler that doesn't execute JavaScript — including Google Play's privacy
// policy validator — sees a blank page at /privacy no matter what URL is
// registered. This overwrites dist/privacy.html with a real, dependency-free
// static page carrying the actual policy text, so it's readable without JS.
//
// Content MUST be kept in sync with app/privacy.tsx's SECTIONS array — this
// is the same policy, just also rendered as a plain crawlable page.
// Run after every `expo export --platform web`, before `vercel deploy`.

const fs = require('fs');
const path = require('path');

const SECTIONS = [
  {
    title: 'Overview',
    body: `Thirumanthiram is a reading app for the sacred Tamil text of the same name. This policy explains what information the app does — and does not — collect.`,
  },
  {
    title: 'Data We Collect',
    body: `The app has no user accounts, no analytics, and no advertising or tracking SDKs. We do not operate any server that receives or stores your data. The app does make a small number of outbound network requests as part of normal use — to check for app updates and to stream verse audio — and, like any internet connection, those requests expose your device's IP address to the third party being contacted (Apple, or the audio host). See "Permissions" and "Third Parties" below for details. We do not collect, and have no way to see, anything you type into the app.`,
  },
  {
    title: 'Data Stored On Your Device',
    body: `Your favourites, app settings (font size, theme, language display options), and any notes you write on a verse are saved locally on your device using standard on-device storage. This information never leaves your device and is not accessible to us or to any third party.`,
  },
  {
    title: 'Permissions',
    body: `The app requests internet access for three purposes: (1) streaming verse audio recordings hosted at kvnthirumoolar.com, (2) checking the App Store for a newer app version on iOS launch, and (3) opening links you tap — such as source references or the feedback email — in your browser or email app. No other device permissions are used.`,
  },
  {
    title: 'Third Parties',
    body: `The app does not integrate any third-party analytics, advertising, or tracking services. It does contact two third-party services as part of normal functionality: Apple's App Store (to check for updates, iOS only) and kvnthirumoolar.com (to stream verse audio). Each such request is subject to that third party's own privacy practices. Tapping a "Sources & References" link or the feedback email address opens your browser or email app and is entirely under your control.`,
  },
  {
    title: 'Feedback',
    body: `The Feedback tab and the Settings "Email" link open your device's own email app, pre-addressed to thirumanthiram2026@gmail.com. Anything you choose to write — including your name if you provide it — is sent from your own email account, the same as composing any other email. The app itself does not transmit or store this content.`,
  },
  {
    title: 'Children’s Privacy',
    body: `The app contains no objectionable content and does not knowingly collect information from anyone, including children.`,
  },
  {
    title: 'Changes to This Policy',
    body: `If this policy changes, the update will be posted on this page with a revised date below.`,
  },
  {
    title: 'Contact',
    body: `Questions about this policy can be sent to thirumanthiram2026@gmail.com.`,
  },
];

const LAST_UPDATED = 'September 17, 2026';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const sectionsHtml = SECTIONS.map(
  (s) => `
    <section>
      <h2>${escapeHtml(s.title)}</h2>
      <p>${escapeHtml(s.body)}</p>
    </section>`
).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Privacy Policy — Thirumanthiram</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px 80px; color: #2a1a10; background: #FBF6EE; line-height: 1.6; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  .updated { color: #7a6a58; font-size: 14px; margin-bottom: 32px; }
  h2 { font-size: 17px; border-left: 3px solid #D4700A; padding-left: 10px; margin-top: 28px; margin-bottom: 8px; }
  p { font-size: 15px; margin: 0; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e0d6c8; color: #7a6a58; font-size: 13px; text-align: center; }
</style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="updated">Last updated: ${LAST_UPDATED}</p>
  ${sectionsHtml}
  <footer>Thirumanthiram App &middot; Made by Praveen Puviindran</footer>
</body>
</html>
`;

const distDir = path.join(__dirname, '..', 'dist');
const outPath = path.join(distDir, 'privacy.html');

if (!fs.existsSync(distDir)) {
  console.error(`ERROR: ${distDir} does not exist — run \`expo export --platform web\` first.`);
  process.exit(1);
}

fs.writeFileSync(outPath, html);
console.log(`Wrote static, crawlable privacy policy to ${outPath}`);

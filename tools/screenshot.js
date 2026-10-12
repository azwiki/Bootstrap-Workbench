// screenshot.js: regenerates the hero screenshots of index.html (dev tool, not part of any
// demo fragment and never loaded by the pages).
//
// Captures classes.html above the fold (1440x900 CSS px at 2x device pixel ratio, so
// 2880x1800 px) in light and dark mode and writes optimized WebP files:
//   assets/img/hero/classes-light.webp
//   assets/img/hero/classes-dark.webp
// The theme is chosen the way the demo pages remember it: localStorage "bsd-theme".
// index.html references these files by their absolute GitHub Pages URL, so new
// screenshots show up on the home page after they are pushed.
//
// Run from anywhere:
//   NODE_PATH=~/pw/node_modules node tools/screenshot.js
// Dependencies: Node.js, the Playwright package (installed outside the repo, see
// tools/spytest.js), Google Chrome, and cwebp (brew install webp). The installed Chrome is
// used, so no Playwright browser download is needed; set PW_CHANNEL=chromium to use
// Playwright's own Chromium instead.

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets/img/hero');
const page = 'file://' + path.join(root, 'classes.html');
const QUALITY = '80';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bw-shot-'));
  const channel = process.env.PW_CHANNEL || 'chrome';
  const browser = await chromium.launch(channel === 'chromium' ? {} : { channel });
  try {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      await context.addInitScript((t) => { try { localStorage.setItem('bsd-theme', t); } catch (e) { /* ignore */ } }, theme);
      const tab = await context.newPage();
      await tab.goto(page, { waitUntil: 'networkidle' });
      await tab.evaluate(() => document.fonts.ready);
      const png = path.join(tmp, theme + '.png');
      await tab.screenshot({ path: png });
      const webp = path.join(outDir, 'classes-' + theme + '.webp');
      execFileSync('cwebp', ['-quiet', '-q', QUALITY, '-m', '6', '-metadata', 'none', png, '-o', webp]);
      console.log('screenshot: ' + path.relative(root, webp) + ' (' + Math.round(fs.statSync(webp).size / 1024) + ' KB)');
      await context.close();
    }
  } finally {
    await browser.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
})().catch((err) => { console.error(err); process.exit(1); });

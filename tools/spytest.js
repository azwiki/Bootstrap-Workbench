// spytest.js: checks the sidebar scrollspy on the demo pages (dev tool, not part of the
// #bs-demo fragment).
//
// For classes.html and forms.html, in Chromium and WebKit, at 1400px and 576px width and each
// window height given:
//  - load: the first section's link is active;
//  - clicking every sidebar link (element.click(), waits for the smooth scroll to settle)
//    makes that link active;
//  - plain scrolling to the bottom in 60px steps activates every section in page order,
//    and scrolling back up activates them in reverse order.
//
// Run from the repo root:
//   NODE_PATH=/path/to/node_modules node tools/spytest.js [heights] [pages]
//   e.g. NODE_PATH=~/pw/node_modules node tools/spytest.js 700,900,1200 classes,forms
// Defaults: heights 700,900,1200; pages classes,forms.
//
// Dependencies: Node.js and the Playwright package with its Chromium and WebKit browsers.
// Neither is part of this repo (no package.json, no build step). Install once in any folder
// outside the repo:
//   mkdir ~/pw && cd ~/pw && npm init -y && npm i playwright && npx playwright install chromium webkit
// then point NODE_PATH at that folder's node_modules. Results are printed and written to
// spytest-results.json in the current directory (do not commit it).

const path = require('path');
const fs = require('fs');
const { chromium, webkit } = require('playwright');

const root = 'file://' + path.resolve(__dirname, '..') + '/';
const heights = (process.argv[2] || '700,900,1200').split(',').map(Number);
const pages = (process.argv[3] || 'classes,forms').split(',');

async function settle(page) {
  // Wait until scrollY stops changing (smooth scroll finished)
  let last = -1;
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) break;
    last = y;
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(150);
}

(async () => {
  const results = [];
  for (const [name, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch();
    for (const pageName of pages) for (const width of [1400, 576]) for (const height of heights) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(root + pageName + '.html');
      await page.waitForTimeout(400);
      const order = await page.evaluate(() => [...document.querySelectorAll('#bsd-nav a')].map(a => a.getAttribute('href')));
      const active = () => page.evaluate(() => [...document.querySelectorAll('#bsd-nav a.active')].map(a => a.getAttribute('href')).join(' ') || null);

      const onLoad = await active();

      // Clicks (element.click() also works while the offcanvas is closed below lg)
      const clickFails = [];
      for (const href of order) {
        await page.evaluate(h => document.querySelector(`#bsd-nav a[href="${h}"]`).click(), href);
        await settle(page);
        const a = await active();
        if (a !== href) clickFails.push(`${href}→${a}`);
      }

      // Plain scrolling in 60px steps: down from the top, then back up
      const scan = async (from, to, step) => {
        const seen = [];
        const push = a => { if (a && seen[seen.length - 1] !== a) seen.push(a); };
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), from);
        await page.waitForTimeout(300);
        push(await active());
        for (let y = from + step; step > 0 ? y < to + step : y > to + step; y += step) {
          await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
          await page.waitForTimeout(35);
          push(await active());
        }
        await page.waitForTimeout(300);
        push(await active());
        return seen;
      };
      const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const down = await scan(0, max, 60);
      const up = await scan(max, 0, -60);
      const downOk = JSON.stringify(down) === JSON.stringify(order);
      const upOk = JSON.stringify(up) === JSON.stringify([...order].reverse());

      const pass = onLoad === order[0] && clickFails.length === 0 && downOk && upOk && errors.length === 0;
      results.push({ name, pageName, width, height, pass, onLoad, clickFails, downOk, upOk,
        down: downOk ? undefined : down, up: upOk ? undefined : up, errors });
      await page.close();
    }
    await browser.close();
  }
  fs.writeFileSync('spytest-results.json', JSON.stringify(results, null, 1));
  for (const r of results) {
    console.log([r.name, r.pageName, r.width + 'x' + r.height, r.pass ? 'PASS' : 'FAIL',
      'load:' + r.onLoad, 'clickFails:' + JSON.stringify(r.clickFails),
      'down:' + (r.downOk ? 'ok' : JSON.stringify(r.down)), 'up:' + (r.upOk ? 'ok' : JSON.stringify(r.up)),
      r.errors.length ? 'errors:' + JSON.stringify(r.errors) : ''].join(' '));
  }
  process.exitCode = results.every(r => r.pass) ? 0 : 1;
})();

# Bootstrap-Workbench

Demo pages with every standard Bootstrap 5.3.8 class, for auditing custom themes. Load a page
with your theme's CSS and see at a glance which classes the theme leaves unstyled.

- [Project website](https://azwiki.github.io/bootstrap-workbench/)
- [GitHub repository](https://github.com/azwiki/bootstrap-workbench)

## Pages

- `index.html`: project home page with a component playground (`<section id="bw-demo">`).
- `classes.html`: classes and utilities.
- `blocks.html`: interactive components and ready-made page blocks.
- `forms.html`: all form examples.

## Use it on your theme

1. Copy a page into your project.
2. Put your theme in `assets/css/main.css` next to it, or point that `<link>` at your stylesheet:
   `<link rel="stylesheet" href="assets/css/main.css">`
3. Open the page in a browser (file:// works, no build step).
4. Anything that still looks like stock Bootstrap is a class your theme does not cover.

Bootstrap 5.3.8 and Bootstrap Icons load from jsDelivr (pinned, with SRI); sample images come
from picsum.photos. For offline use, switch to the commented-out local Bootstrap lines.

## Development

No build step. Dev-only tools live in `tools/` and are never loaded by the pages.

- `zsh tools/sync-demo.sh`: inlines `assets/js/bsd-demo.js` into classes/forms/blocks and
  `assets/js/demo-init.js` into index.html, between their marker comments. Edit the files in
  `assets/js/`, never the inline copies.
- Playwright for the Node tools is installed outside the repo, once:
  `mkdir ~/pw && cd ~/pw && npm init -y && npm i playwright && npx playwright install chromium webkit`
- `NODE_PATH=~/pw/node_modules node tools/spytest.js`: sidebar scrollspy test.

### Hero screenshots

The home page hero shows `assets/img/hero/classes-light.webp` / `classes-dark.webp`
(classes.html above the fold, 1440×900 at 2× DPR, light and dark). Regenerate both with:

```sh
NODE_PATH=~/pw/node_modules node tools/screenshot.js
```

Needs Playwright (above) and `cwebp` (`brew install webp`). index.html references the files by
their absolute GitHub Pages URL, so new screenshots appear on the home page after a push.

## License

MIT, see [LICENSE](LICENSE).

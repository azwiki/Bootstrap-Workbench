# Bootstrap-demo

Demo/cheatsheet pages for auditing custom themes built on top of Bootstrap.
Purpose: paste the demo content into any Bootstrap site and instantly see which
standard classes the custom theme fails to cover (colors, bg-*, outline buttons, etc.).

## Stack
- Bootstrap 5.3.8 from jsDelivr, pinned, with SRI (integrity + crossorigin="anonymous"):
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css and
  .../dist/js/bootstrap.bundle.min.js. The identical local copies (assets/css/bootstrap.min.css,
  assets/js/bootstrap.bundle.min.js) appear in the pages only as commented-out fallback lines.
- assets/css/main.css (relative path) is the only local reference in the demo pages, so any
  single page copied into another folder together with main.css works.
- Check the exact version in the bootstrap.min.css header and use ONLY classes that exist in it.
  Exception: JS hook classes that the local bootstrap.bundle.min.js itself tests for
  (e.g. carousel `slide`), because they are part of Bootstrap's canonical markup.
- assets/css/main.css is the user's theme file. It is intentionally empty. NEVER edit it.
- Custom demo tooling (toolbar, snippet generator, token panel) must not restyle Bootstrap components.
- No external CSS/JS libraries besides the pinned Bootstrap above (plus pinned Bootstrap Icons
  on index.html only), no other CDNs, no build step
  (tools/sync-demo.sh only copies bsd-demo.js and demo-init.js into the pages). Plain HTML + vanilla JS.
  Must work via file://.

## Rules
- Use ONLY standard Bootstrap 5.3.8 classes in demo content. No custom classes in demo markup.
- Never invent classes (e.g. object-fit-top, h-400). If Bootstrap has no utility, say so.
- No inline styles in demo content. Sizing via Bootstrap only (.ratio, w-*, h-*, etc.).
  Documented exceptions (demo text must say "inline style, not a Bootstrap class"):
  a) style="object-position: top;" in the object-position comparisons (Images, Cards).
  b) style="width: N%" on .progress-bar and on .progress inside .progress-stacked
     (Bootstrap's canonical markup; the value is data).
- Demo tooling (toolbar, snippet generator, token panel, their JS) is exempt from the
  inline-styles rule, but must still not restyle Bootstrap components.
- Do NOT use LiveCanvas wrappers (lc-block, editable="rich").
- All code comments in English.
- demo-old.html is a READ-ONLY reference. Never edit it. Do not reuse its image URLs (Unsplash).
- Images: picsum.photos only, fixed IDs, WebP format:
  https://picsum.photos/id/{id}/{w}/{h}.webp
  No .jpg URLs, no gray placeholders, no random (non-ID) URLs.
  IDs must be verified against https://picsum.photos/v2/list before use.
  Every URL must be verified with curl -sIL: Content-Type must be image/webp.
- Every <img> has width and height equal to the URL size, and alt.
  decoding="async" on all images; loading="lazy" only below the first screen
  (above-the-fold images such as the navbar logo get no loading="lazy").
- Semantic, accessible markup: alt text, aria attributes as in Bootstrap docs.
  Decorative images next to visible text (e.g. navbar logo) use alt="".
- Never copy example sentences or sample text from Bootstrap documentation.
  Markup patterns are fine; all visible text must be original wording.
- Use neutral demo content of your own (fictional company "Northwind Studio",
  invented product names, short original sentences).
- Snippets show only canonical copy-ready markup: no demo layout wrappers,
  no demo-only spacing classes. Use the generator attributes below to keep demo wrappers and
  demo-only classes out of a snippet. Documented exceptions: sample/swatch helper classes
  that make a sample visible (Colors, Borders & rounded, Shadows, Text colors, Utility
  scales), and snippets whose layout is the example (form layout, page blocks, grids shown as
  patterns); the demo text says so.
- Each component lives in its own section; Colors contains only color utilities.
- Write one section per edit. Keep each edit small.


## Demo content structure
- All demo content lives inside a single <main id="bs-demo"> block so it can be copied
  into the <body> of another site as one fragment.
- The fragment is <main id="bs-demo"> plus the demo script, inlined as a classic <script> right
  before </body> (after the Bootstrap bundle), between <!-- bsd-demo:start --> and
  <!-- bsd-demo:end -->. To use it on another site, copy both.
- bsd-demo.js: edit assets/js/bsd-demo.js (the single source of truth), then run
  `zsh tools/sync-demo.sh`. Never edit the inline copies in the pages.
- Planned: after the GitHub publish, replace the marker block with a <script src> from
  jsDelivr gh (https://cdn.jsdelivr.net/gh/<user>/<repo>@<tag>/assets/js/bsd-demo.js),
  pinned to a tag.
- Pages: classes.html (classes and utilities), forms.html (all form examples), blocks.html
  (interactive components and ready-made page blocks). No fixed-top / sticky on the pages.
- Each demo page sets data-bsd-page="<id>" on <main id="bs-demo"> (classes, forms, blocks);
  the id must match an entry in the PAGES list in bsd-demo.js, which then renders the toolbar
  page switch. No attribute, no switch. Remove the attribute when pasting the fragment into
  another site.
- The sidebar uses a custom scrollspy in bsd-demo.js (no data-bs-spy on <main>). Bootstrap
  ScrollSpy itself is demonstrated on blocks.html.
- tools/ holds dev-only scripts: tools/sync-demo.sh (copies bsd-demo.js and demo-init.js into
  the pages), tools/screenshot.js (hero screenshots) and tests (e.g. tools/spytest.js,
  Node + Playwright installed outside the repo). It is not part of
  the demo fragment and is never loaded by the pages.
- Demo-only JS (component inits such as tooltips/popovers, demo triggers, states without an
  HTML attribute) lives in bsd-demo.js, scoped to #bs-demo, keyed by id or data-bs-toggle,
  never inline on* handlers. Exception: a demo snippet that needs JS to work (e.g. tooltip and
  popover init, a button that shows a toast) carries its own inline <script> inside its
  data-demo element (run on DOMContentLoaded), so the copied snippet includes it. Demo forms
  never submit: no action,
  type="button" on buttons, and bsd-demo.js cancels submit inside #bs-demo.
- Each example: live render + generated code snippet (see snippet rules below).

## Snippet generator
- Example markup is wrapped in <div data-demo>...</div>.
- JS clones the inner HTML, removes demo-only attributes, pretty-prints with 2-space indent,
  escapes it, and inserts <pre><code> with a Copy button right after the example.
- The data-demo element's own attributes are not in the snippet (use them for demo layout
  or sizing). Inside it: data-demo-skip removes an element, data-demo-unwrap replaces a demo
  wrapper by its children, data-demo-drop="cls …" leaves those classes out of the element.
- Each example has an h3–h6 heading right before it; notes go above the heading.
- Snippets must never be written by hand.

## Home page (index.html)
- index.html is the project home page, not a demo page: the #bs-demo / bsd-demo.js rules above
  do not apply to it. One <main> holds the home sections and the playground
  <section id="bw-demo">.
- Same loading as the demo pages (jsDelivr, pinned, SRI, commented-out local fallbacks), plus
  Bootstrap Icons 1.13.1 from jsDelivr with SRI (index.html only). main.css is the only
  relative dependency.
- Only Bootstrap 5.3.8 and Bootstrap Icons classes. JS hooks are data-bw-* attributes, never
  classes. Exactly one <h1> (hero), no skipped heading levels; footer headings are
  <p class="h6">.
- The navbar is sticky-top (index only); demo-init.js sets scroll-padding-top to its height.
- Script: edit assets/js/demo-init.js, then run `zsh tools/sync-demo.sh`, which inlines it
  between <!-- bw-demo:start --> and <!-- bw-demo:end -->. It snapshots every
  [data-bw-snippet] section and the whole #bw-demo at parse time (before any Bootstrap init),
  adds the "</>" snippet UI styled like bsd-demo.js, the "Copy entire demo" button
  ([data-bw-copy-all]; [data-bw-skip] parts are left out), tooltips/popovers/toast
  (data-bw-toast="#id"), the theme toggle (same "bsd-theme" storage key as the demo pages),
  the footer year and the hero screenshot swap (data-bw-src-light / data-bw-src-dark).
- Hero screenshots: assets/img/hero/classes-{light,dark}.webp, made by tools/screenshot.js
  (see README), referenced by absolute GitHub Pages URL. They are content images that are not
  from picsum, on purpose.
- The stats strip numbers are counted from the pages: section[id^="bsd-"] minus the intro and
  link-only sections (classes 26 + blocks 18 + forms 8 = 52). Recount when sections change.
- Docs links point to the README on GitHub until a docs/ folder exists.
- 404.html (GitHub Pages not-found page) follows the index.html rules, but every asset and
  link is root-relative with the repo prefix (/bootstrap-workbench/...) or absolute, because
  Pages serves it for any missing path. It is not meant to work via file://. It gets
  demo-init.js through the same bw-demo markers (data-bw-path, data-bw-report hooks).
- og:image is assets/img/readme/banner.png (1280x640, absolute Pages URL), also used as the
  README banner and the GitHub social preview.

## Intentional decisions (do not flag in audits)
- The navbar brand uses the official Bootstrap logo SVG from getbootstrap.com (not picsum).
- The favicon is an inline SVG data: URI (not picsum, not a file).
- The picsum-only rule applies to content images only.
- Cross-page links and the data-bsd-page switcher are workbench navigation.
- Fragment links (#bsd-hero, #bsd-pricing, ...) inside blocks are demo links.
- IDs (bs-demo, bsd-live, bsd-navbar, ...) are unique per page; pages are never merged.
- Tooltip/popover init is document-wide on purpose (matches the Bootstrap docs).

## Workflow
- Work in phases. Stop after each phase and wait for review.
- Before large changes, show a plan first.
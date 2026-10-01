# Bootstrap-demo

Demo/cheatsheet pages for auditing custom themes built on top of Bootstrap.
Purpose: paste the demo content into any Bootstrap site and instantly see which
standard classes the custom theme fails to cover (colors, bg-*, outline buttons, etc.).

## Stack
- Bootstrap from local files only: assets/css/bootstrap.min.css, assets/js/bootstrap.bundle.min.js
- Check the exact version in the bootstrap.min.css header and use ONLY classes that exist in it.
  Exception: JS hook classes that the local bootstrap.bundle.min.js itself tests for
  (e.g. carousel `slide`), because they are part of Bootstrap's canonical markup.
- assets/css/main.css is the user's theme file. It is intentionally empty. NEVER edit it.
- Custom demo tooling (toolbar, snippet generator, token panel) must not restyle Bootstrap components.
- No external CSS/JS libraries, no CDNs, no build step. Plain HTML + vanilla JS. Must work via file://.

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
- The fragment is <main id="bs-demo"> plus assets/js/bsd-demo.js, loaded with a classic
  <script src> at the end of #bs-demo. To use it on another site, copy the file or paste its
  contents into an inline <script>.
- Pages: classes.html (classes and utilities), forms.html (all form examples), blocks.html
  (interactive components and ready-made page blocks). No fixed-top / sticky on the pages.
- Each demo page sets data-bsd-page="<id>" on <main id="bs-demo"> (classes, forms, blocks);
  the id must match an entry in the PAGES list in bsd-demo.js, which then renders the toolbar
  page switch. No attribute, no switch. Remove the attribute when pasting the fragment into
  another site.
- The sidebar uses a custom scrollspy in bsd-demo.js (no data-bs-spy on <main>). Bootstrap
  ScrollSpy itself is demonstrated on blocks.html.
- tools/ holds dev-only test scripts (e.g. tools/spytest.js, Node + Playwright installed
  outside the repo). It is not part of the demo fragment and is never loaded by the pages.
- Demo-only JS (component inits such as tooltips/popovers, demo triggers, states without an
  HTML attribute) lives in bsd-demo.js, scoped to #bs-demo, keyed by id or data-bs-toggle,
  never inline on* handlers, never in snippets. Demo forms never submit: no action,
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

## Workflow
- Work in phases. Stop after each phase and wait for review.
- Before large changes, show a plan first.
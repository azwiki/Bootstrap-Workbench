# Bootstrap-demo

Demo/cheatsheet pages for auditing custom themes built on top of Bootstrap.
Purpose: paste the demo content into any Bootstrap site and instantly see which
standard classes the custom theme fails to cover (colors, bg-*, outline buttons, etc.).

## Stack
- Bootstrap from local files only: assets/css/bootstrap.min.css, assets/js/bootstrap.bundle.min.js
- Check the exact version in the bootstrap.min.css header and use ONLY classes that exist in it.
- assets/css/main.css is the user's theme file. It is intentionally empty. NEVER edit it.
- Custom demo tooling (toolbar, snippet generator, token panel) must not restyle Bootstrap components.
- No external CSS/JS libraries, no CDNs, no build step. Plain HTML + vanilla JS. Must work via file://.

## Rules
- Use ONLY standard Bootstrap classes in demo content. No custom classes in demo markup.
- Minimal inline styles; allowed only for demo layout helpers (e.g. swatch size), never to fake component looks.
- Do NOT use LiveCanvas wrappers (lc-block, editable="rich").
- All code comments in English.
- demo-old.html is a READ-ONLY reference. Never edit it. Reuse only its image URLs.
- Images: external URLs only. First reuse URLs from demo-old.html, then picsum.photos with fixed IDs
  (https://picsum.photos/id/{id}/{w}/{h}). No gray placeholders, no random (non-ID) URLs.
- Semantic, accessible markup: alt text, aria attributes as in Bootstrap docs.
- Never copy example sentences or sample text from Bootstrap documentation.
  Markup patterns are fine; all visible text must be original wording.
- Use neutral demo content of your own (e.g. a fictional company "Northwind Studio",
  invented product names, short original sentences).
- Write one section per edit. Keep each edit small.

## Demo content structure
- All demo content lives inside a single <main id="bs-demo"> block so it can be copied
  into the <body> of another site as one fragment.
- Demo tooling script is inlined at the end of #bs-demo (so the fragment is self-contained).
- Each example: live render + generated code snippet (see snippet rules below).

## Snippet generator
- Example markup is wrapped in <div data-demo>...</div>.
- JS clones the inner HTML, removes demo-only attributes, pretty-prints with 2-space indent,
  escapes it, and inserts <pre><code> with a Copy button right after the example.
- Snippets must never be written by hand.

## Workflow
- Work in phases. Stop after each phase and wait for review.
- Before large changes, show a plan first.
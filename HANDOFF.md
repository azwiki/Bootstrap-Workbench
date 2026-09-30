# Handoff: classes.html

## Current state

Sections in `classes.html`, in page order (all listed in the sidebar):
Colors, Color modes, Text colors, Borders & rounded, Links, Buttons, Close button, Typography, Images,
Alerts, Badges, List group, Tables, Cards, Progress, Spinners, Navbar, Navs & tabs,
Pagination, Breadcrumb, Accordion, Shadows, Focus ring, Form controls.

New sections go at the position given in "Section plan" below, not always at the end.
`<!-- bsd:continue -->` marks the end of the content (after Form controls).
Every new section also needs its link in the sidebar nav (`#bsd-nav`, scrollspy).

### Color modes: done (checked headless only, awaiting browser review)
- Section `#bsd-color-modes`, right after Colors. Two local islands, side by side on lg:
  `data-bs-theme="dark"` and `data-bs-theme="light"`, each `bg-body text-body border rounded p-3`
  with an alert-info, and a card holding a badge, a link, a form control and two buttons.
- Both islands keep their scheme under either toolbar theme (checked at 1400px, light and dark
  page theme). No horizontal overflow at 500–600px (headless minimum is 500px).
- Snippet = the whole island, including the data-bs-theme wrapper (the point of the example).
- The island is `data-bs-theme="…" class="bg-body text-body border rounded p-3"`, all on the
  data-bs-theme element, no outer visual wrapper: the border uses the island scheme's
  --bs-border-color (part of the audit), and padding/rounding belong to the island.

### Images task: done (checked headless only, not yet reviewed in a real browser)
- "Images" section: img-fluid, img-thumbnail, rounded-*, avatars (32/48/64/96, border-*),
  shadows on images and thumbnails, border colors/widths, figure, alignment,
  object-fit-* (cover/contain/fill/scale/none in ratio-4x3 boxes), portrait comparison
  (object-fit-cover / cover + object-position: top / object-fit-fill), responsive
  object-fit-contain object-fit-md-cover, ratio-*, opacity-*, srcset + sizes, media object,
  anti-patterns (a) and (b).
- Cards: card-img-top on text-bg-* (8 colors), card-img-bottom, object-position comparison
  (card-img-top inside ratio-4x3), card-img-overlay (2), horizontal cards (2), card-group and
  row-cols grid with mixed aspect ratios, border-0 + shadow-*, avatars in header/body/footer.
- Shadows: shadow-* on image cards.
- List group: avatar items (static and action variants).
- Navbar: 24px image logo in all 4 navbar brands (alt="", no loading="lazy").
- Borders & rounded: rounded-circle shown as `ratio ratio-1x1 rounded-circle bg-primary`,
  sized by col-* on its data-demo element.
- Progress: note that `style="width: N%"` is an inline style, not a Bootstrap class.
- Totals: 125 `<img>` tags, 52 picsum IDs, 69 unique URLs, all `.webp`,
  all verified with curl -sIL (Content-Type: image/webp).

Checked by script: every img has width/height matching the URL, alt text and decoding="async".
The only exception is anti-pattern (b), which has no dimensions on purpose. Tags are balanced.
Snippets of the examples added in the Images task (object-fit, portrait comparison, ratio-*,
Cards comparison, anti-pattern (a)) were checked in a headless DOM dump: no row/col wrappers,
no .ratio wrapper. Older examples still have wrappers: see "Audit backlog" below.

## Status

- Last commit: "classes: Close button section" (this HANDOFF.md is part of it).
- Waiting for: user browser review of Close button.
- Start of next session: run `git log -1 --oneline` and `git status --short`.
  If the working tree is not clean, report the changes before doing anything else.

## Known issues
- Not yet reviewed in a real browser. Headless Chrome was checked at 1400px in light mode only;
  mobile width and dark mode are unchecked.
- Grid examples (object-fit-*, portrait comparison, ratio-*, Cards comparison) have one
  data-demo per column, so an opened snippet renders inside its narrow column. Accepted for now.
- Portrait ID 1027 is a tight head shot: in ratio-4x3 the object-position: top crop keeps the
  top of the head but cuts the mouth and chin. Accepted (ID 1027 is final).

- Browser review in Safari: use a Private Window or Develop → Disable Caches (with Web Inspector
  open). Safari caches the local site aggressively and can show stale HTML/CSS.

### Close button: done (checked in Playwright Chromium + WebKit, awaiting browser review)
- Section `#bsd-close-button`, currently after Buttons (Button group will go between them).
- Examples: btn-close; btn-close disabled; dark surface side by side:
  `<div data-bs-theme="dark">` with default + disabled, and btn-close-white default + disabled
  labeled "deprecated in 5.3". The `bg-dark p-3 rounded` backdrop is on the data-demo element,
  so snippets show only the buttons (and the data-bs-theme wrapper). No data-bs-dismiss.
- In a dark page theme the bg-dark backdrop matches the page background (low contrast box).

### Audit backlog (approved, fix in a separate pass; do NOT retrofit yet)
- 78 of 100 snippets contain demo layout wrappers or demo-only classes. Clean: rounded-circle,
  lead/inline text, img-fluid, img-thumbnail, all object-fit/portrait/ratio examples,
  the 3 Cards object-position cards, card-group, row-cols card grid.
- Typical problems: outer `row g-* small` + `col-*` grids (Colors, Borders, Cards, Alerts,
  Tables, Progress, Navs, Breadcrumb, Accordion, Shadows, Forms), outer `d-flex flex-wrap gap-*`
  rows (Text colors, Links, Buttons, Badges, Spinners, Pagination, Focus ring, Images),
  demo-only `p-2`/`p-3` on swatches, `mb-0`/`mb-2`/`mb-3`/`mt-2` between variants, `h-100` on
  cards, `small` on grids, `d-grid gap-2` around the navbars.
- Canonical (keep): navbar container-fluid/me-auto, horizontal card inner row g-0/col-md-*,
  list-group d-flex justify-content-between/me-auto, media object d-flex/flex-shrink-0,
  positioned badges, float/mx-auto alignment, focus-ring link classes, breadcrumb bg/p-2 example.
- Needs a decision: anti-pattern (b) side-by-side col-6 comparison.
- Colors contains only color utilities (verified); swatch helpers (p-2, border, rounded) are
  the only non-color classes.

## Decisions so far

### Snippet generator
- Example markup goes in `<div data-demo>`. The inline script clones its children, drops
  `[data-demo-skip]` elements and `data-demo*` attributes, pretty-prints with 2-space indent,
  and inserts `<pre><code>` with a Copy button after the example.
- Snippets are collapsed by default. Each example gets a `</>` toggle, placed in the preceding
  h3–h6 heading if there is one, otherwise in a small bar above the example.
- A "Show code" switch in the toolbar opens all snippets. Its state is saved in localStorage (`bsd-code`).
- Attributes on the `data-demo` element itself are not part of the snippet. The anti-pattern
  boxes use this to keep the border/overflow classes out of the copied code, and single
  examples use it for sizing (e.g. `col-3 col-sm-2 col-md-1` on the rounded-circle data-demo).
- .ratio parent rule: if data-demo's parent is `.ratio`, that wrapper is the anchor.
  The `<pre>` goes after the `.ratio`; the `</>` toggle goes in the heading before the `.ratio`,
  or, without a heading, the fallback bar goes before the `.ratio`. (Inside .ratio every child
  becomes absolute 100% x 100% and would cover the example.) The .ratio wrapper is never part
  of the snippet. Used by anti-pattern (a): `.ratio.ratio-21x9 > [data-demo].overflow-auto`.
- Grids of examples: row/col wrappers stay OUTSIDE data-demo. Each column holds an `h4.small`
  label (which receives the `</>` toggle) and its own data-demo, so snippets show only the
  component markup. Do not put col-* on data-demo elements inside a .row: the generated bar
  and snippet would become full-width row items.

- Flex rows of same-kind variants (new sections): one data-demo whose OWN classes carry the
  row layout, e.g. `<div data-demo class="d-flex flex-wrap gap-2">`. The snippet then lists
  only the variants. Works for flex rows only; col-* grids use the per-column pattern above.
- Demo-only JS (e.g. setting `.indeterminate` on a checkbox) goes in the existing inline
  tooling script and selects the element by id. No inline on* handlers.

### Section plan (decided 2026-09-30)
- Background and Link utilities: already fully covered by Colors and Links. No new sections.
  (`bg-body-emphasis` does not exist in 5.3.8.)
- Close button `#bsd-close-button`, after Button group: btn-close, disabled, dark via
  `<div data-bs-theme="dark">` (backdrop classes on the data-demo element), and btn-close-white
  labeled "deprecated in 5.3" right next to the data-bs-theme version. No data-bs-dismiss.
- Button group `#bsd-button-group`, after Buttons: btn-group solid/outline (8 colors), active item,
  mixed styles, -lg/-sm, vertical, btn-toolbar (+ input-group), checkbox/radio groups.
  Move the existing btn-group/toolbar example out of Buttons. btn-check toggle buttons STAY
  in Buttons.
- Placeholders `#bsd-placeholders`, after Spinners: placeholder, col-*/w-* widths,
  placeholder-xs/sm/lg, bg-* (8 colors), placeholder-glow, placeholder-wave, disabled button
  placeholder, loading card (aria-hidden="true"). col-* on placeholders is canonical.
- Additions to existing sections (one section per edit): Cards (card-subtitle, card-link,
  card-header-tabs/pills, list group in card), Navs (nav-justified, disabled), List group
  (list-group-horizontal-md, checkbox/radio items), Navbar (navbar-expand-lg with toggler,
  collapsed static state; form in navbar), Typography (hr, dl, address, sub/sup, var/samp,
  blockquote in figure), Tables (align-top/middle, table-responsive-md).
- Helpers `#bsd-helpers`: hstack/vstack, vr, stretched-link, text-truncate,
  visually-hidden-focusable, text-wrap/nowrap/break, text-start/center/end.
- Utility scales (compact, last): CSS-variable-driven scales (shadow-*, rounded-*, fs-*,
  opacity-*); first check what Borders/Shadows/Typography already cover, add only what is
  missing. Spacing (p-*, gap-*) as one compact reference row.
- Deprecated classes: include, labeled "deprecated in 5.3", right next to the modern
  equivalent. dropdown-menu-dark goes to blocks.html with dropdowns.
- Interactive components (dropdowns, collapse, modal, offcanvas, carousel, toast, tooltip,
  popover, scrollspy) belong to blocks.html.
- Skip: fixed-top/sticky-* (would break the page), custom spinner/progress heights (inline style).

### forms.html (after all remaining classes.html sections)
- ALL forms content moves to a new page forms.html, docs-style sections: Form controls, Select,
  Checks & radios, Range, Input group, Floating labels, Form layout, Validation.
- classes.html keeps no forms section, only a link to forms.html.
- Before creating forms.html: plan how it shares the tooling (toolbar/theme toggle,
  sidebar/scrollspy, snippet generator, main.css link) without duplicating code.
- Indeterminate checkbox: minimal demo-only JS sets `.indeterminate` (see Snippet generator).
- Floating textarea at default height; no new inline-style exception.
- Form layout snippets keep row/col on purpose (they are the pattern); say so in demo text.
- was-validated works via :invalid/:valid on required fields, no JS.

### Toolbar (fixed, top-right)
- "Sections" button, shown below lg only: opens the sidebar offcanvas.
- Theme toggle: sets `data-bs-theme` on `<html>`, saved in localStorage (`bsd-theme`).
- Custom CSS switch: disables every stylesheet whose file name lacks "bootstrap". A badge shows how many there are.
- Tokens button: offcanvas listing computed `--bs-*` variables with color swatches.

### Layout (compact)
- Sticky sidebar at `col-lg-3 col-xl-2` with scrollspy nav-pills. Below lg it becomes an offcanvas.
- Content column `col-lg-9 col-xl-10`. Each section is `py-4 border-bottom` with an `h2.h4`.
  Each example has an `h3.h6` heading.
- Color variants sit in dense grids (`col-6 col-md-3 col-xl`, `small`).

### Inline styles (see CLAUDE.md)
- Demo content: none, except the documented exceptions, each labeled in the demo text as
  "inline style, not a Bootstrap class":
  a) style="object-position: top;" in the Images and Cards comparisons;
  b) style="width: N%" on .progress-bar and on .progress inside .progress-stacked.
- Demo tooling (sidebar max-height, tokens offcanvas width, snippet pre max-height,
  token swatches) is exempt, but must not restyle Bootstrap components.

### Images
- Format: WebP only. URL: https://picsum.photos/id/{id}/{w}/{h}.webp
  (IDs from https://picsum.photos/v2/list?page=N&limit=100).
- The list has no content info: candidate IDs are downloaded at the exact planned size and
  checked visually before use.
- Verification: curl -sIL on every URL, Content-Type must be image/webp.
- demo-old.html image URLs are not reused (Unsplash).
- Every img: width/height equal to the URL size, original alt, decoding="async";
  loading="lazy" only below the first screen.
- .card-img-* images also get img-fluid (height attribute stretches them otherwise),
  except inside .ratio, where `.ratio > *` already sets the size.
- Fixed-size image boxes use .ratio ratio-* wrappers, never inline height/width.
- Avatars: IDs 64, 91, 65, 177 (Lena Varga, Tomas Reyl, Ines Moreau, Jonah Pike). Logo: ID 63.
- Portrait for object-position: ID 1027 (original 2848x4272), used at 600/900.
- Navbar logo: alt="" (brand name is visible next to it), no loading="lazy" (above the fold).

## Next steps
Each step = one section per edit, then stop for review.
1. Browser review of Color modes (and the pending review of Images, Cards, Borders & rounded,
   Progress, Shadows, List group, Navbar: light/dark, mobile width).
2. Close button: done, awaiting review.
3. Button group (moves the btn-group/toolbar example out of Buttons).
4. Placeholders.
5. Additions to existing sections: Cards, Navs, List group, Navbar, Typography, Tables
   (one per edit).
6. Helpers.
7. Utility scales.
8. forms.html: tooling-sharing plan first, then sections, then remove Form controls from
   classes.html and add the link.
9. Audit backlog pass (separate, when the user says so).

## User findings
1. use webp for images instead of jpeg — done.
2. For images, add examples of Bootstrap `object-fit-*` classes (cover, contain, fill, scale, none)
      and an `object-position: top` comparison on a portrait photo of a person
      (inline style; Bootstrap has no object-position utility) — done (Images and Cards).

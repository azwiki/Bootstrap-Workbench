# Handoff: classes.html, forms.html

## Start here (cold start)

- Last commit: see `git log -1`. Autonomous run in progress since tag `pre-autonomous`
  (4f5c814); see "Autonomous run log" below.
- First run `git log -1 --oneline` and `git status --short`; report anything unexpected.
- Cards review done (user, 2026-09-30). Decision: both card grids stay as a problem → fix pair.
  The old mixed-ratio grid is now a "Broken:" anti-pattern placed right before the 4:3 grid.
  Follow-up done: card-group uses ratio-4x3 (see "Cards additions").
- Awaiting user browser review: Utility scales (`#bsd-utility-scales`).
- Next steps, in order (one section per edit, stop for review after each):
  1. Part C (audit pass on classes.html) in progress, one commit per section in page order;
     see "Audit pass log" for the sections done. Then part D (final cleanup).
  2. Every step's checks include `tools/spytest.js` (see "Sidebar scrollspy").
  3. blocks.html.
  The audit backlog pass stays separate: only when the user says so.
- Review tip: Browser review in Safari: use a Private Window or Develop → Disable Caches (with
  Web Inspector open). Safari caches the local site aggressively and can show stale HTML/CSS.

## Autonomous run log (started 2026-10-01, tag `pre-autonomous` = 4f5c814)
User instructions for the run (summary): no stops between steps; one commit per step after its
checks pass; never amend/rebase/reset/force/push; never touch the tag, main.css, main.js,
demo-old.html; no installs; network only for picsum verification. Order:
A. forms.html steps 3–9 (see "forms.html phase 4 plan").
B. blocks.html: plan into HANDOFF first (commit), "Blocks" in the page switch
   (data-bsd-page="blocks"), JS inits in bsd-demo.js, then one section per commit.
C. Audit backlog pass on classes.html (approved), one commit per section, screenshots
   before/after at 1400px light must match.
D. Final cleanup of HANDOFF and CLAUDE.md, then "Autonomous run summary" at the top.
Failed steps go under "Blocked (autonomous run)"; decisions under "Decisions for review
(autonomous run)".
Check tooling lives in the session scratchpad (check.js, static.sh, step.sh, capture2.js);
tools/spytest.js is in the repo.

### Decisions for review (autonomous run)
- blocks.html scope details (plan above): dropdown/segmented buttons inside input groups moved
  from the forms Input group plan to blocks.html Dropdowns; collapse-horizontal left out
  (needs an inline width); testimonials without photos. Alternatives: an inline-style
  exception for collapse-horizontal; landscape crops as avatars. Commit: the plan commit.

- Carousel `slide` class: not in bootstrap.min.css, but a JS hook in the local 5.3.8 bundle
  (`_isAnimated(){return classList.contains("slide")}`), canonical carousel markup. Kept.
  Alternative: drop it (no slide animation). Commit: "blocks: Carousel section".

- Sidebar scrollspy, sections at the end: the "last section whose top reached the line" rule
  could not highlight short sections the page cannot scroll up to the line (blocks.html:
  Tooltips/Popovers; would hit every short final block such as the footer). Now those
  sections get evenly spaced activation points in the last part of the scroll range (at
  least 100px each), and a click on them lands on that point instead of the clamped bottom.
  Landing for every other section is unchanged; classes/forms captures identical; spytest
  36/36 on all three pages at 700/900/1200. Alternative: bottom padding/spacer after the
  last section (rejected earlier without your OK). Commit: "Sidebar scrollspy: activation
  points for sections at the end of the page".

- Audit pass method: the snippet generator got `data-demo-unwrap` and `data-demo-drop` (see
  "Snippet generator"), so demo wrappers and demo-only classes leave the snippets while the
  rendered page stays pixel-identical. The existing conventions alone (per-column h4.small
  labels, layout classes on the data-demo element) would have changed how grids look.
  Alternative: rebuild the grids with per-column labels (visible change). Commit: "Snippet
  generator: data-demo-unwrap and data-demo-drop".

- Anti-pattern (b) (image without width/height next to the correct one): the snippet now
  shows only the two img tags (row/col unwrapped, the two caption paragraphs data-demo-skip).
  Anti-pattern (a) keeps row/col-4/col-8: the narrow column is what breaks. Alternative:
  keep the side-by-side grid in the snippet. Commit: "classes audit: Images snippets …".

### Blocked (autonomous run)
- (none yet)

## Current state

Sections in `classes.html`, in page order (all listed in the sidebar):
Colors, Color modes, Text colors, Borders & rounded, Links, Buttons, Button group, Close button, Typography, Images,
Alerts, Badges, List group, Tables, Cards, Progress, Spinners, Placeholders, Navbar, Navs & tabs,
Pagination, Breadcrumb, Accordion, Shadows, Focus ring, Utility scales, Forms (only a link to
forms.html).

Sections in `blocks.html`: About this page (#bsd-blocks-intro); more per "blocks.html plan".

Sections in `forms.html`: About this page (#bsd-forms-intro), Form controls, Select, Checks &
radios, Range, Input group, Floating labels, Form layout, Validation.

New sections go at the position given in "Section plan" below, not always at the end.
`<!-- bsd:continue -->` marks the end of the content on each page.
Sidebar links are generated by assets/js/bsd-demo.js from `section[id^="bsd-"] > h2` (link text
= h2 text, page order). A new section needs only its `<section id="bsd-…">` with an `<h2>`.

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
- Totals (rechecked 2026-09-30, after the card-group change): 131 `<img>` tags, 58 picsum IDs,
  75 unique URLs, all `.webp`,
  all verified with curl -sIL (Content-Type: image/webp).

Checked by script: every img has width/height matching the URL, alt text and decoding="async".
The only exception is anti-pattern (b), which has no dimensions on purpose. Tags are balanced.
Snippets of the examples added in the Images task (object-fit, portrait comparison, ratio-*,
Cards comparison, anti-pattern (a)) were checked in a headless DOM dump: no row/col wrappers,
no .ratio wrapper. Older examples still have wrappers: see "Audit backlog" below.

## Status

- See "Start here" at the top for the last commit and what is awaiting review.
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

### Button group: done (checked in Playwright Chromium + WebKit, awaiting browser review)
- Section `#bsd-button-group`, after Buttons, before Close button.
- Examples: btn-group; links with active item (`a.btn.active[aria-current=page]`, the canonical
  pattern; the old example had aria-current on a button); btn-* groups (8 colors);
  btn-outline-* groups (8 colors); mixed styles; btn-group-lg/default/-sm; btn-group-vertical
  (solid + outline); btn-toolbar with groups; btn-toolbar with an input-group; checkbox and
  radio groups (btn-check inside btn-group, ids bsd-bg-*).
- Multi-group rows use the data-demo own-classes convention (d-flex flex-wrap gap-2).
- The old combined btn-group/toolbar example was removed from Buttons. Buttons keeps only
  standalone btn-check toggles: "btn-check checkbox toggles" (unchecked, checked, disabled,
  outline, outline checked) and "btn-check radio toggles" (solid checked/unchecked/disabled,
  outline pair), each one data-demo with d-flex flex-wrap gap-2. The grouped "Shipping speed"
  radio example was removed (Button group covers btn-check inside btn-group).
- btn-outline-light on a light page stays nearly invisible on purpose (standard behavior,
  useful audit signal). No backdrop.

### Placeholders: done (checked in Playwright Chromium + WebKit, awaiting browser review)
- Section `#bsd-placeholders`, after Spinners, before Navbar.
- Examples: col-* widths in a `p[aria-hidden]` text block; w-25/50/75/100; placeholder-lg,
  default, -sm, -xs; currentColor + bg-* (8 colors); placeholder-glow; placeholder-wave;
  button placeholders (`a.btn.disabled.placeholder.col-*[aria-disabled]`); loaded card next to
  its loading state (card[aria-hidden], placeholder-glow). Stacked rows use data-demo own
  classes `d-flex flex-column gap-2`. No image in the card pair (no gray image placeholders).
- bg-light placeholder is nearly invisible on a light page (same audit signal as
  btn-outline-light).

### Cards additions: done, reviewed by the user (2026-09-30)
- Already covered before (not duplicated): default + text-bg-*, border-*, card-img-top on
  text-bg-*, card-img-bottom (3), object-position comparison, card-img-overlay, horizontal,
  card-group with images (mixed ratios), row-cols grid with mixed ratios + footer, shadows,
  avatars.
- Added: card-title/card-subtitle/card-text/card-link; card-header-tabs and
  card-header-pills (static nav, aria-current="true", disabled item); image + body +
  list-group-flush + card-link in one card; image between card-header and card-body (plain img
  in .ratio, no card-img-top, so radius 0, verified); grid row-cols-1 row-cols-md-3 g-3 with
  h-100, card-footer, uneven text and all images in ratio-4x3 (the fix for the mixed-ratio
  grid; the row is kept in the snippet because the grid IS the example); clickable card with
  stretched-link (click on the image hits the link, verified).
- After review: the old mixed-ratio row-cols grid became anti-pattern "Broken: grid ... mixed
  image aspect ratios", directly before the 4:3 grid (the fix). Same labeling as the Images
  anti-patterns: alert-danger above the heading, "Broken:" heading, `border border-danger
  rounded p-3` on the data-demo element (not in the snippet). The 4:3 grid got one sentence
  saying it is the fix, as plain small text ABOVE its heading, so its "</>" stays in the
  heading. Grid markup, image URLs and the snippet generator unchanged. Checked in Playwright
  Chromium + WebKit, 1400/576px, light/dark: broken grid images 233/349/145px, fix 270px each,
  no horizontal overflow, both snippets toggle and start with the row.
- card-group is now canonical: "card-group with all images in ratio-4x3". Same IDs 11, 17, 66,
  now 600x450 (checked visually at 4:3 and with curl -sIL image/webp; alt kept). Markup (user
  decision, 2026-09-30): plain img.object-fit-cover in .ratio ratio-4x3, NO card-img-top, and
  `overflow-hidden` on each .card. Reason: card-group's corner reset only matches
  `.card > .card-img-top`, so card-img-top inside .ratio keeps 5px corners at the joins, and a
  plain img alone pokes square past the outer rounded corners. overflow-hidden clips it to
  the card: outer 6px, joins 0px (verified). A small-text note above the heading says so.
  Footers/text rewritten (no more "mixed ratios"). Checked in Playwright Chromium + WebKit,
  1400/576px, light/dark: images 279px (1400) / 137px (576) each, toggles in headings,
  snippets start with the card-group, no overflow, no JS errors.
- Single cards are sized by `col-sm-8 col-md-6 col-lg-4` on the data-demo element.
- New image IDs: 403, 885, 244 (640x360, ratio-16x9); 553, 1, 366 (600x450, ratio-4x3).
  All in v2/list, checked visually at the planned size, curl -sIL image/webp.

### Utility scales: done (checked in Playwright Chromium + WebKit, awaiting browser review)
- Section `#bsd-utility-scales` after Focus ring, before Form controls, with sidebar link.
  Only steps not shown elsewhere (shadow-*, rounded-0…5, fs-*, opacity-25…100 already live in
  Shadows, Borders & rounded, Typography, Images). One data-demo per scale:
  rounded-top-0…5 + rounded-top-pill + rounded-top-circle (note: end/bottom/start take the
  same steps); lh-1/lh-sm/lh-base/lh-lg with the same text; opacity-0 box between two visible
  boxes, explained in text above the heading; p-0…p-5 (outer box bg-body-tertiary border,
  inner bg-primary-subtle); gap-0…gap-5 (one d-flex row of chips per step); row-gap-3 on
  d-grid and column-gap-3 on d-flex flex-wrap (each shows only its own axis).
- Not included (user decision): z-*, m*-auto, m-* scale.
- Every class grepped in the local bootstrap.min.css before use.
- Checked at 1400/576px, light/dark: no overflow, scrollspy marks the sidebar link active
  (also via the offcanvas at 576px), 7 snippets toggle from their headings, no data-demo
  attributes in snippets, padding computes to 0/4/8/16/24/48px, no JS errors.

### Skipped (scope change, 2026-09-30)
- Additions to Navs, List group, Navbar, Typography and Tables: skipped. Navbar/navs will
  appear in blocks.html.
- Helpers section: skipped. stretched-link moved into Cards.

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

### Audit pass log (part C, autonomous run)
Method: data-demo-unwrap / data-demo-drop (see "Snippet generator"); every section's
screenshot at 1400px light is byte-identical before/after unless noted.

- Colors: 7 grids unwrapped (row g-2 small + col-*). Swatch helper p-2 stays (documented exception, like Utility scales). Screenshot identical.
- Color modes: unchanged on purpose: the snippet is the whole data-bs-theme island (HANDOFF Color modes decision).
- Text colors: 5 d-flex rows unwrapped (incl. fw-semibold on the wrapper). px-1 with bg-dark/bg-white on light/dark text stays (visibility helper). Screenshot identical.
- Borders & rounded: 4 grids + 1 d-flex row unwrapped. Sample-box helpers (p-2, bg-body-tertiary, border-2 for visibility) stay, as in Colors. rounded-circle example unchanged (sizing on its data-demo). Screenshot identical.
- Links: 6 d-flex rows unwrapped (one example had three sibling rows). Screenshot identical.
- Buttons: 7 d-flex rows unwrapped. btn-check examples were already clean (layout on the data-demo element). Screenshot identical.
- Button group, Close button: already clean: btn-toolbar gap-2 is the canonical spacing between groups; no change.
- Typography: 4 d-flex rows + 2 grids unwrapped; col-md-4 on the lh-* paragraphs and mb-0 on lists/figure/figcaption/pre dropped from snippets. dl.row with col-5/col-7 stays (canonical description list). Screenshot identical.
- Images: d-flex rows / grids unwrapped in rounded, avatars, shadows, borders, figure, opacity, srcset; media object keeps its d-flex (canonical), only mb-4 between the two dropped; float alignment keeps its spacing (canonical keep list); anti-pattern (a) unchanged (the narrow column is the point); anti-pattern (b): row/col unwrapped and the Correct/Broken captions marked data-demo-skip, so the snippet is the two img tags. Screenshot identical.
- Alerts: 2 grids unwrapped; mb-0 on the last paragraph inside an alert stays (Bootstrap pattern). Screenshot identical.
- Badges: 4 d-flex rows unwrapped; p-2 on the positioned dot badge stays (canonical). Screenshot identical.
- Spinners: 3 d-flex rows unwrapped. Screenshot identical.
- Pagination: 1 d-flex row unwrapped, mb-0 on the three ul.pagination dropped from snippets. Screenshot identical.
- Focus ring: 1 d-flex row unwrapped; py-1 px-2 on the links stays (docs pattern). Screenshot identical.
- List group: 2 grids unwrapped; d-flex/justify-content-between/me-* inside items stay (canonical keep list). Screenshot identical.
- Tables: 1 grid unwrapped; mb-0 on the table inside table-responsive dropped. Screenshot identical.
### Documented exception: helper classes in Utility scales snippets (NOT audit backlog)
- In `#bsd-utility-scales` the sample boxes keep bg-body-tertiary, bg-primary-subtle, border
  and p-* in the snippets on purpose: without them radius, padding and gaps are invisible.
  The section intro says so. Do not strip them in the audit pass.

## Decisions so far

### Snippet generator
- Example markup goes in `<div data-demo>`. assets/js/bsd-demo.js clones its children, drops
  `[data-demo-skip]` elements and `data-demo*` attributes, pretty-prints with 2-space indent,
  and inserts `<pre><code>` with a Copy button after the example.
- Snippets are collapsed by default. Each example gets a `</>` toggle, placed in the preceding
  h3–h6 heading if there is one, otherwise in a small bar above the example.
- A "Show code" switch in the toolbar opens all snippets. Its state is saved in localStorage (`bsd-code`).
- Attributes on the `data-demo` element itself are not part of the snippet. The anti-pattern
  boxes use this to keep the border/overflow classes out of the copied code, and single
  examples use it for sizing (e.g. `col-3 col-sm-2 col-md-1` on the rounded-circle data-demo).
- `data-demo-unwrap` (on any element inside a data-demo): a demo layout wrapper. The snippet
  shows its children in its place; the page renders it as before. Used by the audit pass for
  row/col grids and d-flex rows around variants.
- `data-demo-drop="class …"`: those demo-only classes (e.g. h-100, mb-2 between variants)
  are left out of that element in the snippet; an empty class attribute is removed.
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
- Demo-only JS (e.g. setting `.indeterminate` on a checkbox) lives in assets/js/bsd-demo.js,
  keyed by id. No inline on* handlers. bsd-demo.js also cancels `submit` for every form inside
  #bs-demo (safety net, never in snippets).

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
- Additions to existing sections: only Cards was done (see "Cards additions"). Navs, List group,
  Navbar, Typography and Tables additions were SKIPPED (see "Skipped").
- Helpers `#bsd-helpers`: SKIPPED; stretched-link moved into Cards.
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
- Tooling sharing: see "forms.html tooling sharing" below.
- Indeterminate checkbox: minimal demo-only JS sets `.indeterminate` (see Snippet generator).
- Floating textarea at default height; no new inline-style exception.
- Form layout snippets keep row/col on purpose (they are the pattern); say so in demo text.
- was-validated works via :invalid/:valid on required fields, no JS.

### forms.html tooling sharing (approved 2026-10-01)
- Decision: the CLAUDE.md rule "tooling script is inlined" is replaced. The fragment is
  `<main id="bs-demo">` plus `assets/js/bsd-demo.js`, loaded with a classic `<script src>` at
  the end of #bs-demo (before the Bootstrap bundle). On another site: copy the file or paste its
  contents into an inline `<script>`. Reason: no build step, and file:// blocks fetch() of
  partials and ES modules, so a shared classic script is the only way to avoid duplicated code.
  assets/js/main.js and assets/css/main.css stay untouched.
- Phases (stop for review after each):
  1. Move the inline script to bsd-demo.js unchanged, classes.html uses `<script src>`. DONE.
  2. bsd-demo.js builds the toolbar, sidebar (links from `section[id^="bsd-"] > h2`) and the
     tokens offcanvas; remove that markup from classes.html. Same Playwright comparison. DONE.
  3. forms.html skeleton + page switch in the toolbar ("Classes" / "Forms", aria-current). DONE.
  4. Move the forms sections one at a time (Form controls, Select, Checks & radios, Range,
     Input group, Floating labels, Form layout, Validation); then remove Form controls from
     classes.html and add the link to forms.html.
- main.css link stays in each page's `<head>` (the Custom CSS switch finds it by href).
- Phase 1 details: the script was already an IIFE; only changes are a 2-space de-indent, a
  file header comment, and a run-once guard (`data-bsd-tooling` attribute on #bs-demo, no
  globals). Playwright Chromium + WebKit, 1400/576px, light/dark, file://: a JSON capture of
  all 139 snippet texts, toggles, Show code, theme toggle, Custom CSS switch, tokens offcanvas,
  scrollspy and offcanvas sidebar is byte-identical before and after the move; no JS errors.
  Same result with the Bootstrap bundle in `<head>` and with the script tag included twice
  (temporary copies, deleted).
- Phase 2 details: buildTooling() runs right after the run-once guard, before the snippet
  generator, so all later lookups by id are unchanged. The page keeps only the layout
  (`.container-fluid > .row > content column`); the data-bs-spy attributes it kept then were
  removed later (custom scrollspy, see "Sidebar scrollspy"). Placement: toolbar = first child of #bs-demo (before the layout container),
  sidebar column = first child of the `.row` that holds the sections, tokens offcanvas =
  right after the layout container (before #bsd-live). #bsd-live stays in the HTML.
  All 27 h2 texts equal the previous sidebar labels (nothing renamed).
  Playwright Chromium + WebKit, 1400/576px, light/dark, file://: the recording (139 snippets,
  tooling behavior, normalized DOM dump of toolbar, sidebar column and tokens offcanvas with
  their parent/siblings) is byte-identical before and after, also with the bundle in `<head>`
  and with the script tag twice (one toolbar/sidebar/#bsd-nav/tokens panel). No JS errors.
- Scrollspy: see "Sidebar scrollspy" below (the old Shadows/Focus ring quirk is fixed).
- data-bsd-page rule: `<main id="bs-demo" data-bsd-page="<id>">` on each demo page; the id must
  match an entry in PAGES in bsd-demo.js (classes, forms; blocks.html = one more entry). Only
  then the toolbar gets the page switch: `<nav class="btn-group btn-group-sm"
  aria-label="Demo pages">` with `a.btn.btn-outline-secondary` links, the current one `active`
  + `aria-current="page"`, inserted right after the Sections button. No attribute → no
  switch. When pasting the fragment into another site, remove data-bsd-page (the page
  comment says so), or the switch links to pages that do not exist there.
- Phase 3 details: forms.html = same `<head>` (lang, meta, favicon, bootstrap.min.css, main.css),
  same layout, `data-bsd-page="forms"`, intro section `#bsd-forms-intro` ("About this page"),
  `<!-- bsd:continue -->`, #bsd-live, bsd-demo.js, bundle, main.js (as in classes.html).
  Playwright Chromium + WebKit, 1400/576px, light/dark, file://: classes.html differs from
  the phase 2 recording only by the switch `<nav>` in the toolbar DOM; a copy without
  data-bsd-page is byte-identical to phase 2 (deleted). forms.html: one sidebar link,
  scrollspy, tokens (91 rows), theme toggle, Custom CSS switch work; switch links work both
  ways; theme and Show code carry over in both directions; no JS errors, no overflow.
- Known, accepted (user, 2026-10-01): the switch (126px) makes the fixed toolbar wrap to two
  rows between ~691px and ~557px (before: one row down to ~557px); at 576px it covers the top
  ~24px of the h1 until scrolled.
- localStorage on file:// (bsd-theme, bsd-code), tested in Playwright Chromium and WebKit:
  origin is "file://" and the keys are shared between pages in the same folder and in other
  folders; reopening classes.html restores theme and Show code.
  Real Safari (user, 2026-10-01, over http://mini.local): bsd-theme and bsd-code are shared
  between the pages (same origin). No workaround needed.

### forms.html phase 4 plan (approved 2026-10-01)
Mapping of the current classes.html `#bsd-forms` examples (E1–E3, 29 `bsd-f-*` ids, snippets
still with demo row/col wrappers):
- E1 "form-control, form-select, sizes, disabled, readonly, form-text" → Form controls (input,
  help text, disabled, readonly, sm/lg, plaintext, textarea, color), Select (form-select,
  -sm), Range (form-range).
- E2 "form-check, form-switch, input-group, form-floating" → Checks & radios, Input group,
  Floating labels.
- E3 "is-valid, is-invalid, valid-feedback, invalid-feedback" → Validation.
- Form layout: nothing existing.

Gaps to fill per section (all grep-verified in the local 5.3.8 CSS; no form class is
deprecated in 5.3; v4 names form-group, form-row, form-inline, custom-select, custom-control,
input-group-prepend/-append, form-file do NOT exist and are never used):
- Form controls (~7): input + form-text/aria-describedby, a few types (email, password, number,
  date); sizing -sm/default/-lg; disabled, readonly, `<fieldset disabled>` + legend;
  form-control-plaintext; file input (multiple, disabled, -sm, -lg); form-control-color;
  datalist; textarea.
- Select (~4): default; -sm/default/-lg; multiple; size="3"; disabled.
- Checks & radios (~7): checkbox default/checked/indeterminate/disabled/disabled checked;
  radios + disabled; switches (checked, disabled, disabled checked); form-check-inline;
  form-check-reverse (+ reverse switch); check without visible label (aria-label). btn-check
  toggles stay in Buttons on classes.html (demo text points there).
- Range (~3): default; disabled; min/max; step.
- Input group (~7): text addons left/right/both, multiple addons; button addons;
  input-group-sm/-lg; checkbox/radio addons (form-check-input mt-0 in input-group-text); two
  inputs; form-select and file input in a group; flex-nowrap. Dropdown/segmented buttons go
  to blocks.html (need dropdown JS).
- Floating labels (~7): input; password; textarea (default height, no inline style); select;
  disabled; readonly with value; form-control-plaintext; inside input-group; in a grid
  (row g-2 + col-md, kept on purpose).
- Form layout (~6, snippets keep row/col on purpose and say so): utility-only (mb-3); grid
  row g-3 (g/gx/gy); horizontal (row + col-sm-2 col-form-label, plaintext row);
  col-form-label-sm/-lg; column sizing (col-sm-7 + col); auto-sizing (col-auto); inline
  (row row-cols-lg-auto g-3 align-items-center, visually-hidden labels).
- Validation (~6): is-valid/is-invalid on input, select, textarea, check, radio, switch, file;
  input-group has-validation; `.was-validated` in markup with required fields (no JS;
  needs-validation is not a CSS class); valid-tooltip/invalid-tooltip with position-relative
  on the parent (canonical, stays in the snippet); validation in floating labels.

Rules for new forms content (approved):
1. Snippets clean from the start: one data-demo per example; grids of examples keep row/col
   OUTSIDE data-demo with an h4.small label per column; flex rows of variants put the layout on
   the data-demo element. Form layout is the exception: row/col stay in the snippet (the grid
   is the pattern) and the demo text says so.
2. ids unique per page, prefixed `bsd-f-*`; ids moved from classes.html keep their names.
3. Every control has a label (visually-hidden where the pattern needs it; aria-label for
   label-less checks, input-group inputs, sizing samples); help/feedback via aria-describedby;
   radio groups share a name; fieldset has a legend.
4. Original Northwind Studio text only, no Bootstrap docs sentences.
5. No navigation: no `action`, `type="button"` on every button inside a form, `<form>` only
   where the pattern needs it (Form layout, was-validated). Safety net in bsd-demo.js cancels
   submit for every form inside #bs-demo (demo-only, never in snippets).
6. Demo-only JS (e.g. indeterminate) lives in bsd-demo.js, keyed by id, no inline on* handlers.
7. Only grep-verified Bootstrap 5.3.8 classes; no inline styles.

Order (one section per edit, stop for review after each):
1. Form controls  2. Select  3. Checks & radios  4. Range  5. Input group  6. Floating labels
7. Form layout  8. Validation  9. Remove #bsd-forms from classes.html, link to forms.html in its
place, update #bsd-forms-intro.
Checks for every step include `tools/spytest.js` on both pages (default heights 700, 900,
1200); report any failure.
Old E1–E3 stay on classes.html until step 9.

Step 1 (Form controls): DONE, awaiting review.
- Section `#bsd-form-controls` on forms.html after `#bsd-forms-intro` (section ids follow
  `bsd-<section name>`; `bsd-f-*` is reserved for control ids, so the two never collide).
  The intro section got `border-bottom` (it is no longer the last section).
- 9 headings, 14 data-demos, 20 controls: form-label/form-control/form-text; input types
  (email, password + help, number, date) as a 4-column grid; -sm/default/-lg; states grid
  (disabled, readonly, form-control-plaintext, fieldset disabled + legend + type="button"
  button); file input (default, multiple, disabled, -sm, -lg); form-control-color; datalist;
  textarea. Single examples are sized by `col-md-8 col-lg-6` on the data-demo element.
- Moved ids keep their names: bsd-f-name(-help), bsd-f-disabled, bsd-f-readonly, bsd-f-color,
  bsd-f-note. No `<form>` in this section.
- Checked in Playwright Chromium + WebKit, 1400/576px, light/dark, via file:// and
  http://mini.local/projects/Bootstrap-demo/ (serves the working tree): no JS errors, no
  overflow, sidebar has the link, all 14 toggles in headings, snippets without data-demo and
  without row/col/g-*/d-grid/gap-*, every control has an accessible name, fieldset has a
  legend, Enter in all 10 editable fields does not navigate. Safety net verified with a
  temporary form inside #bs-demo (Enter + submit click: 0 navigations); control test: a form
  outside #bs-demo does navigate. All classes grep-verified.
- Scrollspy at 1400px: clicking "Form controls" left no link active. Fixed by the scrollspy
  settings below.

Step 2 (Select): DONE, awaiting review.
- Section `#bsd-select` after Form controls (which now has `border-bottom`). 3 headings,
  5 data-demos, 7 controls: form-select with form-label (moved id bsd-f-finish);
  -sm/default/-lg (d-grid gap-2 on the data-demo, aria-labels); grid of multiple (with
  form-text via aria-describedby), size="3", disabled.
- Same checks as step 1, all pass (Chromium + WebKit, 1400/576, light/dark, file:// and
  http://mini.local): no JS errors, no overflow, sidebar link + scrollspy click from the top,
  5 toggles in headings, clean snippets, accessible names, 0 navigations. Form controls
  rechecked: unchanged. All classes grep-verified, no duplicate ids.
- spytest at 900px then showed the last-section failure of Bootstrap ScrollSpy on forms.html
  at 1400px; fixed by the custom sidebar scrollspy (see "Sidebar scrollspy").

Step 3 (Checks & radios): DONE (autonomous run).
- Section `#bsd-checks-radios` after Select. 7 headings, 7 data-demos, 23 controls:
  checkbox default/checked/indeterminate (moved ids bsd-f-c1, -c2); disabled + disabled
  checked (bsd-f-c3 moved); radios in `<fieldset>` + `<legend class="h6">` with a disabled
  option (bsd-f-r1/-r2 moved); switches default/checked/disabled/disabled checked (bsd-f-s1
  moved); form-check-inline (checkboxes + radios); form-check-reverse (incl. reverse switch,
  sized col-md-8 col-lg-6 on data-demo); bare checkbox/radio with aria-label.
- Indeterminate: bsd-demo.js sets `.indeterminate = true` on #bsd-f-check-indeterminate
  (demo-only, keyed by id); the note above the heading says it is JS-only.
- Intro line links to classes.html#bsd-buttons for btn-check toggles.
- Checks: all pass (check.js 16 runs, static, spytest forms 12/12, classes.html capture
  identical to baseline).

Step 4 (Range): DONE (autonomous run).
- Section `#bsd-range` after Checks & radios. 4 headings, 4 data-demos (col-md-8 col-lg-6 on
  data-demo): form-range + form-label (moved id bsd-f-range), disabled, min/max, step.
- Checks: all pass (check.js, static, spytest forms 12/12, classes.html capture identical).

Step 5 (Input group): DONE (autonomous run).
- Section `#bsd-input-group` after Range. 8 headings, 8 data-demos (col-md-8 col-lg-6 on
  data-demo; stacked groups use mb-3 as in Bootstrap's own pattern): text addons left/right/
  both + textarea (moved € / .00 group); two addons; button addons left/right/two buttons
  (moved promo code group), all type="button"; input-group-sm/default/-lg (d-grid gap-2 on
  data-demo); checkbox/radio addons (form-check-input mt-0); two inputs; form-select and file
  input with label.input-group-text; flex-nowrap. Dropdown/segmented buttons: blocks.html.
- Checks: all pass (check.js, static, spytest forms 12/12, classes.html capture identical).

Step 6 (Floating labels): DONE (autonomous run).
- Section `#bsd-floating-labels` after Input group. 6 headings, 8 data-demos: email +
  password (moved id bsd-f-float); textarea at default height; form-select; states grid
  (disabled, readonly with value, form-control-plaintext); inside an input group; grid row g-2
  + col-md (snippet keeps row/col on purpose, note above the heading says so). Intro line:
  placeholder required, label after the control.
- Checks: all pass (check.js with the layout check off for this section; only the grid
  example has row inside its data-demo, verified by grep), static, spytest forms 12/12,
  classes.html capture identical.

Step 7 (Form layout): DONE (autonomous run).
- Section `#bsd-form-layout` after Floating labels. 7 headings, 7 data-demos, 25 controls,
  ids bsd-f-lay-*: spacing utilities only (form + mb-3); form grid (form.row.g-3 + col-md-*);
  horizontal (row + col-sm-2 col-form-label, plaintext row, fieldset.row with
  legend.col-form-label.col-sm-2.pt-0, offset-sm-2 button); col-form-label-sm/-lg; column
  sizing (col-sm-7 + col-sm); auto-sizing (row gy-2 gx-3 align-items-center + col-auto,
  visually-hidden labels); inline (row row-cols-lg-auto g-3 align-items-center).
  Snippets keep row/col on purpose (section intro says so); all buttons type="button".
- Checks: all pass (check.js with the layout check off, 17 Enter presses inside forms, 0
  navigations), static, spytest forms 12/12, classes.html capture identical.

Step 8 (Validation): DONE (autonomous run).
- Section `#bsd-validation` after Form layout. 6 headings, 7 data-demos: is-valid/is-invalid
  + feedback on input, select, textarea (moved ids bsd-f-v1…v5); checkbox (bsd-f-v6, -v7),
  radios in a fieldset (feedback after the last radio), switch, file input; input-group
  has-validation (bsd-f-v8); `form.was-validated novalidate` with required fields (no JS;
  buttons type="button"); valid-tooltip / invalid-tooltip in `position-relative` (kept in
  the snippet; the space below comes from pb-5 on the data-demo element, not in the snippet);
  floating labels with is-valid / is-invalid. All feedback linked via aria-describedby.
- Checks: all pass (check.js, static, spytest forms 12/12, classes.html capture identical).

Step 9 (classes.html cleanup): DONE (autonomous run).
- classes.html: the old `#bsd-forms` section (E1–E3) is replaced by a short `#bsd-forms`
  section "Forms" with a link to forms.html (id kept so old links still land; sidebar label
  is now "Forms"). No bsd-f-* ids remain on classes.html.
- forms.html intro (#bsd-forms-intro) now describes the finished page and links back to
  classes.html.
- Checks: spytest classes + forms at 700/900/1200: 24/24 PASS (incl. Shadows/Focus ring).
  forms.html capture identical to its baseline. classes.html capture differs only as
  expected: 139 → 136 snippets (the 3 removed forms examples) and the sidebar label.
  check.js and static checks on #bsd-forms and #bsd-forms-intro pass.

### blocks.html plan (autonomous run, 2026-10-01)
Page: same head/layout/tooling as forms.html, `data-bsd-page="blocks"`, "Blocks" added to the
page switch (PAGES in bsd-demo.js). Interactive components work in any bundle load order; JS
inits live in bsd-demo.js (initBootstrap, scoped to #bs-demo, keyed by id or data-bs-toggle),
never in snippets. No fixed-top / sticky on the page itself. Ids unique per page.
Sections, in this order (one commit each, ~45 examples):
1. Dropdowns `#bsd-dropdowns` (~6): single button; split button; dropup/dropend/dropstart;
   dropdown-menu-end; menu content (header, divider, active, disabled, text); dark menu:
   data-bs-theme="dark" next to dropdown-menu-dark labeled "deprecated in 5.3"; dropdown and
   segmented button inside an input group (moved here from the forms Input group plan).
2. Collapse `#bsd-collapse` (~2): link + button toggles; one button for multiple targets.
3. Modal `#bsd-modal` (~5): default; static backdrop; scrollable + vertically centered;
   sizes modal-sm/-lg/-xl; fullscreen (modal-fullscreen-md-down).
4. Offcanvas `#bsd-offcanvas` (~3): offcanvas-start; end/top/bottom; body scrolling
   (data-bs-scroll) and static backdrop.
5. Carousel `#bsd-carousel` (~3): controls + indicators + captions; carousel-fade; dark:
   data-bs-theme="dark" next to carousel-dark labeled "deprecated in 5.3". No autoplay.
   Images: picsum 10, 28, 235 at 800x400 (unused so far).
6. Toasts `#bsd-toasts` (~3): static toast (toast show); live toast from a button (bsd-demo.js,
   keyed by id); color schemes (text-bg-* + btn-close-white replacement via data-bs-theme).
7. Tooltips `#bsd-tooltips` (~2): four directions; on a disabled button via a focusable wrapper.
8. Popovers `#bsd-popovers` (~2): four directions; dismiss on next click (trigger "focus").
9. ScrollSpy `#bsd-scrollspy` (~1): Bootstrap ScrollSpy in its own scroll box. The box gets
   its height from .ratio (Bootstrap has no fixed-height utility; no inline style).
10. Navbar `#bsd-navbar` (~3): navbar-expand-lg with logo (picsum 63, 24x24, reused), links,
   dropdown, search form and working collapse; dark scheme (data-bs-theme="dark" bg-dark);
   offcanvas navbar. Never fixed/sticky.
11. Navs & tabs `#bsd-tabs` (~3): nav-tabs with tab panes; nav-pills with panes; vertical pills.
Page blocks (original Northwind Studio content; snippets keep row/col on purpose, said in the
section intro):
12. Hero `#bsd-hero` (picsum 48, laptop on a studio desk). 13. Features `#bsd-features`.
14. Pricing `#bsd-pricing` (3 cards). 15. Testimonials `#bsd-testimonials` (figure +
blockquote, no photos: picsum has almost no usable portraits). 16. Call to action `#bsd-cta`.
17. Contact form `#bsd-contact` (no action, type="button"). 18. Footer `#bsd-footer` (static).
Not included: accordion / accordion-flush (already on classes.html); collapse-horizontal (its
child needs a fixed width = inline style).
Checks per section: same as forms steps (check.js, static, spytest on blocks) plus an
interaction script: every component opens and closes by mouse and keyboard, Esc where
Bootstrap supports it, focus returns to the trigger, no console errors.

blocks.html B2/B3: DONE (autonomous run).
- blocks.html skeleton: same head/layout/tooling as forms.html, `data-bsd-page="blocks"`,
  intro section `#bsd-blocks-intro`. PAGES in bsd-demo.js has a third entry "Blocks".
- bsd-demo.js initBootstrap(): initializes every [data-bs-toggle="tooltip"] and
  [data-bs-toggle="popover"] inside #bs-demo, and wires #bsd-toast-live-btn to show
  #bsd-toast-live (keyed by id). Runs after the bundle in any load order (DOMContentLoaded).
- Checks: blocks intro check.js + static OK, spytest blocks 12/12; the switch navigates
  classes → blocks → forms → blocks → classes in both engines; classes.html and forms.html
  captures differ only by the new "Blocks" link in the toolbar DOM (new baselines).

blocks.html 1 (Dropdowns): DONE (autonomous run).
- Section `#bsd-dropdowns`: 6 headings, 7 data-demos, 12 toggles. Items are
  `button.dropdown-item` (no "#" links, so the URL never changes). Single; split; directions
  (dropup, dropup-center, dropdown-center, dropend, dropstart); header/active
  (aria-current)/disabled/divider/item-text + dropdown-menu-end; dark: data-bs-theme="dark"
  next to dropdown-menu-dark "(deprecated in 5.3)"; input group dropdown + segmented button.
- Checks: check.js + static OK; interact.js (mouse open, Esc close, keyboard Enter/Esc, focus
  back on the toggle) OK for all 12 toggles in both engines at 1400/576.
- spytest blocks: 8/12. The 4 failures are at window height 1200 only and come from the page
  still being short (1400x1200: page not scrollable, so a click cannot move "Dropdowns" up;
  576x1200: the intro cannot be scrolled to the top, the click lands at the bottom where the
  last section wins). Accepted while blocks.html is being built; spytest must pass on
  blocks.html once all sections are in (rechecked at the end of part B).

blocks.html 2 (Collapse): DONE (autonomous run).
- Section `#bsd-collapse`: link (href="#id", role="button") + button toggles for one target;
  one button for two targets via `data-bs-target="#bsd-b-dims,#bsd-b-materials"` (no custom
  multi-collapse class). That snippet keeps row g-3 + col-md-6 as in Bootstrap's own pattern.
- Checks: check.js (layout check off for the row above) + static OK; interact.js OK for all 5
  toggles (click and Enter open/close, focus stays on the toggle). spytest blocks: only the
  short-page failure at 1400x1200 remains (see Dropdowns note).

blocks.html 3 (Modal): DONE (autonomous run).
- Section `#bsd-modal`: 5 headings, 5 data-demos, 8 modals (trigger + modal in each snippet,
  modal-title as h1.fs-5, btn-close with aria-label, aria-labelledby): default; static
  backdrop (data-bs-backdrop="static" data-bs-keyboard="false"); scrollable + centered (long
  original text); modal-sm/-lg/-xl; modal-fullscreen and modal-fullscreen-md-down.
- Checks: check.js + static OK; interact.js OK for all 8 triggers (click/Enter open, Esc
  close, static modal ignores Esc and closes via its button by mouse and keyboard, focus back
  on the trigger). spytest blocks: short-page failures only at window height 1200 (Collapse
  is second-to-last and cannot reach the top); recheck at the end of part B.

blocks.html 4 (Offcanvas): DONE (autonomous run).
- Section `#bsd-offcanvas`: 3 headings, 6 offcanvases (trigger + panel per snippet, title
  h2.h5, btn-close with data-bs-target): offcanvas-start; top/end/bottom; body scrolling
  (data-bs-scroll="true" data-bs-backdrop="false") and data-bs-backdrop="static".
- Checks: check.js + static OK; interact.js OK for all 6 (Esc for the no-backdrop panel is
  tested with focus inside the panel: Bootstrap neither traps focus nor handles Esc outside
  it in that mode). spytest blocks: failures only at window height 1200.
- Known, to fix after the last blocks section: with a short last section and a tall window,
  the second-to-last section can never reach the 120px line (the page cannot scroll that
  far), and at the bottom the last section wins. Plan: give unreachable sections evenly
  spaced activation points inside the remaining scroll range (record as a decision).

blocks.html 5 (Carousel): DONE (autonomous run).
- Section `#bsd-carousel`: 4 carousels, no autoplay (no data-bs-ride): controls + indicators
  (aria-current, aria-label) + captions (h4.h5, d-none d-md-block); carousel-fade; dark:
  data-bs-theme="dark" next to carousel-dark "(deprecated in 5.3)". Images 800x400 webp:
  picsum 10, 28, 235 (default + fade); 215, 201, 131 (light images for the dark variants,
  so the dark captions stay readable). All in v2/list, checked visually, curl image/webp.
- `slide` is not in bootstrap.min.css: it is a JS hook (the bundle animates only when the
  carousel has it). Kept; static.sh accepts classes the local bundle tests with
  classList.contains("…"). See "Decisions for review".
- Checks: check.js + static OK; carousel.js (next/prev click, next by Enter, ArrowRight,
  indicator click + aria-current) OK in both engines at 1400/576; images load when scrolled
  into view; spytest blocks 12/12 (the page is now long enough).

blocks.html 6 (Toasts): DONE (autonomous run).
- Section `#bsd-toasts`: static toast (toast show, header + body); live toast from
  #bsd-toast-live-btn (bsd-demo.js) in `toast-container position-fixed bottom-0 end-0 p-3`
  (only visible while shown; role="status" aria-live="polite"); text-bg-primary / -danger
  toasts with data-bs-theme="dark" on the toast for the white close button (btn-close-white
  is deprecated in 5.3); custom content with action buttons.
- Toasts have no Esc and do not move focus (Bootstrap design, said in the section intro).
- Checks: check.js + static OK; toast.js: live toast shows by click and Enter, hides by click
  and Enter on its close button and by itself after 5 s, no overflow while shown; all 4
  static toasts dismiss. spytest blocks 12/12.

blocks.html 7 (Tooltips): DONE (autonomous run).
- Section `#bsd-tooltips`: placements top/right/bottom/left (data-bs-title; labels "End" and
  "Start" for right/left), disabled button inside a focusable `span.d-inline-block`
  (tabindex="0"), tooltip on an inline link (href="forms.html", no "#" link). Inits in
  bsd-demo.js (section intro says so).
- Bootstrap 5.3.8 tooltips have no Esc handling (only dropdown, modal and offcanvas do;
  verified in the bundle). interact.js: hover opens, mouse-out closes, focus opens, blur
  closes; OK for all 6 triggers in both engines at 1400/576. check.js + static OK; spytest
  blocks 12/12.

Correction to the Tooltips note: spytest blocks was 10/12 after Tooltips, not 12/12. The 2
failures were at 1400x1200 only (Toasts second-to-last, cannot reach the line): the known
unreachable-section case, to be fixed after the last blocks section.

blocks.html 8 (Popovers): DONE (autonomous run).
- Section `#bsd-popovers`: placements top/right/bottom/left (click, default); dismiss on next
  click (`a.btn[tabindex="0"][role="button"]` with data-bs-trigger="focus", the Safari-safe
  pattern); disabled button in a focusable span with data-bs-trigger="hover focus".
- No Esc handling for popovers in Bootstrap 5.3.8. interact.js reads data-bs-trigger per
  trigger: click mode = click/second click and Enter/Enter; focus mode = click/click
  elsewhere and focus/blur; hover focus = hover/mouse-out and focus/blur. All 6 OK in both
  engines at 1400/576. check.js + static OK. spytest blocks: see the log of this commit's
  checks in the next note.

blocks.html 9 (ScrollSpy): DONE (autonomous run).
- Section `#bsd-scrollspy`: Bootstrap ScrollSpy (default threshold/root margin) on a scroll
  box `div.overflow-y-auto.border.rounded.p-3[data-bs-spy][tabindex=0]` inside
  `.ratio.ratio-21x9` (height via Bootstrap only), nav-pills flex-column as target;
  row g-3 + col-md-4 / col-md-6 (stacked below md). Snippet keeps row/col/ratio on purpose
  (section intro says so).
- What made Bootstrap's highlighting reliable here: ids on wrapper divs around each topic
  (not on the headings: short headings rarely intersect after a jump), and topics taller than
  the box (5 short original paragraphs each), so the next topic never shares the observed
  area. Earlier attempts (headings as targets, taller boxes) showed the same "next topic wins"
  behavior as Bootstrap ScrollSpy on the page.
- Checks: check.js + static OK; spybox.js: every nav click highlights its link (no hash
  change), Home/End in the focused box highlight first/last, both engines at 1400/576;
  spytest blocks 12/12.

blocks.html 10 (Navbar): DONE (autonomous run).
- Section `#bsd-navbar`: navbar-expand-lg bg-body-tertiary and bg-dark + data-bs-theme="dark"
  (brand with picsum 63 24x24 logo, alt="", loading="lazy" because it is far below the first
  screen; links to sections of this page instead of "#"; active link with aria-current; nav
  dropdown as button.nav-link; disabled link; search form with type="button"); offcanvas
  navbar (navbar-toggler → offcanvas-end at every width). No fixed/sticky.
- Checks: check.js + static OK (3 images); interact.js (hidden triggers skipped per width):
  collapse togglers at 576, dropdowns at 1400, offcanvas toggler at both — all OK; navdd.js:
  dropdown inside the opened collapse at 576 opens and closes on Esc with focus back; dropdown
  inside the offcanvas menu opens, the first Esc closes only the dropdown. spytest blocks
  12/12.

Correction to the Navbar note: spytest blocks was 10/12 after Navbar, not 12/12 (1400x1200:
a click on Popovers highlighted ScrollSpy). Fixed in the next commit (click landing rule);
after it, spytest classes + forms + blocks at 700/900/1200: 36/36, classes/forms captures
identical to their baselines.

blocks.html 11 (Navs & tabs): DONE (autonomous run).
- Section `#bsd-tabs`: nav-tabs + tab-content (tab-pane fade, tabindex="0"); nav-pills +
  tab-content; vertical pills (div.d-flex.align-items-start in the snippet,
  aria-orientation="vertical"). Full tab ARIA (tablist/tab/tabpanel, aria-controls,
  aria-selected, aria-labelledby); inactive tabs start with tabindex="-1".
- Checks: check.js + static OK; tabs.js: click activates tab + pane, ArrowRight/Down and
  ArrowLeft/Up move focus and activation, inactive tabs keep tabindex="-1", 3 tablists, both
  engines at 1400/576; spytest blocks 12/12.

blocks.html 12 (Hero): DONE (autonomous run).
- Section `#bsd-hero`: image + text (row flex-lg-row-reverse align-items-center g-4, picsum
  201 800x600 webp, display-5 h3, lead, CTA buttons as links to sections of this page) and a
  centered hero (text-center, col-lg-6 mx-auto). Section intro: page blocks keep row/col in
  the snippet on purpose. g-5 (Bootstrap's example) caused 12px horizontal overflow at 576
  inside the demo column, so g-4.
- Picsum 48 (planned) was replaced by 201: 48 shows a brand logo on the laptop lid.
- Checks: check.js (layout check off) + static OK (1 image, curl webp); spytest blocks 12/12.

blocks.html 13 (Features): DONE (autonomous run).
- Section `#bsd-features`: 3 columns (row row-cols-1 row-cols-md-3 g-4) with numbered tiles
  (bg-primary-subtle text-primary-emphasis rounded-3), h4.fs-5, icon-link links to sections;
  2 columns with the tile beside the text (d-flex align-items-start, text-bg-secondary tile).
- Checks: check.js (layout check off) + static OK; spytest blocks 12/12.

blocks.html 14 (Pricing): DONE (autonomous run).
- Section `#bsd-pricing`: row row-cols-1 row-cols-md-3 g-4 text-center; card h-100 rounded-3
  shadow-sm; featured card border-primary with card-header text-bg-primary; price as
  p.card-title.display-6.fw-bold (Bootstrap's own example uses a custom class there);
  list-unstyled; button.w-100.btn-lg with mt-auto in a d-flex flex-column card-body so the
  buttons line up; buttons type="button".
- Checks: check.js (layout check off) + static OK; spytest blocks 12/12.

blocks.html 15 (Testimonials): DONE (autonomous run).
- Section `#bsd-testimonials`: three cards (row row-cols-1 row-cols-md-3 g-4, card h-100) with
  figure > blockquote.blockquote.fs-6 + figcaption.blockquote-footer with cite; one large
  centered quote (figure.text-center, blockquote fs-4). No photos (see plan).
- Checks: check.js (layout check off) + static OK; spytest blocks 12/12.

blocks.html 16 (Call to action): DONE (autonomous run).
- Section `#bsd-cta`: banner (text-bg-primary rounded-3 p-4 p-md-5, display-6, lead,
  btn-light btn-lg link to #bsd-contact); inline bar (d-flex flex-column flex-md-row
  align-items-md-center justify-content-between gap-3 p-4 border rounded-3 bg-body-tertiary).
- Checks: check.js + static OK; spytest blocks 12/12.

blocks.html 17 (Contact form): DONE (autonomous run).
- Section `#bsd-contact`: row g-4 with address column (address, opening hours, tel: and
  mailto: links) and form column (form.row.g-3: name, email + form-text, topic select,
  message, copy checkbox, button type="button"; no action; autocomplete on name/email).
- Checks: check.js (layout check off; Enter in 3 fields, 0 navigations) + static OK;
  spytest blocks 12/12.

blocks.html 18 (Footer): DONE (autonomous run).
- Section `#bsd-footer`: footer.row.row-cols-1.row-cols-sm-2.row-cols-md-4 (brand column +
  three nav.flex-column link lists to sections of this page); simple footer (d-flex
  flex-wrap justify-content-between align-items-center, nav). Static, not fixed.
- Checks: check.js (layout check off) + static OK; spytest blocks 12/12 (the short last
  section is handled by the activation-point spread).

blocks.html final check (end of part B): DONE (autonomous run).
- static + check.js on all 19 sections OK; interact.js for dropdowns, collapse, modal,
  offcanvas, tooltips, popovers and the navbar (collapse, dropdown, offcanvas) OK; carousel,
  toasts, ScrollSpy box, tabs and navbar dropdowns in collapse/offcanvas OK; hash load and
  hashchange 24/24 (classes, forms, blocks); classes.html and forms.html captures identical
  to their baselines; spytest classes + forms + blocks at 700/900/1200: 36/36.

### Sidebar scrollspy (custom, decided 2026-10-01)
- bsd-demo.js `initScrollspy()` replaces Bootstrap ScrollSpy for `#bsd-nav` on both pages.
  `<main>` no longer has data-bs-spy, data-bs-target, data-bs-smooth-scroll, data-bs-threshold
  or data-bs-root-margin, so Bootstrap ScrollSpy does not run there. Bootstrap ScrollSpy
  itself is demonstrated on blocks.html.
- Active section = the last nav section whose activation point is at or above the current
  scroll position. Activation point = the scroll position that puts the section top on
  ACTIVE_LINE = 120px (below the fixed toolbar, max ~96px tall; less than the shortest
  section, 158px, so a clicked section keeps the highlight). Sections the page cannot scroll
  that far (short sections at the end) get evenly spaced points between an earlier section
  and the bottom of the page; the spread starts early enough to give each at least MIN_BAND
  = 100px of scroll. The last section's point is the bottom, so "bottom → last section"
  still holds. Not scrolled yet (e.g. on load at the top) → first section.
  (Autonomous run change, 2026-10-01; see "Decisions for review".) A URL hash works through the
  browser's own jump plus the scroll/hashchange/load updates.
- Output = Bootstrap's: only `.active` on the nav-link (compared: Bootstrap set no
  aria-current or other attributes).
- Click: preventDefault, `scrollTo({ top: section.offsetTop - #bs-demo.offsetTop, behavior:
  'smooth' })`, hash unchanged: same formula and landing as Bootstrap. When that position is
  past the bottom of the page, or the section's point was spread, the click lands on the
  activation point instead (so the clicked link is the one highlighted). Same when the usual
  landing position would already activate the next section (spread points can be closer
  than 120px). The existing nav
  click handler still closes the offcanvas below lg.
- Updates: rAF-throttled on scroll, resize (passive), hashchange, load, plus once at start.
  No globals, inside the run-once guard, no Bootstrap dependency (any bundle load order).
- Why not Bootstrap ScrollSpy: it highlights the lowest newly intersecting section while
  scrolling down. Tuning (threshold steps, root margins -40…-90%) was tried; the best,
  threshold 0…1 + root margin -85%, still failed the last section whenever the page cannot
  scroll it into the top band (forms.html Select at 1400px).
- Results (Chromium + WebKit, 1400/576px, window heights 700/900/1200, tools/spytest.js):
  24/24 PASS (load, every click, scroll down and back up, incl. Shadows/Focus ring and the
  last section on both pages). Phase-1 capture (snippets, toggles, Show code, theme, Custom
  CSS, tokens, offcanvas sidebar, toolbar/sidebar/tokens DOM): byte-identical before/after on
  both pages, also with the bundle in `<head>` and the script twice. Landing after clicks:
  358/360 identical; 2 differ only where Bootstrap stopped 21px short (WebKit, Alerts), now 0.
  Hash on load and hashchange: correct in both engines (after the smooth scroll settles;
  Bootstrap's reboot sets scroll-behavior: smooth on :root). No JS errors.
- tools/spytest.js: see its header (Node + Playwright, installed outside the repo, run with
  NODE_PATH). tools/ is NOT part of the #bs-demo fragment.

### Toolbar (fixed, top-right)
- "Sections" button, shown below lg only: opens the sidebar offcanvas.
- Page switch (Classes / Forms) right after it, only on pages with data-bsd-page.
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
3. Button group: done, awaiting review.
4. Placeholders: done, awaiting review.
5. Cards additions: done, reviewed (2026-09-30); mixed-ratio grid kept as anti-pattern before
   the 4:3 fix. (Navs, List group, Navbar, Typography, Tables additions and the Helpers section
   are skipped, see "Skipped".)
6. Utility scales: done, awaiting review.
7. forms.html: tooling-sharing plan approved (phases 1–4, see "forms.html tooling sharing");
   phases 1–3 done. Then sections, then remove Form controls from classes.html and add the link.
8. blocks.html (interactive components: dropdowns incl. dropdown-menu-dark, collapse, modal,
   offcanvas, carousel, toast, tooltip, popover, scrollspy; navbar/navs).
9. Audit backlog pass (separate, when the user says so).

## User findings
1. use webp for images instead of jpeg — done.
2. For images, add examples of Bootstrap `object-fit-*` classes (cover, contain, fill, scale, none)
      and an `object-position: top` comparison on a portrait photo of a person
      (inline style; Bootstrap has no object-position utility) — done (Images and Cards).

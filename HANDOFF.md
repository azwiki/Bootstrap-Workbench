# Handoff: classes.html, forms.html, blocks.html

## Autonomous run summary (2026-10-01)
Started at tag `pre-autonomous` (4f5c814). All parts done: A (forms.html steps 3–9),
B (blocks.html, 18 sections), C (audit backlog pass on classes.html), D (this cleanup).
Nothing is blocked. Every commit passed its checks before it was made (see "Testing").

`git log --oneline pre-autonomous..HEAD`, oldest first:
- 5b34698 forms: Checks & radios section (checkbox states incl. indeterminate via JS, radios in a fieldset, switches, inline, reverse, label-less)
- 477ea48 HANDOFF: autonomous run log
- e327267 forms: Range section (default, disabled, min/max, step)
- 889440b forms: Input group section (text/button/checkbox/radio addons, sizing, select/file, nowrap)
- 26c1b84 forms: Floating labels section (input, textarea, select, states, in input group, grid)
- 0cf601b forms: Form layout section (utilities, grid, horizontal, label sizing, column sizing, auto, inline)
- 424bb8b forms: Validation section (is-valid/invalid, checks/radios/switch/file, has-validation, was-validated, tooltips, floating)
- 82823de classes: forms content moved to forms.html, link in its place (#bsd-forms kept as a short link section)
- 617b1f8 HANDOFF: blocks.html plan
- fbf32aa blocks.html skeleton, Blocks in the page switch, Bootstrap inits in bsd-demo.js (tooltips, popovers, live toast)
- bd899cd blocks: Dropdowns section (single, split, directions, menu content, dark incl. deprecated dropdown-menu-dark, input group)
- ebc9224 blocks: Collapse section (link/button toggles, one button for two targets)
- b5d62d8 blocks: Modal section (default, static backdrop, scrollable centered, sizes, fullscreen)
- e7607e2 blocks: Offcanvas section (start, top/end/bottom, body scrolling, static backdrop)
- 2f8c7c5 blocks: Carousel section (controls/indicators/captions, fade, dark incl. deprecated carousel-dark)
- 2453af9 blocks: Toasts section (static, live from a button, color schemes, custom content)
- 7a4649b blocks: Tooltips section (placements, disabled button wrapper, inline link)
- abda7f0 blocks: Popovers section (placements, dismiss on next click, disabled button wrapper)
- cbeee7c Sidebar scrollspy: activation points for sections at the end of the page
- 68a29de blocks: ScrollSpy section (Bootstrap ScrollSpy in a .ratio scroll box)
- 17355fd blocks: Navbar section (light, dark, offcanvas navbar; working collapse and dropdowns)
- 5596c5e Sidebar scrollspy: click lands on the activation point when the next section would win
- 59abffc blocks: Navs & tabs section (tabs, pills, vertical pills with working panes)
- ed4e525 blocks: Hero section (image + text, centered)
- 035e27b blocks: Features section (3 columns, tiles beside text)
- 1885ec9 blocks: Pricing section (3 cards, featured card)
- 0a797a0 blocks: Testimonials section (card quotes, one large quote)
- 8f750bc blocks: Call to action section (banner, inline bar)
- 19f3ab1 blocks: Contact form section (address + form, never submits)
- 73900aa blocks: Footer section (columns, simple)
- c9a956b HANDOFF: blocks.html final check
- 4d5b77a Snippet generator: data-demo-unwrap and data-demo-drop
- 283c562 … 349a71a classes audit: one commit per section (Colors, Text colors, Borders & rounded,
  Links, Buttons, Typography, Images + anti-pattern (b), Alerts, Badges, Spinners, Pagination,
  Focus ring, List group, Tables, Progress, Navbar, Navs & tabs, Breadcrumb, Accordion, Shadows,
  Cards): demo wrappers and demo-only classes out of the snippets, page pixel-identical
- fe13f5b HANDOFF: audit backlog resolved
- (this commit) HANDOFF and CLAUDE.md: final cleanup

### Decisions for review (autonomous run)
1. Sidebar scrollspy, end of page (cbeee7c, 5596c5e): sections the page cannot scroll up to
   the 120px line get evenly spaced activation points (at least 100px each) in the last part
   of the scroll range; a click on such a section, or one whose usual landing would already
   activate the next section, lands on its activation point instead of the window top.
   Landing for all other sections is unchanged. Alternative: bottom padding/spacer.
2. Snippet generator `data-demo-unwrap` / `data-demo-drop` (4d5b77a) as the audit-pass method:
   snippets lose demo wrappers while the page stays pixel-identical. Alternative: rebuild the
   grids with per-column labels (visible change).
3. Anti-pattern (b) snippet = only the two img tags (captions data-demo-skip); anti-pattern (a)
   keeps its row/col (the narrow column is what breaks) (98214e2).
4. Carousel `slide` kept although it is not in bootstrap.min.css: it is a JS hook in the local
   5.3.8 bundle and canonical markup (2f8c7c5). Alternative: no slide animation.
5. blocks.html scope (617b1f8): dropdown/segmented buttons in input groups live in blocks.html
   Dropdowns; collapse-horizontal left out (needs an inline width); testimonials without photos;
   accordion not repeated (on classes.html). Hero image picsum 201 instead of the planned 48
   (48 shows a brand logo).
6. Helper classes kept in snippets as documented exceptions (like Utility scales): swatch /
   sample-box helpers in Colors, Borders & rounded, Shadows, Text colors (p-2, p-3, border-2,
   bg-body-tertiary, px-1 with bg-dark/bg-white). Without them the samples are invisible.

### Blocked (autonomous run)
- None.

### Check by eye first (browser review)
- blocks.html at 1400px and 576px, light and dark: Dropdowns (dark menus), Carousel (dark
  variants on light images), Toasts (live toast bottom-right), Navbar (dark, offcanvas
  navbar), Navs & tabs (vertical pills at 576), ScrollSpy box, Hero (image at 576), Pricing.
- forms.html at 576px: Validation tooltips (valid-tooltip / invalid-tooltip), Floating labels
  grid, Form layout horizontal form.
- classes.html: open a few snippets (Colors, Cards, Images anti-pattern (b), Typography) and
  check they read as copy-ready markup.
- The fixed toolbar (now three page-switch links) wraps to two rows between about 691px and
  557px and covers the top of the h1 until you scroll (accepted earlier for two links).
- Sidebar highlight at the end of each page (Footer on blocks.html, Forms on classes.html,
  Validation on forms.html) when scrolling and when clicking.

## Start here (cold start)
- Run `git log -1 --oneline` and `git status --short`; report anything unexpected.
- Next step: user browser review of the autonomous run (see "Check by eye first"). No open
  implementation task.
- Review tip: Safari Private Window or Develop → Disable Caches (with Web Inspector open).
  Safari caches the local site aggressively and can show stale HTML/CSS.

## Current state

### Loading (all three pages)
- Bootstrap 5.3.8 from jsDelivr, pinned, with SRI; local assets/css/bootstrap.min.css and
  assets/js/bootstrap.bundle.min.js only as commented-out fallback lines.
- assets/css/main.css (relative path) is the only local reference: a single page copied into
  another folder together with main.css works.
- bsd-demo.js is inlined before </body> between `<!-- bsd-demo:start -->` and
  `<!-- bsd-demo:end -->`. Edit assets/js/bsd-demo.js, then run `zsh tools/sync-demo.sh`
  (idempotent; exits non-zero if a marker is missing). Never edit the inline copies.
- Planned: after the GitHub publish, replace the marker block with a jsDelivr gh URL
  (`https://cdn.jsdelivr.net/gh/<user>/<repo>@<tag>/assets/js/bsd-demo.js`) pinned to a tag.

### Pages (all inline assets/js/bsd-demo.js; data-bsd-page drives the page switch)
- classes.html (`data-bsd-page="classes"`), 27 sections, 136 examples: Colors, Color modes,
  Text colors, Borders & rounded, Links, Buttons, Button group, Close button, Typography,
  Images, Alerts, Badges, List group, Tables, Cards, Progress, Spinners, Placeholders, Navbar,
  Navs & tabs, Pagination, Breadcrumb, Accordion, Shadows, Focus ring, Utility scales, Forms
  (a short section that links to forms.html).
- forms.html (`data-bsd-page="forms"`), 9 sections, 60 examples: About this page, Form controls,
  Select, Checks & radios, Range, Input group, Floating labels, Form layout, Validation.
- blocks.html (`data-bsd-page="blocks"`), 19 sections, 50 examples: About this page, Dropdowns,
  Collapse, Modal, Offcanvas, Carousel, Toasts, Tooltips, Popovers, ScrollSpy, Navbar, Navs &
  tabs, Hero, Features, Pricing, Testimonials, Call to action, Contact form, Footer.
- `<!-- bsd:continue -->` marks the end of the content on each page. New sections need only
  `<section id="bsd-…" class="py-4">` with an `h2.h4`; the previous last section gets
  `border-bottom`. Sidebar links are generated from the h2.
- Images: classes.html 131 img / 75 URLs / 58 ids; blocks.html 16 img / 8 URLs / 7 ids;
  forms.html none. 64 picsum ids in total, all WebP, all verified with curl -sIL.

### Tooling (assets/js/bsd-demo.js, inlined as a classic script before </body>)
- Run-once guard (`data-bsd-tooling` on #bs-demo); works with the bundle before or after it.
- Builds the fixed toolbar (Sections button below lg, page switch, theme toggle, Custom CSS
  switch with count, Show code switch, Tokens button), the sidebar column (offcanvas-lg,
  links from `section[id^="bsd-"] > h2`) and the tokens offcanvas.
- Page switch: PAGES list (classes, forms, blocks); `nav.btn-group.btn-group-sm`, current page
  `active` + `aria-current="page"`. No data-bsd-page → no switch (remove the attribute when
  pasting the fragment into another site).
- Theme (`bsd-theme`) and Show code (`bsd-code`) persist in localStorage; shared between the
  pages over file:// (Chromium, WebKit) and http (real Safari, checked by the user).
- Snippet generator: see "Conventions".
- Sidebar scrollspy (custom; Bootstrap ScrollSpy is not used on <main>): active section = the
  last one whose activation point (top at 120px, below the toolbar) is reached; sections the
  page cannot scroll that far share the rest of the scroll range (at least 100px each), so
  the bottom means the last section. Click: smooth scroll to the section top (same formula as
  Bootstrap), or to its activation point when the top is out of reach or the next section
  would already be active; the URL hash is not changed; the offcanvas closes below lg.
- Demo-only JS, keyed by id: indeterminate checkbox (#bsd-f-check-indeterminate); tooltips and
  popovers initialized for every `[data-bs-toggle]` inside #bs-demo; `submit` cancelled for
  every form inside #bs-demo.
- Demo snippets that need JS carry their own inline `<script>` inside data-demo (run on
  DOMContentLoaded, part of the copied snippet): live toast (#bsd-toast-live-btn →
  #bsd-toast-live), every tooltip and popover example on blocks.html. The generator re-indents
  script content.

### Conventions
- Snippet generator: example markup in `<div data-demo>`; snippets are generated from its
  children, never written by hand. Removed from snippets: `[data-demo-skip]` elements, all
  `data-demo*` attributes, the data-demo element's own attributes. `data-demo-unwrap` on a
  wrapper: the snippet shows its children instead. `data-demo-drop="cls …"`: those classes are
  left out of that element in the snippet. If data-demo's parent is `.ratio`, the snippet and
  toggle go around the ratio. Each example has an h3–h6 heading that receives the `</>` toggle
  (notes go ABOVE the heading, or the toggle falls back to a bar).
- Grids of examples: row/col outside data-demo with an `h4.small` label per column; flex rows
  of variants: layout classes on the data-demo element; single examples sized with
  `col-md-8 col-lg-6` (or similar) on the data-demo element.
- Snippets that keep row/col on purpose say so in the demo text: Form layout, the Floating
  labels grid, Collapse multiple targets, ScrollSpy box (.ratio for the height), all
  blocks.html page blocks, the two Cards grids, anti-pattern (a).
- Ids: unique per page. Control ids `bsd-f-*` (forms), `bsd-b-*` (blocks); section ids
  `bsd-<section name>`.
- Accessibility: every control has a label (visually-hidden or aria-label where the pattern
  needs it), help/feedback via aria-describedby, fieldsets with legends, tab ARIA per
  Bootstrap, menu items as `button.dropdown-item`, no "#" links that change the hash.
- Deprecated in 5.3, shown next to the modern form and labeled "(deprecated in 5.3)":
  btn-close-white, dropdown-menu-dark, carousel-dark.
- Inline styles in demo content: only the two documented exceptions (object-position: top;
  width: N% on progress bars). Demo tooling is exempt but never restyles Bootstrap.
- Images: picsum ids from v2/list, checked visually at the planned size, WebP URL with matching
  width/height, original alt, decoding="async", loading="lazy" below the first screen.
  Avatars 64, 91, 65, 177; logo 63; portrait 1027; carousel 10, 28, 235 and light 215, 201, 131;
  hero 201.

### Testing
- tools/spytest.js (in the repo): sidebar scrollspy on every page, Chromium + WebKit, 1400/576,
  window heights 700/900/1200 (load, every click, scroll down and up). Last result: 36/36.
- The other check scripts lived in the session scratchpad (not in the repo): check.js
  (errors, overflow, toggles, clean snippets, accessible names, no navigation on Enter/submit;
  file:// and http://mini.local), static.sh (classes grep-verified in bootstrap.min.css or
  used as a hook by the bundle, duplicate ids, image checks), interaction scripts per
  component (open/close by mouse and keyboard, Esc where Bootstrap supports it — only
  dropdown, modal, offcanvas — focus return), capture2.js (baseline recording of snippets,
  tooling behavior and tooling DOM), section screenshots for the audit pass.

## Known issues / open
- Toolbar wraps to two rows between ~691px and ~557px (accepted).
- Grid examples with one data-demo per column open their snippet inside the narrow column.
- Portrait 1027 in ratio-4x3 with object-position: top cuts the chin (accepted, id final).
- Bootstrap tooltips, popovers and toasts have no Esc handling in 5.3.8 (Bootstrap design).
- Offcanvas with data-bs-scroll and no backdrop handles Esc only with focus inside the panel.

## Decision history (short)
- 2026-09-30: section plan for classes.html; Cards grids kept as anti-pattern → fix pair.
- 2026-10-01: tooling moved to bsd-demo.js (shared by all pages); toolbar/sidebar/tokens built
  by JS; forms.html and the page switch; custom sidebar scrollspy (Bootstrap ScrollSpy could
  not highlight the last sections); tools/spytest.js added.
- 2026-10-01 (autonomous run): forms.html completed, forms content removed from classes.html,
  blocks.html built, snippet audit pass done (see the summary at the top).
- User findings: WebP images (done); object-fit-* and object-position: top comparisons (done).

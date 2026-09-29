# Handoff: classes.html

## Current state

Sections in `classes.html`, in page order (all listed in the sidebar):
Colors, Text colors, Borders & rounded, Links, Buttons, Typography, **Images** (new),
Alerts, Badges, List group, Tables, Cards, Progress, Spinners, Navbar, Navs & tabs,
Pagination, Breadcrumb, Accordion, Shadows, Focus ring, Form controls.

`<!-- bsd:continue -->` marks where new sections go (after Form controls).

### Images task: done (not yet reviewed in a browser)
- New "Images" section: img-fluid, img-thumbnail, rounded-*, avatars (32/48/64/96, border-*),
  shadows on images and thumbnails, border colors/widths, figure, alignment, object-fit-*,
  ratio-*, opacity-*, srcset + sizes, media object, anti-patterns (a) and (b).
- Cards: card-img-top on text-bg-* (8 colors), card-img-bottom, card-img-overlay (2),
  horizontal cards (2), card-group and row-cols grid with mixed aspect ratios,
  border-0 + shadow-*, avatars in header/body/footer. The original color cards are unchanged.
- Shadows: shadow-* on image cards.
- List group: avatar items (static and action variants).
- Navbar: 24px image logo in all 4 navbar brands.
- Totals: 118 `<img>` tags, 51 picsum IDs, 68 unique URLs.

Checked by script (JPEG era): every img has width/height matching the URL and alt text.
The only exception is anti-pattern (b), which has no dimensions on purpose. Tags are balanced.
Pending: convert all URLs to .webp and re-verify (Content-Type: image/webp).
Pending: navbar logo must lose loading="lazy" (above the fold).

## Status

- All work up to this handoff is committed on `main` (commit "WIP: end of day, add HANDOFF.md").
- Previous milestone: `895d747` — classes.html generator and toolbar working.
- Start of next session: run `git log -1 --oneline` and `git status --short`.
  If the working tree is not clean, report the changes before doing anything else.

## Known issues
- The page has not been checked visually in a browser since the images were added.
- Anti-pattern (a) (1200×800 image without img-fluid) makes its demo box about 800px tall.
- The navbar logo has alt "Northwind Studio logo" next to the visible brand text, which makes
  screen readers say the name twice. `alt=""` would be more correct there. Waiting on a user decision.


## Decisions so far

### Snippet generator
- Example markup goes in `<div data-demo>`. The inline script clones its children, drops
  `[data-demo-skip]` elements and `data-demo*` attributes, pretty-prints with 2-space indent,
  and inserts `<pre><code>` with a Copy button after the example.
- Snippets are collapsed by default. Each example gets a `</>` toggle, placed in the preceding
  h3–h6 heading if there is one, otherwise in a small bar above the example.
- A "Show code" switch in the toolbar opens all snippets. Its state is saved in localStorage (`bsd-code`).
- Attributes on the `data-demo` element itself are not part of the snippet. The anti-pattern
  boxes use this to keep the clipping wrapper out of the copied code.

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

### Images
- Format: WebP only. URL: https://picsum.photos/id/{id}/{w}/{h}.webp
  (IDs from https://picsum.photos/v2/list?page=1..2&limit=100).
- Verification: curl -sIL on every URL, Content-Type must be image/webp.
- demo-old.html image URLs are not reused (Unsplash).
- Every img: width/height equal to the URL size, original alt, decoding="async";
  loading="lazy" only below the first screen.
- .card-img-* images also get img-fluid (height attribute stretches them otherwise).
- Fixed-size image boxes use .ratio ratio-* wrappers, never inline height/width.
- Only inline style in the project: style="object-position: top;" in the
  object-position comparison (Bootstrap has no utility for it).
- Avatars: IDs 64, 91, 65, 177 (Lena Varga, Tomas Reyl, Ines Moreau, Jonah Pike). Logo: ID 63.

## Next steps
1. Review the Images, Cards, Shadows, List group and Navbar sections in a browser,
   in light and dark mode and at mobile width.
2. Decide on the navbar logo alt and on the anti-pattern (a) box height.
3. Commit the work.
4. Continue adding sections at `<!-- bsd:continue -->`.

## User findings
1. use webp for images instead of jpeg
2. For images, add examples of Bootstrap `object-fit-*` classes (cover, contain, fill, scale, none)
      and an `object-position: top` comparison on a portrait photo of a person
      (inline style; Bootstrap has no object-position utility).

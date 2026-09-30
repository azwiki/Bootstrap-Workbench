# Handoff: classes.html

## Current state

Sections in `classes.html`, in page order (all listed in the sidebar):
Colors, Text colors, Borders & rounded, Links, Buttons, Typography, Images,
Alerts, Badges, List group, Tables, Cards, Progress, Spinners, Navbar, Navs & tabs,
Pagination, Breadcrumb, Accordion, Shadows, Focus ring, Form controls.

`<!-- bsd:continue -->` marks where new sections go (after Form controls).

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
Snippets checked in a headless DOM dump: no row/col grid wrappers and no .ratio wrapper
around anti-pattern (a) in the copied code.

## Status

- Last commit: `06983dd` (object-fit/object-position, ratio examples, anti-pattern (a) wrapper).
- Uncommitted: navbar logo alt=""/no lazy, anti-patterns alert rewording, this HANDOFF.md.
- Start of next session: run `git log -1 --oneline` and `git status --short`.
  If the working tree is not clean, report the changes before doing anything else.

## Known issues
- Not yet reviewed in a real browser. Headless Chrome was checked at 1400px in light mode only;
  mobile width and dark mode are unchecked.
- Grid examples (object-fit-*, portrait comparison, ratio-*, Cards comparison) have one
  data-demo per column, so an opened snippet renders inside its narrow column. Accepted for now.
- Portrait ID 1027 is a tight head shot: in ratio-4x3 the object-position: top crop keeps the
  top of the head but cuts the mouth and chin. Accepted (ID 1027 is final).

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
1. Review Images, Cards, Borders & rounded, Progress, Shadows, List group, Navbar in a browser
   (light/dark, mobile width).
2. Commit.
3. Continue adding sections at `<!-- bsd:continue -->`.

## User findings
1. use webp for images instead of jpeg — done.
2. For images, add examples of Bootstrap `object-fit-*` classes (cover, contain, fill, scale, none)
      and an `object-position: top` comparison on a portrait photo of a person
      (inline style; Bootstrap has no object-position utility) — done (Images and Cards).

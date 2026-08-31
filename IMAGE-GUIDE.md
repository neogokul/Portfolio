# Image Guide

The site automatically detects whatever images actually exist in `images/` for
each project — you don't need to pre-declare a fixed number per project. Drop
in 1 photo, 10 photos, or none at all, and the page adapts:

- **0 images** → the project card and detail page show "Currently Under R&D —
  No Photos Available" instead of an empty box.
- **1 image** → shows just the large image, no thumbnail rail.
- **2+ images** → shows the first as the main image, with a thumbnail rail
  underneath to switch between the rest.

**Format:** `.png`, `.jpg`, `.jpeg`, or `.webp`. **The file must actually be
that format** — renaming a `.HEIC` file to `.png` does not convert it, and
browsers will fail to display it. Convert with an actual HEIC→JPG/PNG tool
first (iPhone: Settings → Camera → Formats → "Most Compatible" prevents this
for future photos).

## Naming convention

Name files `<slug>-<n>`, `<slug>-<n>.<sub>`, or with an optional caption in
brackets — `<slug>-<n>(<caption>)` / `<slug>-<n>.<sub>(<caption>)`:

- `<n>` is the stack/group number — every file sharing the same `<n>` is
  clubbed into one tight visual cluster of thumbnails instead of a long flat
  row. Stacks display left to right in ascending `<n>` order. Checked up to
  `<n> = 15` in the fallback mode (see "How this works" below); no limit when
  the live listing is available.
- `.<sub>` (optional) orders images *within* a stack — `1.1`, `1.2`, `1.3` all
  belong to stack 1 and appear in that order inside it. Leave it off
  (`<slug>-2`) for a stack with just one image. Checked up to `.6` per stack
  in fallback mode.
- `(<caption>)` (optional) — whatever text is in the parentheses is shown
  under that thumbnail stack verbatim (e.g. "Version 3", "Test Prototype",
  anything). If a stack has multiple images and only one carries a caption,
  that caption is still shown for the whole stack. Renaming just the
  bracketed text on GitHub updates the caption immediately — no code change.

| Case Study | Slug |
|---|---|
| Aphid Monitoring Device | `aphid-monitor` |
| Anti-Hail Net Device | `anti-hail-net` |
| Automated Sorting & Handling Line | `sorting-system` |
| Cold-Tunnel Hibernation Sorter | `hibernation-tunnel` *(uses `hibernation-tunnelv-` instead of `hibernation-tunnel-`, see below)* |
| AI-Guided Trolley Loader | `loader-system` |
| Single-Actuator Inversion & Separation | `inversion-separation` |
| Non-Contact Channeliser | `channelising-system` |
| Intelligent Decision-Gate Routing | `decision-gate` |
| Fail-Safe Distribution | `distribution-system` |
| Non-Contact Cage & Pooter | `cage-system` |
| Low-Cost Arm Rehabilitation Device | `arm-rehab` |

**Examples:**
- `sorting-system-1.1.png`, `sorting-system-1.2.jpg`, `sorting-system-1.3.png`
  → all three club together into one stack (they share `1` before the
  decimal) and appear as one cluster of 3 clickable thumbnails, in
  `.1`/`.2`/`.3` order.
- `sorting-system-1.5(Test Prototype).jpg` → clubs into that same stack 1
  (still shares the leading `1`) and makes the whole stack's caption "Test
  Prototype".
- `sorting-system-2` would be a separate, second stack.

### Cold-Tunnel Hibernation Sorter

Same rules as above, but this project's files use `v-` instead of a plain
hyphen after the slug: `hibernation-tunnelv-<stack>.<sub>(<caption>).<ext>` —
e.g. `hibernation-tunnelv-1.1(Version 3).jpg`, `hibernation-tunnelv-3.1(Version 1).jpg`.

## How this works technically

The page fetches the live `images/` file listing from GitHub's API once per
page load and matches every project's photos out of it by filename pattern —
this is what makes bracketed captions possible, and why renaming a file (or
just its caption) on GitHub takes effect immediately with no code change.

The one caveat: GitHub's public API allows 60 such requests per hour per
visitor IP address. If a visitor's browser happens to hit that limit, the
page automatically falls back to guessing plain `<slug>-<n>` / `<slug>-<n>.<sub>`
filenames directly (up to `<n>=15`, `<sub>=6`) — photos still show, just
without captions until the next page load succeeds against the live listing.
For normal portfolio traffic this fallback essentially never triggers.

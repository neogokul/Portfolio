# Image Guide

The site automatically detects whatever images actually exist in `images/` for
each project — you don't need to pre-declare a fixed number per project. Drop
in 1 photo, 10 photos, or none at all, and the page adapts:

- **0 images** → the project card and detail page show "Photos coming soon"
  instead of an empty box.
- **1 image** → shows just the large image, no thumbnail rail.
- **2+ images** → shows the first as the main image, with a thumbnail rail
  underneath to switch between the rest.

**Format:** any of `.png`, `.jpg`, `.jpeg`, `.webp` work — no need to match
extensions, the page tries each one automatically. **The file must actually be
that format** — renaming a `.HEIC` file to `.png` does not convert it, and
browsers will fail to display it. Convert with an actual HEIC→JPG/PNG tool
first (iPhone: Settings → Camera → Formats → "Most Compatible" prevents this
for future photos).

## Naming convention

For every project **except** Cold-Tunnel Hibernation Sorter, name files
`<slug>-<n>` or `<slug>-<n>.<sub>`:

- `<n>` is the stack/group number — every file sharing the same `<n>` is
  clubbed into one tight visual cluster of thumbnails (a shared border, no
  individual labels), instead of a long flat row. Stacks display left to
  right in ascending `<n>` order. Checked up to `<n> = 15`.
- `.<sub>` (optional) orders images *within* a stack — `1.1`, `1.2`, `1.3` all
  belong to stack 1 and appear in that order inside it. Leave it off
  (`<slug>-2`) for a stack with just one image. Checked up to `.6` per stack.

| Case Study | Slug |
|---|---|
| Aphid Monitoring Device | `aphid-monitor` |
| Anti-Hail Net Device | `anti-hail-net` |
| Automated Sorting & Handling Line | `sorting-system` |
| Cold-Tunnel Hibernation Sorter | *(special naming — see below)* |
| AI-Guided Trolley Loader | `loader-system` |
| Single-Actuator Inversion & Separation | `inversion-separation` |
| Non-Contact Channeliser | `channelising-system` |
| Intelligent Decision-Gate Routing | `decision-gate` |
| Fail-Safe Distribution | `distribution-system` |
| Non-Contact Cage & Pooter | `cage-system` |
| Low-Cost Arm Rehabilitation Device | `arm-rehab` |

**Example:** `sorting-system-1.1.png`, `sorting-system-1.2.jpg`,
`sorting-system-1.3.png` → all three club together into one stack (since they
share `1` before the decimal) and appear as one cluster of 3 clickable
thumbnails, in `.1`/`.2`/`.3` order. `sorting-system-2` would be a separate,
second stack.

### Cold-Tunnel Hibernation Sorter (special case)

This project additionally reads a caption out of the filename, so you can
rename these on GitHub whenever you like **without asking me to update the
code**. Name files:

```
hibernation-tunnelv-<stack>.<sub>(<label you want shown>).<ext>
```

Same stacking rules as above (`<stack>` clubs images together, `.<sub>` orders
them within the stack), plus:

- `<label you want shown>` — whatever text is in the parentheses is shown
  under the stack verbatim (e.g. "Version 3", "Prototype Version 1", anything).
  If a stack has multiple images, they should all carry the same label text —
  it's shown once per stack.

**Example:** `hibernation-tunnelv-1.1(Version 3).jpg`,
`hibernation-tunnelv-2.1(Version 2).jpg`, `hibernation-tunnelv-3.1(Version 1).jpg`,
`hibernation-tunnelv-3.2(Version 1).jpg`, `hibernation-tunnelv-3.3(Version 1).jpg`
→ renders as three stacks: "Version 3", "Version 2", and "Version 1" (the last
one clubbing 3 images together).

**How this works technically:** unlike every other project (which the browser
checks directly for known filenames), this one page also fetches the live file
listing from GitHub's API, so a bracket-text rename takes effect the moment
you save it on GitHub — no code change, ever. The one caveat: GitHub's public
API allows 60 such requests per hour per visitor IP address; for normal
portfolio traffic this is a non-issue, but if it's ever exceeded, this
project's photos temporarily show "Photos coming soon" until the hour resets,
rather than an error. Every other project is unaffected since they don't use
this lookup.

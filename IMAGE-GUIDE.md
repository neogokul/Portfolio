# Image Guide

Each case study on the site shows 3 image slots. Drop your edited (Krea-rendered)
images into the `images/` folder using the **exact base filename** below, in
**any format** — `.png`, `.jpg`, `.jpeg`, or `.webp` all work, no need to match
extensions or rename exports. The page tries each format automatically and
picks whichever one exists. An empty slot just shows a placeholder with the
expected base filename until you add the file.

| Case Study | Base filenames |
|---|---|
| Automated Sorting & Handling Line | `sorting-system-1`, `sorting-system-2`, `sorting-system-3` |
| Cold-Tunnel Hibernation Sorter | `hibernation-tunnel-1`, `hibernation-tunnel-2`, `hibernation-tunnel-3` |
| AI-Guided Trolley Loader | `loader-system-1`, `loader-system-2`, `loader-system-3` |
| Single-Actuator Inversion & Separation | `inversion-separation-1`, `inversion-separation-2`, `inversion-separation-3` |
| Non-Contact Channeliser | `channelising-system-1`, `channelising-system-2`, `channelising-system-3` |
| Intelligent Decision-Gate Routing | `decision-gate-1`, `decision-gate-2`, `decision-gate-3` |
| Fail-Safe Distribution | `distribution-system-1`, `distribution-system-2`, `distribution-system-3` |
| Non-Contact Cage & Pooter | `cage-system-1`, `cage-system-2`, `cage-system-3` |
| Low-Cost Arm Rehabilitation Device | `arm-rehab-1`, `arm-rehab-2`, `arm-rehab-3` |

**Example:** for the first slot of "Automated Sorting & Handling Line", any of
`images/sorting-system-1.png`, `images/sorting-system-1.jpg`, or
`images/sorting-system-1.jpeg` will show up — no code change needed.

**Notes**
- Slot `-1` renders large (top), slots `-2` and `-3` render side by side below it.
- You don't need all 3 per project — any missing slot just stays a labelled placeholder.
- If a base name matches more than one file extension (e.g. both `.png` and
  `.jpg` exist for the same slot), the page uses `.png` first, then `.jpg`,
  then `.jpeg`, then `.webp` — delete the one you don't want to avoid confusion.
- Need more than 3 images for a project? Say so and I'll extend that project's gallery
  (e.g. add a `-4` slot) — it's a small code change per project, not a rebuild.

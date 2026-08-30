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
| Cold-Tunnel Hibernation Sorter | `hibernation-tunnelv3-1`, `hibernation-tunnelv2-2`, `hibernation-tunnelv1-3`, `hibernation-tunnelv1-4`, `hibernation-tunnelv3-5` (5 slots — see note below) |
| AI-Guided Trolley Loader | `loader-system-1`, `loader-system-2`, `loader-system-3` |
| Single-Actuator Inversion & Separation | `inversion-separation-1`, `inversion-separation-2`, `inversion-separation-3` |
| Non-Contact Channeliser | `channelising-system-1`, `channelising-system-2`, `channelising-system-3` |
| Intelligent Decision-Gate Routing | `decision-gate-1`, `decision-gate-2`, `decision-gate-3` |
| Fail-Safe Distribution | `distribution-system-1`, `distribution-system-2`, `distribution-system-3` |
| Non-Contact Cage & Pooter | `cage-system-1`, `cage-system-2`, `cage-system-3` |
| Low-Cost Arm Rehabilitation Device | `arm-rehab-1`, `arm-rehab-2`, `arm-rehab-3` |
| Aphid Monitoring Device | `aphid-monitor-1`, `aphid-monitor-2`, `aphid-monitor-3` |
| Anti-Hail Net Device | `anti-hail-net-1`, `anti-hail-net-2`, `anti-hail-net-3` |

**Example:** for the first slot of "Automated Sorting & Handling Line", any of
`images/sorting-system-1.png`, `images/sorting-system-1.jpg`, or
`images/sorting-system-1.jpeg` will show up — no code change needed.

**Notes**
- Slot `-1` is used as the homepage card thumbnail and as the default large image
  on that project's detail page (`work/<slug>.html`); the remaining slots appear as
  thumbnails in the detail page's viewer rail — click one to swap the large image.
- You don't need every slot for a project — any missing one just stays a labelled placeholder.
- **Cold-Tunnel Hibernation Sorter is a special case**: it has 5 image slots instead
  of 3, named `hibernation-tunnelv<version>-<order>`. The `v<version>` part is just a
  label shown under each thumbnail ("Version 1/2/3") — display order is controlled
  entirely by the trailing `-<order>` number (1 through 5), regardless of which
  version it is. So `hibernation-tunnelv3-1` always shows first and
  `hibernation-tunnelv3-5` always shows last, even though both are "Version 3".
- If a base name matches more than one file extension (e.g. both `.png` and
  `.jpg` exist for the same slot), the page uses `.png` first, then `.jpg`,
  then `.jpeg`, then `.webp` — delete the one you don't want to avoid confusion.
- Need more than 3 images for a project? Say so and I'll extend that project's gallery
  (e.g. add a `-4` slot) — it's a small code change per project, not a rebuild.

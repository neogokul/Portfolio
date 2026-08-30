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
extensions, the page tries each one automatically.

## Naming convention

For every project **except** Cold-Tunnel Hibernation Sorter, name files
`<slug>-1`, `<slug>-2`, `<slug>-3`, … up to as many as you have (checked up to
15). Numbers don't need to be contiguous, but sequential from 1 is simplest.

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

**Example:** `images/sorting-system-1.png`, `images/sorting-system-2.jpg` — the
page will show both, in that order, even though slot `-3` doesn't exist.

### Cold-Tunnel Hibernation Sorter (special case)

This project uses a fixed, explicit set of 5 filenames instead of the generic
numbering, because its images are versioned:

```
hibernation-tunnelv3-1   (shown 1st, labelled "Version 3")
hibernation-tunnelv2-2   (shown 2nd, labelled "Version 2")
hibernation-tunnelv1-3   (shown 3rd, labelled "Version 1")
hibernation-tunnelv1-4   (shown 4th, labelled "Version 1")
hibernation-tunnelv3-5   (shown 5th, labelled "Version 3")
```

Display order follows the trailing `-<order>` number only, regardless of
version — any of these can be missing and the rest still show correctly. If
you need to add or change which files exist for this project beyond these 5,
tell me and I'll update the list in `assets/site.js`.

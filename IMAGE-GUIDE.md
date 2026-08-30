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

This project reads its caption text straight out of the filename, so you can
rename these on GitHub whenever you like **without asking me to update the
code**. Name files:

```
hibernation-tunnelv-<order>(<label you want shown>).<ext>
```

- `<order>` controls display position (1, 2, 3, …) — purely a sort key, not
  shown anywhere.
- `<label you want shown>` — whatever text you put in the parentheses is
  displayed verbatim as that photo's caption/thumbnail label (e.g. "Version 3",
  "Prototype Version 1", anything).
- `<ext>` must be `png`, `jpg`, `jpeg`, or `webp` — **not `.HEIC`**, which
  iPhones save by default but browsers cannot display at all. Convert HEIC
  photos to JPG before uploading (iPhone: Settings → Camera → Formats → "Most
  Compatible" before taking new photos, or use any online HEIC→JPG converter
  for existing ones).

Current files:
```
hibernation-tunnelv-1(Version 3).jpg
hibernation-tunnelv-2(Version 2).jpg
hibernation-tunnelv-3(Version 1).jpg
hibernation-tunnelv-4(Version 1).jpg   ⚠ currently an empty/corrupted file — re-upload
hibernation-tunnelv-5(Version 3).jpg   ⚠ currently an empty/corrupted file — re-upload
hibernation-tunnelv-6(Version 1).HEIC  ⚠ HEIC — won't display, convert to .jpg
```

**How this works technically:** the page fetches the live file listing from
GitHub's API and reads it directly, so any rename takes effect the moment you
save it on GitHub — no code change, ever. The one caveat: GitHub's public API
allows 60 such requests per hour per visitor IP address; for normal portfolio
traffic this is a non-issue, but if it's ever exceeded, this project's photos
temporarily show "Photos coming soon" until the hour resets, rather than an
error. Every other project is unaffected since they don't use this lookup.

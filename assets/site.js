// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Contact form: submit via fetch so visitors stay on the page ----
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const statusEl = contactForm.querySelector('.form-status');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    statusEl.textContent = 'Sending…';
    statusEl.className = 'form-status';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        statusEl.textContent = 'Message sent. I will get back to you soon.';
        statusEl.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please email me directly instead.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ---------------------------------------------------------------------
// Dynamic image loading: the images/ folder listing is read live from
// GitHub once per page load, and every project's photos are matched out
// of it by filename pattern "<slug><sep><n>(.<sub>)?(<label>)?.<ext>" —
// <n> clubs same-numbered files into one thumbnail stack, an optional
// "(...)" suffix becomes that stack's caption. Renaming a file (or its
// bracketed text) on GitHub takes effect immediately, no code change.
// If the live listing can't be fetched (e.g. GitHub API rate limit), each
// project falls back to guessing plain "<slug>-<n>" filenames directly —
// no captions in that fallback, but photos still show.
// ---------------------------------------------------------------------

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_NUMBERED_SLOTS = 15;
const MAX_SUB_SLOTS = 6;
const GITHUB_REPO = 'neogokul/Portfolio';

// Most projects separate the slug from the stack number with a plain
// hyphen ("sorting-system-1.5(...)"); hibernation-tunnel historically
// uses "v-" ("hibernation-tunnelv-1.5(...)").
const SLUG_SEPARATORS = { 'hibernation-tunnel': 'v-' };

let directoryListingPromise = null;
function fetchImagesDirectoryListing() {
  if (!directoryListingPromise) {
    directoryListingPromise = fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/images`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  }
  return directoryListingPromise;
}

// Groups images whose filenames share the same whole-number "stack" —
// "<slug>-3.1(...)", "<slug>-3.2(...)" etc all belong to stack 3, shown
// as one clustered set of thumbnails. A file with no decimal
// ("<slug>-1(...)") is its own one-image stack. The bracketed "(...)"
// suffix is optional; when present it becomes that photo's caption.
async function listingGroups(slug, prefix) {
  const files = await fetchImagesDirectoryListing();
  const sep = SLUG_SEPARATORS[slug] || '-';
  const pattern = new RegExp(`^${slug}${sep}(\\d+)(?:\\.(\\d+))?(?:\\((.+)\\))?\\.(png|jpe?g|webp|heic)$`, 'i');
  const items = [];
  files.forEach((f) => {
    const m = f.name && f.name.match(pattern);
    if (m) {
      items.push({
        stack: parseInt(m[1], 10),
        sub: m[2] ? parseInt(m[2], 10) : 0,
        label: m[3] ? m[3].trim() : null,
        url: `${prefix}${encodeURIComponent(f.name)}`,
      });
    }
  });
  items.sort((a, b) => (a.stack - b.stack) || (a.sub - b.sub));

  const groups = [];
  const byStack = new Map();
  items.forEach((item) => {
    if (!byStack.has(item.stack)) {
      const group = { label: item.label, items: [] };
      byStack.set(item.stack, group);
      groups.push(group);
    }
    const group = byStack.get(item.stack);
    group.items.push(item);
    // Surface any labelled photo's text even if an earlier, unlabelled
    // photo in the same stack was added first.
    if (!group.label && item.label) group.label = item.label;
  });
  return groups;
}

// Tries each extension for one base filename; resolves the working URL
// or null if none of them load.
function probeImage(base) {
  return new Promise((resolve) => {
    let i = 0;
    const tryNext = () => {
      if (i >= IMAGE_EXTENSIONS.length) {
        resolve(null);
        return;
      }
      const url = `${base}.${IMAGE_EXTENSIONS[i]}`;
      i += 1;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  });
}

// Numbered projects support the same "<slug>-<n>" or clubbed
// "<slug>-<n>.<sub>" naming as the bracket-label projects, just without a
// caption. Every <n>.<sub> file sharing the same whole number <n> is
// grouped into one thumbnail stack; a plain "<slug>-<n>" file is its own
// one-image stack.
async function numberedGroups(slug, prefix) {
  const majors = Array.from({ length: MAX_NUMBERED_SLOTS }, (_, i) => i + 1);
  const groups = await Promise.all(
    majors.map(async (n) => {
      const bases = [`${prefix}${slug}-${n}`];
      for (let s = 1; s <= MAX_SUB_SLOTS; s += 1) bases.push(`${prefix}${slug}-${n}.${s}`);
      const urls = await Promise.all(bases.map((b) => probeImage(b)));
      const items = urls.filter(Boolean).map((url) => ({ url }));
      return items.length ? { label: null, items } : null;
    })
  );
  return groups.filter(Boolean);
}

// Always resolves to the same shape: an array of groups, each
// { label, items: [{url}, ...] }. Tries the live GitHub listing first
// (this is what supports bracketed captions); if that comes back empty —
// no matching files, or the listing fetch itself failed — falls back to
// guessing plain "<slug>-<n>" filenames directly.
async function findImageGroups(slug, prefix) {
  const fromListing = await listingGroups(slug, prefix);
  if (fromListing.length) return fromListing;
  return numberedGroups(slug, prefix);
}

// ---- Homepage work-card thumbnails ----
document.querySelectorAll('.thumb[data-slug]').forEach(async (thumb) => {
  const slug = thumb.dataset.slug;
  const prefix = thumb.dataset.prefix || 'images/';
  const groups = await findImageGroups(slug, prefix);
  const firstUrl = groups[0]?.items[0]?.url;
  if (!firstUrl) {
    const empty = document.createElement('div');
    empty.className = 'thumb-empty';
    empty.innerHTML = 'Currently Under R&amp;D<br>No Photos Available';
    thumb.prepend(empty);
    return;
  }
  const img = document.createElement('img');
  img.src = firstUrl;
  img.alt = thumb.dataset.alt || '';
  img.loading = 'lazy';
  thumb.prepend(img);
});

// ---- Project detail page: sticky split-viewer ----
document.querySelectorAll('.viewer[data-slug]').forEach(async (viewer) => {
  const slug = viewer.dataset.slug;
  const prefix = viewer.dataset.prefix || '../images/';
  const groups = await findImageGroups(slug, prefix);

  const frame = viewer.querySelector('.viewer-frame');
  const cap = viewer.querySelector('.viewer-cap');
  const capVersion = viewer.querySelector('.viewer-cap .version');
  const thumbsWrap = viewer.querySelector('.viewer-thumbs');

  const totalImages = groups.reduce((n, g) => n + g.items.length, 0);
  if (totalImages === 0) {
    frame.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'viewer-empty';
    empty.innerHTML = 'Currently Under R&amp;D<br>No Photos Available';
    frame.appendChild(empty);
    if (cap) cap.remove();
    if (thumbsWrap) thumbsWrap.remove();
    return;
  }

  // The viewer frame's height is capped at the fixed stage height; its
  // width can use the full column width. Whichever limit a given photo
  // hits first governs the scale, so nothing is ever cropped or padded
  // with empty space, and wide photos aren't needlessly shrunk just
  // because they're not tall.
  const stage = frame.parentElement;
  function frameCaps() {
    const heightCap = window.innerWidth <= 600 ? 300 : 440;
    const widthCap = stage.clientWidth || heightCap;
    return { heightCap, widthCap };
  }

  function sizeFrameToImage(imgEl) {
    const { heightCap, widthCap } = frameCaps();
    const w = imgEl.naturalWidth || widthCap;
    const h = imgEl.naturalHeight || heightCap;
    const scale = Math.min(1, widthCap / w, heightCap / h);
    frame.style.width = `${Math.round(w * scale)}px`;
    frame.style.height = `${Math.round(h * scale)}px`;
  }

  const mainImg = document.createElement('img');
  mainImg.className = 'viewer-main is-loaded';
  mainImg.alt = viewer.dataset.alt || '';
  mainImg.onload = () => sizeFrameToImage(mainImg);

  frame.innerHTML = '';
  frame.appendChild(mainImg);

  mainImg.src = groups[0].items[0].url;
  if (capVersion) capVersion.textContent = groups[0].items[0].label || '';

  window.addEventListener('resize', () => sizeFrameToImage(mainImg));

  function selectThumb(btn, url, label) {
    mainImg.src = url;
    thumbsWrap.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    if (capVersion) capVersion.textContent = label || '';
  }

  if (totalImages > 1 && thumbsWrap) {
    let photoNum = 0;
    groups.forEach((group) => {
      const stack = document.createElement('div');
      stack.className = 'viewer-stack';

      const row = document.createElement('div');
      row.className = 'viewer-stack-row';
      stack.appendChild(row);

      group.items.forEach((item) => {
        photoNum += 1;
        const btn = document.createElement('button');
        btn.type = 'button';
        if (photoNum === 1) btn.classList.add('active');

        const thumbImg = document.createElement('img');
        thumbImg.src = item.url;
        thumbImg.alt = `${viewer.dataset.alt || ''} — photo ${photoNum}`;
        btn.appendChild(thumbImg);
        row.appendChild(btn);

        btn.addEventListener('click', () => selectThumb(btn, item.url, item.label));
      });

      thumbsWrap.appendChild(stack);
    });
  } else if (thumbsWrap) {
    thumbsWrap.remove();
  }
});

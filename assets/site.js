// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------
// Dynamic image loading: for most projects, probes images/ for whatever
// <slug>-<n> files actually exist. A few projects instead read the
// images/ folder directly from GitHub and pull their display label out
// of a "(...)" suffix in the filename, so renaming a file's bracketed
// text on GitHub is all that's needed to change its caption — no code
// change required.
// ---------------------------------------------------------------------

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_NUMBERED_SLOTS = 15;
const GITHUB_REPO = 'neogokul/Portfolio';

// Projects whose files are named "<slug>v-<order>(<label>).<ext>" — order
// controls display position, whatever is inside the parentheses is shown
// as the caption/thumbnail label, read live from GitHub on each page load.
const BRACKET_LABEL_SLUGS = new Set(['hibernation-tunnel']);

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
// "<slug>v-3.1(...)", "<slug>v-3.2(...)" etc all belong to stack 3, shown
// as one clustered set of thumbnails with a single shared label. A file
// with no decimal ("<slug>v-1(...)") is its own one-image stack.
async function bracketLabelGroups(slug, prefix) {
  const files = await fetchImagesDirectoryListing();
  const pattern = new RegExp(`^${slug}v-(\\d+)(?:\\.(\\d+))?\\((.+)\\)\\.(png|jpe?g|webp)$`, 'i');
  const items = [];
  files.forEach((f) => {
    const m = f.name && f.name.match(pattern);
    if (m) {
      items.push({
        stack: parseInt(m[1], 10),
        sub: m[2] ? parseInt(m[2], 10) : 0,
        label: m[3].trim(),
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
    byStack.get(item.stack).items.push(item);
  });
  return groups;
}

function candidatesForSlug(slug, prefix) {
  const list = [];
  for (let i = 1; i <= MAX_NUMBERED_SLOTS; i += 1) {
    list.push({ base: `${prefix}${slug}-${i}`, label: null });
  }
  return list;
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

// Probes every candidate in parallel and returns only the ones that
// exist, in their original order.
async function resolveAll(candidates) {
  const results = await Promise.all(
    candidates.map(async (c) => {
      const url = await probeImage(c.base);
      return url ? { ...c, url } : null;
    })
  );
  return results.filter(Boolean);
}

// Probes candidates one at a time (lowest index first) and stops at the
// first one found — cheaper than resolveAll when only one image is needed.
async function resolveFirst(candidates) {
  for (const c of candidates) {
    const url = await probeImage(c.base); // eslint-disable-line no-await-in-loop
    if (url) return { ...c, url };
  }
  return null;
}

// Always resolves to the same shape: an array of groups, each
// { label, items: [{url}, ...] }. A plain numbered project's images
// each become their own one-item group (label: null).
async function findImageGroups(slug, prefix) {
  if (BRACKET_LABEL_SLUGS.has(slug)) {
    return bracketLabelGroups(slug, prefix);
  }
  const candidates = candidatesForSlug(slug, prefix);
  const found = await resolveAll(candidates);
  return found.map((item) => ({ label: null, items: [{ url: item.url }] }));
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
    empty.textContent = 'Photos coming soon';
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
    empty.textContent = 'Photos coming soon for this project.';
    frame.appendChild(empty);
    if (cap) cap.remove();
    if (thumbsWrap) thumbsWrap.remove();
    return;
  }

  const mainImg = document.createElement('img');
  mainImg.src = groups[0].items[0].url;
  mainImg.alt = viewer.dataset.alt || '';
  mainImg.className = 'is-loaded';
  frame.innerHTML = '';
  frame.appendChild(mainImg);
  if (capVersion) capVersion.textContent = groups[0].label;

  function selectThumb(btn, url, label) {
    mainImg.src = url;
    thumbsWrap.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    if (capVersion && label) capVersion.textContent = label;
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

        btn.addEventListener('click', () => selectThumb(btn, item.url, group.label));
      });

      if (group.label) {
        const label = document.createElement('span');
        label.className = 'viewer-thumb-label';
        label.textContent = group.label;
        stack.appendChild(label);
      }

      thumbsWrap.appendChild(stack);
    });
  } else if (thumbsWrap) {
    thumbsWrap.remove();
  }
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------
// Dynamic image loading: probes the images/ folder for whatever files
// actually exist (in any of a few formats) instead of assuming a fixed
// number of slots per project. A project can have 0, 1, or many photos
// and the page adapts — no empty placeholder boxes for missing slots.
// ---------------------------------------------------------------------

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_NUMBERED_SLOTS = 15;

// Projects whose image files don't follow the plain <slug>-<n> numbering
// get an explicit candidate list here, in display order.
const CUSTOM_CANDIDATES = {
  'hibernation-tunnel': [
    { base: 'hibernation-tunnelv3-1', label: 'Version 3' },
    { base: 'hibernation-tunnelv2-2', label: 'Version 2' },
    { base: 'hibernation-tunnelv1-3', label: 'Version 1' },
    { base: 'hibernation-tunnelv1-4', label: 'Version 1' },
    { base: 'hibernation-tunnelv3-5', label: 'Version 3' },
  ],
};

function candidatesForSlug(slug, prefix) {
  const custom = CUSTOM_CANDIDATES[slug];
  if (custom) {
    return custom.map((c) => ({ base: `${prefix}${c.base}`, label: c.label }));
  }
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

// ---- Homepage work-card thumbnails ----
document.querySelectorAll('.thumb[data-slug]').forEach(async (thumb) => {
  const slug = thumb.dataset.slug;
  const prefix = thumb.dataset.prefix || 'images/';
  const candidates = candidatesForSlug(slug, prefix);
  const found = await resolveFirst(candidates);
  if (!found) {
    const empty = document.createElement('div');
    empty.className = 'thumb-empty';
    empty.textContent = 'Photos coming soon';
    thumb.prepend(empty);
    return;
  }
  const img = document.createElement('img');
  img.src = found.url;
  img.alt = thumb.dataset.alt || '';
  img.loading = 'lazy';
  thumb.prepend(img);
});

// ---- Project detail page: sticky split-viewer ----
document.querySelectorAll('.viewer[data-slug]').forEach(async (viewer) => {
  const slug = viewer.dataset.slug;
  const prefix = viewer.dataset.prefix || '../images/';
  const candidates = candidatesForSlug(slug, prefix);
  const found = await resolveAll(candidates);

  const frame = viewer.querySelector('.viewer-frame');
  const cap = viewer.querySelector('.viewer-cap');
  const capVersion = viewer.querySelector('.viewer-cap .version');
  const thumbsWrap = viewer.querySelector('.viewer-thumbs');

  if (found.length === 0) {
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
  mainImg.src = found[0].url;
  mainImg.alt = viewer.dataset.alt || '';
  mainImg.className = 'is-loaded';
  frame.innerHTML = '';
  frame.appendChild(mainImg);
  if (capVersion) capVersion.textContent = found[0].label;

  if (found.length > 1 && thumbsWrap) {
    found.forEach((item, idx) => {
      const wrap = document.createElement('div');
      wrap.className = idx === 0 ? 'viewer-thumb active' : 'viewer-thumb';

      const btn = document.createElement('button');
      btn.type = 'button';
      if (idx === 0) btn.classList.add('active');

      const thumbImg = document.createElement('img');
      thumbImg.src = item.url;
      thumbImg.alt = `${viewer.dataset.alt || ''} — photo ${idx + 1}`;
      btn.appendChild(thumbImg);
      wrap.appendChild(btn);

      if (item.label) {
        const label = document.createElement('span');
        label.className = 'viewer-thumb-label';
        label.textContent = item.label;
        wrap.appendChild(label);
      }

      thumbsWrap.appendChild(wrap);

      btn.addEventListener('click', () => {
        mainImg.src = item.url;
        thumbsWrap.querySelectorAll('.viewer-thumb').forEach((w) => w.classList.remove('active'));
        wrap.classList.add('active');
        if (capVersion && item.label) capVersion.textContent = item.label;
      });
    });
  } else if (thumbsWrap) {
    thumbsWrap.remove();
  }
});

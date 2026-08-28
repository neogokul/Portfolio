// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Try each image slot against several extensions, so any format
// (png, jpg, jpeg, webp) works without renaming the source file.
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'JPG', 'JPEG', 'PNG'];

function loadAutoImage(img, onLoad) {
  const base = img.dataset.base;
  let i = 0;
  const tryNext = () => {
    if (i >= IMAGE_EXTENSIONS.length) {
      img.classList.add('broken');
      img.classList.remove('is-loaded');
      return;
    }
    img.src = `${base}.${IMAGE_EXTENSIONS[i]}`;
    i += 1;
  };
  img.addEventListener('error', tryNext);
  img.addEventListener('load', () => {
    img.classList.remove('broken');
    img.classList.add('is-loaded');
    if (onLoad) onLoad();
  });
  tryNext();
}

document.querySelectorAll('img.auto-img').forEach((img) => loadAutoImage(img));

// Sticky split-viewer: clicking a thumbnail swaps the main viewer image.
document.querySelectorAll('.viewer').forEach((viewer) => {
  const mainImg = viewer.querySelector('.viewer-frame img.auto-img');
  const thumbButtons = viewer.querySelectorAll('.viewer-thumbs button');
  thumbButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const base = btn.dataset.base;
      if (!mainImg || mainImg.dataset.base === base) return;
      mainImg.dataset.base = base;
      mainImg.classList.remove('is-loaded');
      loadAutoImage(mainImg);
      thumbButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

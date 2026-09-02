// Small decorative 3D preview for the Arqdyne Companion hobby card: loads
// the same head.glb used by the live app and plays a gentle idle loop
// (periodic blink + a slow "happy" smile breathe) so visitors get a sense
// of what the project is without leaving the portfolio. Three.js/GLTFLoader
// and the model itself are only fetched once the card actually scrolls
// into view, and rendering pauses again when it scrolls back out.

const THREE_JS_SRC = 'assets/vendor/three.min.js';
const GLTF_LOADER_SRC = 'assets/vendor/GLTFLoader.js';

let threeLoadPromise = null;
function ensureThree() {
  if (window.THREE && window.THREE.GLTFLoader) return Promise.resolve();
  if (!threeLoadPromise) {
    threeLoadPromise = new Promise((resolve, reject) => {
      const s1 = document.createElement('script');
      s1.src = THREE_JS_SRC;
      s1.onload = () => {
        const s2 = document.createElement('script');
        s2.src = GLTF_LOADER_SRC;
        s2.onload = resolve;
        s2.onerror = reject;
        document.head.appendChild(s2);
      };
      s1.onerror = reject;
      document.head.appendChild(s1);
    });
  }
  return threeLoadPromise;
}

const BLINK_MORPHS = ['eyeBlinkLeft', 'eyeBlinkRight'];
const HAPPY_MORPHS = ['mouthSmileLeft', 'mouthSmileRight'];
const HAPPY_EYE_MORPHS = ['eyeSquintLeft', 'eyeSquintRight'];
const HAPPY_CHEEK_MORPHS = ['cheekSquintLeft', 'cheekSquintRight'];
const HAPPY_BROW_MORPHS = ['browOuterUpLeft', 'browOuterUpRight'];

function initHobbyModel(container) {
  const modelUrl = container.dataset.model;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);

  // The source model ships with no skin texture at all (flat 50% grey PBR
  // material) — rather than a texture we don't have, a warm key light +
  // cool fill + soft rim gives the untextured clay a believable skin-like
  // read, and a subtle subsurface-ish tint is applied to the material itself.
  scene.add(new THREE.HemisphereLight(0xfff1e0, 0x1c130d, 0.35));
  const key = new THREE.DirectionalLight(0xfff2d9, 0.95);
  key.position.set(0.55, 0.85, 1.3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd8ff, 0.28);
  fill.position.set(-1, 0.2, 0.6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff6b1a, 0.5);
  rim.position.set(-0.8, 0.5, -1);
  scene.add(rim);

  const meshes = [];
  let root = null;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frameCamera() {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const fovRad = (camera.fov * Math.PI) / 180;
    const distance = (size.y / 2 / Math.tan(fovRad / 2)) * 1.55;
    camera.position.set(center.x, center.y + size.y * 0.08, center.z + distance);
    camera.lookAt(center.x, center.y + size.y * 0.05, center.z);
  }

  function setMorph(name, value) {
    meshes.forEach(({ mesh, dict }) => {
      const idx = dict[name];
      if (idx !== undefined) mesh.morphTargetInfluences[idx] = value;
    });
  }


  new THREE.GLTFLoader().load(
    modelUrl,
    (gltf) => {
      root = gltf.scene;
      root.traverse((n) => {
        if (n.isMesh && n.morphTargetInfluences && n.morphTargetDictionary) {
          meshes.push({ mesh: n, dict: n.morphTargetDictionary });
        }
        if (n.isMesh && n.material) {
          const mats = Array.isArray(n.material) ? n.material : [n.material];
          mats.forEach((mat) => {
            if (mat.color) mat.color.set(0xd9a892);
            if ('roughness' in mat) mat.roughness = 0.55;
            if ('metalness' in mat) mat.metalness = 0;
          });
        }
      });
      scene.add(root);
      resize();
      frameCamera();
      container.classList.add('is-loaded');
      startLoop();
    },
    undefined,
    () => {
      const hint = container.querySelector('.hobby-model-hint');
      if (hint) hint.textContent = 'Preview unavailable';
    }
  );

  let rafId = null;
  let nextBlinkAt = performance.now() + 1200 + Math.random() * 1500;
  let blinkStart = null;
  const BLINK_DURATION = 220;

  function tick(now) {
    rafId = requestAnimationFrame(tick);

    // Slow "happy" breathing smile — never fully neutral, gently pulses.
    const t = now / 1500;
    const smile = 0.32 + 0.22 * Math.sin(t);
    HAPPY_MORPHS.forEach((m) => setMorph(m, smile));
    HAPPY_EYE_MORPHS.forEach((m) => setMorph(m, smile * 0.35));
    HAPPY_CHEEK_MORPHS.forEach((m) => setMorph(m, smile * 0.5));
    HAPPY_BROW_MORPHS.forEach((m) => setMorph(m, smile * 0.12));

    // Periodic blink, independent timer with slight randomness.
    if (blinkStart === null && now >= nextBlinkAt) {
      blinkStart = now;
    }
    if (blinkStart !== null) {
      const elapsed = now - blinkStart;
      const phase = elapsed / BLINK_DURATION;
      const blinkVal = phase < 1 ? Math.sin(Math.min(phase, 1) * Math.PI) : 0;
      BLINK_MORPHS.forEach((m) => setMorph(m, blinkVal));
      if (phase >= 1) {
        blinkStart = null;
        nextBlinkAt = now + 2600 + Math.random() * 2200;
      }
    }

    // Subtle idle head sway for a touch of life.
    if (root) root.rotation.y = Math.sin(now / 3200) * 0.05;

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }
  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('resize', resize);
  container.__hobbyModel = { startLoop, stopLoop };
}

document.querySelectorAll('.hobby-model[data-model]').forEach((container) => {
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!started) {
          started = true;
          ensureThree().then(() => initHobbyModel(container));
        } else if (container.__hobbyModel) {
          container.__hobbyModel.startLoop();
        }
      } else if (container.__hobbyModel) {
        container.__hobbyModel.stopLoop();
      }
    });
  }, { threshold: 0.15 });
  observer.observe(container);
});

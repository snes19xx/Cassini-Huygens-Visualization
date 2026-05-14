import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";

const container = document.getElementById("canvas-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
camera.position.set(0, 0, 26);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

function onResize() {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", onResize);
onResize();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 12;
controls.maxDistance = 80;

(function buildStars() {
  const count = 5000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 600 + Math.random() * 400;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      }),
    ),
  );
})();

const sphereGroup = new THREE.Group();
scene.add(sphereGroup);

const geometry = new THREE.SphereGeometry(10, 128, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x9aa0a8,
  roughness: 0.8,
  metalness: 0.0,
});
const sphere = new THREE.Mesh(geometry, material);
sphereGroup.add(sphere);

const atmosMat = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal  = normalize(normalMatrix * normal);
      vec4 mvp = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvp.xyz);
      gl_Position = projectionMatrix * mvp;
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    uniform vec3  glowColor;
    uniform float intensity;
    void main() {
      float rim = 1.0 - max(dot(vViewDir, vNormal), 0.0);
      rim = pow(rim, 3.2);
      gl_FragColor = vec4(glowColor, rim * intensity);
    }
  `,
  uniforms: {
    glowColor: { value: new THREE.Color(0x4488ff) },
    intensity: { value: 0.9 },
  },
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.FrontSide,
});

const atmosSphere = new THREE.Mesh(
  new THREE.SphereGeometry(10.85, 64, 32),
  atmosMat,
);
atmosSphere.visible = false;
sphereGroup.add(atmosSphere);

function buildGraticule(R = 10.06) {
  const SEG = 128;
  const pts = [];

  const addArc = (points) => {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i],
        b = points[i + 1];
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  };

  for (let lat = -75; lat <= 75; lat += 15) {
    const phi = (90 - lat) * (Math.PI / 180);
    const row = [];
    for (let i = 0; i <= SEG; i++) {
      const th = (i / SEG) * Math.PI * 2;
      row.push(
        new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(th),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(th),
        ),
      );
    }
    addArc(row);
  }

  for (let lon = 0; lon < 360; lon += 15) {
    const th = lon * (Math.PI / 180);
    const col = [];
    for (let i = 0; i <= SEG; i++) {
      const phi = (i / SEG) * Math.PI;
      col.push(
        new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(th),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(th),
        ),
      );
    }
    addArc(col);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const lines = new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
    }),
  );
  lines.visible = false;
  return lines;
}

const graticule = buildGraticule();
sphereGroup.add(graticule);

function buildPoleMarker(isNorth) {
  const group = new THREE.Group();
  const R = 10.1;
  const y = isNorth ? R : -R;
  const dir = isNorth ? 1 : -1;

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xc8a664 }),
  );
  dot.position.set(0, y, 0);
  group.add(dot);

  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, y, 0),
    new THREE.Vector3(0, y + dir * 1.6, 0),
  ]);
  group.add(
    new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0xc8a664,
        transparent: true,
        opacity: 0.55,
      }),
    ),
  );

  group.visible = false;
  return group;
}

const northPole = buildPoleMarker(true);
const southPole = buildPoleMarker(false);
sphereGroup.add(northPole);
sphereGroup.add(southPole);

// LIGHTING

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

//

const texLoader = new THREE.TextureLoader();
const ktx2Loader = new KTX2Loader()
  .setTranscoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/")
  .detectSupport(renderer);

let currentTex = null;
let currentNorm = null;

const loadingOverlay = document.getElementById("loading-overlay");
const fileStats = document.getElementById("fileStats");
const textureName = document.getElementById("texture-name");

function showLoading(on) {
  loadingOverlay.classList.toggle("visible", on);
}

function loadTexture(file, isNormal = false) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const ext = file.name.split(".").pop().toLowerCase();
  const mb = (file.size / (1024 * 1024)).toFixed(2);

  const zoneId = isNormal ? "normalZone" : "albedoZone";
  const zone = document.getElementById(zoneId);

  if (!isNormal) {
    showLoading(true);
    textureName.textContent = file.name;
    fileStats.textContent = "Loading…";
  }

  const onLoaded = (tex) => {
    if (isNormal) {
      if (currentNorm) currentNorm.dispose();
      material.normalMap = tex;
      material.normalScale = new THREE.Vector2(
        parseFloat(document.getElementById("normalScale").value),
        parseFloat(document.getElementById("normalScale").value),
      );
      currentNorm = tex;
    } else {
      if (currentTex) currentTex.dispose();
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      if (ext !== "ktx2") {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
      }
      material.map = tex;
      material.color.setHex(0xffffff);
      currentTex = tex;

      fileStats.innerHTML =
        `<span class="stat-val">${file.name}</span><br>` +
        `<span class="stat-key">size &nbsp;</span><span class="stat-val">${mb} MB</span>` +
        `&ensp;<span class="stat-key">fmt &nbsp;</span><span class="stat-val">${ext.toUpperCase()}</span>`;

      showLoading(false);
    }
    material.needsUpdate = true;

    zone.classList.add("loaded");
    zone.querySelector(".drop-text").innerHTML =
      `<span class="loaded-name">${file.name}</span>` +
      `<span class="loaded-meta">${mb} MB</span>`;
  };

  if (ext === "ktx2" && !isNormal) {
    ktx2Loader.load(url, onLoaded, undefined, (err) => {
      console.error("KTX2 error:", err);
      fileStats.textContent = "Failed to load KTX2 — see console.";
      showLoading(false);
    });
  } else {
    texLoader.load(url, onLoaded, undefined, (err) => {
      console.error("Texture error:", err);
      if (!isNormal) {
        fileStats.textContent = "Error loading file.";
        showLoading(false);
      }
    });
  }
}

document.getElementById("fileInput").addEventListener("change", (e) => {
  if (e.target.files[0]) loadTexture(e.target.files[0], false);
});
document.getElementById("normalInput").addEventListener("change", (e) => {
  if (e.target.files[0]) loadTexture(e.target.files[0], true);
});

let autoRotate = false;
let rotSpeed = 1.0;
let lightMode = "direct"; // "direct" | "ambient" | "custom"

document.getElementById("btnAutoRotate").addEventListener("click", () => {
  autoRotate = !autoRotate;
  document
    .getElementById("btnAutoRotate")
    .classList.toggle("active", autoRotate);
});

document.getElementById("rotSpeed").addEventListener("input", (e) => {
  rotSpeed = parseFloat(e.target.value);
  document.getElementById("valRotSpeed").textContent =
    rotSpeed.toFixed(1) + "×";
});

document.getElementById("axialTilt").addEventListener("input", (e) => {
  const deg = parseFloat(e.target.value);
  sphereGroup.rotation.z = deg * (Math.PI / 180);
  document.getElementById("valAxialTilt").textContent = deg + "°";
});

document.getElementById("roughness").addEventListener("input", (e) => {
  material.roughness = parseFloat(e.target.value);
  document.getElementById("valRoughness").textContent = parseFloat(
    e.target.value,
  ).toFixed(2);
});

document.getElementById("metalness").addEventListener("input", (e) => {
  material.metalness = parseFloat(e.target.value);
  document.getElementById("valMetalness").textContent = parseFloat(
    e.target.value,
  ).toFixed(2);
});

document.getElementById("normalScale").addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  document.getElementById("valNormalScale").textContent = v.toFixed(2);
  if (material.normalMap) {
    material.normalScale.set(v, v);
    material.needsUpdate = true;
  }
});

document.getElementById("btnWireframe").addEventListener("click", () => {
  material.wireframe = !material.wireframe;
  document
    .getElementById("btnWireframe")
    .classList.toggle("active", material.wireframe);
});

function applyLightMode(mode) {
  lightMode = mode;
  ["lightDirect", "lightAmbient", "lightCustom"].forEach((id) =>
    document.getElementById(id).classList.remove("active"),
  );
  if (mode === "direct") {
    document.getElementById("lightDirect").classList.add("active");
    ambientLight.intensity = 0.2;
    dirLight.intensity = 2.5;
    dirLight.position.set(10, 10, 10);
  } else if (mode === "ambient") {
    document.getElementById("lightAmbient").classList.add("active");
    ambientLight.intensity = 2.5;
    dirLight.intensity = 0;
  } else {
    document.getElementById("lightCustom").classList.add("active");
    applyCustomLight();
  }
}

function applyCustomLight() {
  const az =
    parseFloat(document.getElementById("lightAzimuth").value) * (Math.PI / 180);
  const el =
    parseFloat(document.getElementById("lightElevation").value) *
    (Math.PI / 180);
  const int = parseFloat(document.getElementById("lightIntensity").value);
  dirLight.position.set(
    20 * Math.cos(el) * Math.sin(az),
    20 * Math.sin(el),
    20 * Math.cos(el) * Math.cos(az),
  );
  ambientLight.intensity = 0.15;
  dirLight.intensity = int;
}

document
  .getElementById("lightDirect")
  .addEventListener("click", () => applyLightMode("direct"));
document
  .getElementById("lightAmbient")
  .addEventListener("click", () => applyLightMode("ambient"));
document
  .getElementById("lightCustom")
  .addEventListener("click", () => applyLightMode("custom"));

[
  ["lightAzimuth", "valLightAzimuth", (v) => v + "°"],
  ["lightElevation", "valLightElevation", (v) => v + "°"],
  ["lightIntensity", "valLightIntensity", (v) => parseFloat(v).toFixed(1)],
].forEach(([id, valId, fmt]) => {
  document.getElementById(id).addEventListener("input", (e) => {
    document.getElementById(valId).textContent = fmt(e.target.value);
    // Any slider drag auto-activates custom mode
    applyLightMode("custom");
  });
});

document.getElementById("btnAtmosphere").addEventListener("click", () => {
  atmosSphere.visible = !atmosSphere.visible;
  document
    .getElementById("btnAtmosphere")
    .classList.toggle("active", atmosSphere.visible);
});

document.getElementById("atmosphereColor").addEventListener("input", (e) => {
  atmosMat.uniforms.glowColor.value.setStyle(e.target.value);
  e.target.nextElementSibling.textContent = e.target.value;
});

document
  .getElementById("atmosphereIntensity")
  .addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    atmosMat.uniforms.intensity.value = v;
    document.getElementById("valAtmosIntensity").textContent = v.toFixed(2);
  });

document.getElementById("btnGraticule").addEventListener("click", () => {
  graticule.visible = !graticule.visible;
  document
    .getElementById("btnGraticule")
    .classList.toggle("active", graticule.visible);
});

document.getElementById("btnPoles").addEventListener("click", () => {
  const v = !northPole.visible;
  northPole.visible = v;
  southPole.visible = v;
  document.getElementById("btnPoles").classList.toggle("active", v);
});

// SCREENSHOT

document.getElementById("btnScreenshot").addEventListener("click", () => {
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.download = "surface-lab.png";
  a.href = url;
  a.click();
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const coordEl = document.getElementById("cursor-coords");

renderer.domElement.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(sphere);

  if (hits.length > 0) {
    const worldPt = hits[0].point.clone();
    const local = sphere.worldToLocal(worldPt).normalize();

    const lat = Math.asin(Math.max(-1, Math.min(1, local.y))) * (180 / Math.PI);
    const lon = Math.atan2(local.z, local.x) * (180 / Math.PI);

    const latStr =
      Math.abs(lat).toFixed(1) + "°\u00a0" + (lat >= 0 ? "N" : "S");
    const lonStr =
      Math.abs(lon).toFixed(1) + "°\u00a0" + (lon >= 0 ? "E" : "W");
    coordEl.textContent = latStr + "\u2003" + lonStr;
    coordEl.classList.add("active");
  } else {
    coordEl.textContent = "— lat \u00a0 — lon";
    coordEl.classList.remove("active");
  }
});

renderer.domElement.addEventListener("mouseleave", () => {
  coordEl.textContent = "— lat \u00a0 — lon";
  coordEl.classList.remove("active");
});

document.querySelectorAll("details.ctrl-section").forEach((el) => {
  el.addEventListener("toggle", () => {
    const arrow = el.querySelector(".sec-arrow");
    if (arrow)
      arrow.style.transform = el.open ? "rotate(90deg)" : "rotate(0deg)";
  });

  const arrow = el.querySelector(".sec-arrow");
  if (arrow && el.open) arrow.style.transform = "rotate(90deg)";
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (autoRotate) {
    sphere.rotation.y += dt * rotSpeed * 0.18;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

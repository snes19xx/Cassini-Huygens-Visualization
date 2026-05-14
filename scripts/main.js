import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";

const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 25);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const geometry = new THREE.SphereGeometry(10, 128, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x9aa0a8,
  roughness: 0.8,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const textureLoader = new THREE.TextureLoader();

const ktx2Loader = new KTX2Loader()
  .setTranscoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/")
  .detectSupport(renderer);

let currentTexture = null;
const fileInput = document.getElementById("fileInput");
const fileStats = document.getElementById("fileStats");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const ext = file.name.split(".").pop().toLowerCase();
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  fileStats.innerHTML = `Loading...<br>File: ${file.name}<br>Size: ${sizeMB} MB`;

  const onTextureLoaded = (texture) => {
    if (currentTexture) currentTexture.dispose();

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    if (ext !== "ktx2") {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
    }

    material.map = texture;
    material.color.setHex(0xffffff);
    material.needsUpdate = true;
    currentTexture = texture;

    fileStats.innerHTML = `Loaded: ${file.name}<br>Size: ${sizeMB} MB<br>Format: ${ext.toUpperCase()}`;
  };

  if (ext === "ktx2") {
    ktx2Loader.load(url, onTextureLoaded, undefined, (err) => {
      console.error("KTX2 Load Error:", err);
      fileStats.innerHTML = `<span style="color:red">Failed to load KTX2. Check console.</span>`;
    });
  } else {
    textureLoader.load(url, onTextureLoaded);
  }
});

let isAllSidesLit = false;
let lightPosMultiplier = 1;

document.getElementById("btnToggleHemisphere").addEventListener("click", () => {
  lightPosMultiplier *= -1;
  directionalLight.position.set(
    10 * lightPosMultiplier,
    10 * lightPosMultiplier,
    10 * lightPosMultiplier,
  );

  if (isAllSidesLit) {
    ambientLight.intensity = 0.2;
    directionalLight.intensity = 2.5;
    isAllSidesLit = false;
  }
});

document.getElementById("btnLightAllSides").addEventListener("click", () => {
  isAllSidesLit = !isAllSidesLit;
  if (isAllSidesLit) {
    ambientLight.intensity = 2.5;
    directionalLight.intensity = 0;
  } else {
    ambientLight.intensity = 0.2;
    directionalLight.intensity = 2.5;
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

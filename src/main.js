import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world";
import { createUI } from "./ui";
import "./style.css";

//Stats
const stats = new Stats();
document.body.append(stats.dom);

// Renderer Setup
const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor("lightblue");

document.body.appendChild(renderer.domElement);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight
);

camera.position.set(-32, 16, -32);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Scene Setup
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

// Lights setup
function setupLights() {
    const sun = new THREE.DirectionalLight();

    sun.position.set(50, 50, 50);
    sun.castShadow = true;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 100;
    sun.shadow.bias = -0.0005;
    sun.shadow.mapSize = new THREE.Vector2(512, 512);
    scene.add(sun);

    const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);

    scene.add(shadowHelper);

    const ambient = new THREE.AmbientLight();

    ambient.intensity = 0.5;
    scene.add(ambient);
}

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUI(world);
animate();

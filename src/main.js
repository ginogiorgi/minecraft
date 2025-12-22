import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world";
import { createUI } from "./ui";
import "./style.css";
import { Player } from "./player";
import { Physics } from "./physics";

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
const orbitCamera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight
);

orbitCamera.position.set(-32, 16, -32);
orbitCamera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(orbitCamera, renderer.domElement);

// Scene Setup
const scene = new THREE.Scene();
const world = new World();

world.generate();
scene.add(world);

const player = new Player(scene);

const physics = new Physics(scene);

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
let previousTime = performance.now();

function animate() {
    let currentTime = performance.now();
    let dt = (currentTime - previousTime) / 1000;

    requestAnimationFrame(animate);
    player.applyInputs(dt);
    player.updateBoundsHelper();
    physics.update(dt, player, world);
    renderer.render(
        scene,
        player.controls.isLocked ? player.camera : orbitCamera
    );
    stats.update();
    previousTime = currentTime;
}

window.addEventListener("resize", () => {
    orbitCamera.aspect = window.innerWidth / window.innerHeight;
    orbitCamera.updateProjectionMatrix();
    player.camera.aspect = window.innerWidth / window.innerHeight;
    player.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUI(world, player);
animate();

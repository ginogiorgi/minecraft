# Minecraft Clone — Three.js

A Minecraft-inspired 3D voxel game built from scratch with Three.js.

🎮 **[Play it here →](https://ginogiorgi.github.io/minecraft/)**

## Features

- **Procedural terrain** — Simplex noise with configurable seed, scale, magnitude and offset
- **Block types** — Grass, dirt, stone, coal ore and iron ore with accurate textures
- **First-person controls** — Pointer Lock API for immersive gameplay
- **Physics & collision** — Custom broad-phase + narrow-phase collision detection
- **Shadow mapping** — PCFShadowMap for realistic lighting
- **Ore generation** — Configurable scarcity and scale per ore type
- **Debug UI** — Real-time parameter tweaking with lil-gui
- **Performance stats** — FPS counter overlay

## Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — Build tool
- Vanilla JavaScript (ES Modules)

## Run locally

```bash
npm install
npm run dev
```

## Controls

| Key | Action |
|---|---|
| Click | Lock pointer |
| W A S D | Move |
| R | Reset position |
| Esc | Unlock pointer |

import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
    const texture = textureLoader.load(path);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    return texture;
}

const textures = {
    dirt: loadTexture("textures/dirt.png"),
    grass_carried: loadTexture("textures/grass_carried.png"),
    grass_side_carried: loadTexture("textures/grass_side_carried.png"),
    stone: loadTexture("textures/stone.png"),
    coal_ore: loadTexture("textures/coal_ore.png"),
    iron_ore: loadTexture("textures/iron_ore.png"),
};

export const blocks = {
    empty: {
        id: 0,
        name: "empty",
    },
    grass: {
        id: 1,
        name: "grass",
        color: 0x559020,
        material: [
            new THREE.MeshLambertMaterial({ map: textures.grass_side_carried }), // right
            new THREE.MeshLambertMaterial({ map: textures.grass_side_carried }), // left
            new THREE.MeshLambertMaterial({ map: textures.grass_carried }), // top
            new THREE.MeshLambertMaterial({ map: textures.dirt }), // right
            new THREE.MeshLambertMaterial({ map: textures.grass_side_carried }), // front
            new THREE.MeshLambertMaterial({ map: textures.grass_side_carried }), // back
        ],
    },
    dirt: {
        id: 2,
        name: "dirt",
        color: 0x807020,
        material: new THREE.MeshLambertMaterial({ map: textures.dirt }),
    },
    stone: {
        id: 3,
        name: "Stone",
        color: 0x808080,
        scale: {
            x: 30,
            y: 30,
            z: 30,
        },
        scarcity: 0.5,
        material: new THREE.MeshLambertMaterial({ map: textures.stone }),
    },
    coalOre: {
        id: 4,
        name: "Coal Ore",
        color: 0x202020,
        scale: {
            x: 20,
            y: 20,
            z: 20,
        },
        scarcity: 0.8,
        material: new THREE.MeshLambertMaterial({ map: textures.coal_ore }),
    },
    ironOre: {
        id: 5,
        name: "Iron Ore",
        color: 0xffff00,
        scale: {
            x: 60,
            y: 60,
            z: 60,
        },
        scarcity: 0.9,
        material: new THREE.MeshLambertMaterial({ map: textures.iron_ore }),
    },
};

export const resourses = [blocks.stone, blocks.coalOre, blocks.ironOre];

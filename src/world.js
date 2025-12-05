import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import { RNG } from "./rng";
import { blocks } from "./blocks";

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial();

export class World extends THREE.Group {
    /**
     *
     * @type {{id: number, instanceId: number}[][][]}
     */
    data = [];
    params = {
        seed: 0,
        terrain: {
            scale: 30,
            magnitude: 0.5,
            offset: 0.2,
        },
    };
    constructor(size = { width: 64, height: 32 }) {
        super();
        this.size = size;
    }

    // Generates world data and meshes
    generate() {
        this.initializeTerrain();
        this.generateTerrain();
        this.generateMeshes();
    }

    // Initializing world terrain data
    initializeTerrain() {
        this.data = [];
        for (let x = 0; x < this.size.width; x++) {
            const slice = [];

            for (let y = 0; y < this.size.height; y++) {
                const row = [];

                for (let z = 0; z < this.size.width; z++) {
                    row.push({
                        id: blocks.empty.id,
                        instanceId: null,
                    });
                }
                slice.push(row);
            }
            this.data.push(slice);
        }
    }

    // Generates world terrain data
    generateTerrain() {
        const rng = new RNG(this.params.seed);
        const simplex = new SimplexNoise(rng);

        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                const value = simplex.noise(
                    x / this.params.terrain.scale,
                    z / this.params.terrain.scale
                );
                const scaledNoise =
                    this.params.terrain.offset +
                    this.params.terrain.magnitude * value;
                let height = Math.floor(this.size.height * scaledNoise);
                height = Math.max(0, Math.min(height, this.size.height - 1));
                for (let y = 0; y <= this.size.height; y++) {
                    if (y < height) {
                        this.setBlockId(x, y, z, blocks.dirt.id);
                    } else if (y === height) {
                        this.setBlockId(x, y, z, blocks.grass.id);
                    } else {
                        this.setBlockId(x, y, z, blocks.empty.id);
                    }
                }
            }
        }
    }

    // Generates 3d representation from world data
    generateMeshes() {
        this.clear();
        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
        const matrix = new THREE.Matrix4();

        mesh.count = 0;

        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blockId = this.getBlock(x, y, z).id;
                    const instanceId = mesh.count;
                    const blockType = Object.values(blocks).find(
                        (x) => x.id === blockId
                    );

                    if (blockId != 0) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
                        mesh.setMatrixAt(instanceId, matrix);
                        mesh.setColorAt(
                            instanceId,
                            new THREE.Color(blockType.color)
                        );
                        this.setBlockInstanceId(x, y, z, instanceId);
                        mesh.count++;
                    }
                }
            }
        }
        this.add(mesh);
    }

    /**
     * Gets the block data at (x, y, z)
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {{id: number, instanceId: number}}
     */
    getBlock(x, y, z) {
        if (this.inBounds(x, y, z)) {
            return this.data[x][y][z];
        } else {
            return null;
        }
    }

    /**
     * Set id for the block in (x, y, z)
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} id
     */
    setBlockId(x, y, z, id) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].id = id;
        }
    }
    /**
     * Set instance id for the block in (x, y, z)
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} instanceId
     */
    setBlockInstanceId(x, y, z, instanceId) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].instanceId = instanceId;
        }
    }

    /**
     * Checks if the (x, y, z) coordinates are in bounds
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {boolean}
     */
    inBounds(x, y, z) {
        if (
            x >= 0 &&
            x < this.size.width &&
            y >= 0 &&
            y < this.size.height &&
            z >= 0 &&
            z < this.size.width
        ) {
            return true;
        } else {
            return false;
        }
    }
}

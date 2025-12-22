import * as THREE from "three";
import { blocks } from "./blocks";

const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3,
});
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

export class Physics {
    constructor(scene) {
        this.helpers = new THREE.Group();
        scene.add(this.helpers);
    }
    /**
     * Moves the physics simulation foaward in thime by 'dt'
     * @param {number} dt
     * @param {Player} player
     * @param {World} world
     */
    update(dt, player, world) {
        this.detectCollisions(player, world);
    }
    /**
     * Main function for collision detection
     * @param {Player} player
     * @param {World} world
     */
    detectCollisions(player, world) {
        const candidates = this.broadPhase(player, world);
        // const colissions = this.narrowPhase(candidates, player);
    }
    /**
     * Performs a rough search against the world to return al possible blocks the player may be colliding with
     * @param {Player} player
     * @param {World} world
     * @returns {[]}
     */
    broadPhase(player, world) {
        const candidates = [];

        // Limpiar los helpers previos para evitar acumulación [BORRAR]
        this.helpers.clear();

        // Get the extents of the player
        const extents = {
            x: {
                min: Math.floor(player.position.x - player.radious),
                max: Math.ceil(player.position.x + player.radious),
            },
            y: {
                min: Math.floor(player.position.y - player.height),
                max: Math.ceil(player.position.y),
            },
            z: {
                min: Math.floor(player.position.z - player.radious),
                max: Math.ceil(player.position.z + player.radious),
            },
        };

        // Loop though all blocks in player extents
        for (let x = extents.x.min; x <= extents.x.max; x++) {
            for (let y = extents.y.min; y <= extents.y.max; y++) {
                for (let z = extents.z.min; z <= extents.z.max; z++) {
                    const block = world.getBlock(x, y, z);
                    if (block && block.id !== blocks.empty.id) {
                        const blockPos = { x, y, z };

                        candidates.push(blockPos);
                        this.addCollisionHelper(blockPos);
                    }
                }
            }
        }

        console.log(`Broadphase candidates: ${candidates.length}`);
        return candidates;
    }

    /**
     * Visualizes the block the player is colliding
     * @param {THREE.Object3D} block
     */
    addCollisionHelper(block) {
        const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);

        blockMesh.position.copy(block);
        this.helpers.add(blockMesh);
    }
}

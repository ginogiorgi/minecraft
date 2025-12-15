import * as THREE from "three";
import { blocks } from "./blocks";

export class Physics {
    constructor() {}
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
                        candidates.push(block);
                    }
                }
            }
        }

        console.log(`Broadphase candidates: ${candidates.length}`);
        return candidates;
    }
}

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
        const colissions = this.narrowPhase(candidates, player);
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

    narrowPhase(candidates, player) {
        const collisions = [];

        for (const block of candidates) {
            // Get the point on the block that is closest toh the center of the players bouding cilinder
            const p = player.position;
            const closestPoint = {
                x: Math.max(block.x - 0.5, Math.min(p.x, block.x + 0.5)),
                y: Math.max(
                    block.y - 0.5,
                    Math.min(p.y - player.height / 2, block.y + 0.5)
                ),
                z: Math.max(block.z - 0.5, Math.min(p.z, block.z + 0.5)),
            };

            // Get distance along each axis between closest point and the center of player bounding cilinder
            const dx = closestPoint.x - player.position.x;
            const dy = closestPoint.y - (player.position.y - player.height / 2);
            const dz = closestPoint.z - player.position.z;

            if (this.pointInPlayerCylinder(closestPoint, player)) {
                // Compute the overlat between the point and the players bounding cylinder
                const overlapY = player.height / 2 - Math.abs(dy);
                const overlapXZ = player.radious - Math.sqrt(dx * dx + dz * dz);

                // Compute the normal of the collision
                let normal, overlap;

                if (overlapY < overlapXZ) {
                    normal = new THREE.Vector3(0, -Math.sign(dy), 0);
                    overlap = overlapY;
                } else {
                    normal = new THREE.Vector3(-dx, 0, -dz).normalize();
                    overlap = overlapXZ;
                }

                collisions.push({
                    block,
                    contactPoint: closestPoint,
                    normal,
                    overlap,
                });

                console.log(`Narrowphanse Collisions: ${collisions.length}`);
            }
        }
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

    /**
     * Return true if point is inside bounding cylinder
     * @param {{x: number, y: number, z: number}} p
     * @param {Player} player
     * @returns {boolean}
     */
    pointInPlayerCylinder(p, player) {
        const dx = p.x - player.position.x;
        const dy = p.y - (player.position.y - player.height / 2);
        const dz = p.z - player.position.z;
        const r_sq = dx * dx + dz * dz;

        //Check if contact point is inside player bounding cylinder
        return (
            Math.abs(dy) < player.height / 2 &&
            r_sq < player.radious * player.radious
        );
    }
}

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { resourses } from "./blocks";

export function createUI(world, player) {
    const gui = new GUI();
    const terrainFolder = gui.addFolder("Terrain");
    const playerFolder = gui.addFolder("Player");

    gui.add(world.size, "width", 8, 128, 1).name("Width");
    gui.add(world.size, "height", 8, 128, 1).name("Height");
    playerFolder.add(player, "maxSpeed", 1, 20).name("Max Speed");
    terrainFolder.add(world.params, "seed", 0, 10000).name("Seed");
    terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
    terrainFolder
        .add(world.params.terrain, "magnitude", 0, 1)
        .name("Magnitude");
    terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");

    resourses.forEach((resourse) => {
        const resoursesFolder = gui.addFolder(resourse.name);
        const scaleFolder = resoursesFolder.addFolder("Scale");

        resoursesFolder.add(resourse, "scarcity", 0, 1).name("Scarcity");
        scaleFolder.add(resourse.scale, "x", 10, 100).name("X Scale");
        scaleFolder.add(resourse.scale, "y", 10, 100).name("Y Scale");
        scaleFolder.add(resourse.scale, "z", 10, 100).name("Z Scale");
    });

    gui.onChange(() => {
        world.generate();
    });
}

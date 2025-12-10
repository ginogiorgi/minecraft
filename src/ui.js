import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { blocks } from "./blocks";

export function createUI(world) {
    const gui = new GUI();
    const terrainFolder = gui.addFolder("Terrain");
    const resoursesFolder = gui.addFolder("Resourses");
    const scaleFolder = resoursesFolder.addFolder("Scale");

    gui.add(world.size, "width", 8, 128, 1).name("Width");
    gui.add(world.size, "height", 8, 128, 1).name("Height");
    terrainFolder.add(world.params, "seed", 0, 10000).name("Seed");
    terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
    terrainFolder
        .add(world.params.terrain, "magnitude", 0, 1)
        .name("Magnitude");
    terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");
    resoursesFolder.add(blocks.stone, "scarcity", 0, 1).name("Scarcity");
    scaleFolder.add(blocks.stone.scale, "x", 10, 100).name("X Scale");
    scaleFolder.add(blocks.stone.scale, "y", 10, 100).name("Y Scale");
    scaleFolder.add(blocks.stone.scale, "z", 10, 100).name("Z Scale");

    gui.onChange(() => {
        world.generate();
    });
}

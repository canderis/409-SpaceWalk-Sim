import * as BABYLON from 'babylonjs';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from 'babylonjs';

const canvas = document.getElementById("canvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const engine = new BABYLON.Engine(canvas, true);


function createScene() {
    var scene = new Scene(engine);

    var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    var sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    return scene;
}

var scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

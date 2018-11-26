import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from 'babylonjs';

import HandControl from './assets/HandControl.svg';
import Power from './assets/Power.png';


const canvas = document.getElementById("canvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const engine = new BABYLON.Engine(canvas, true);


function createScene() {
    var scene = new Scene(engine);

    // var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skybox.material = skyboxMaterial;

    // var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    // camera.attachControl(canvas, true);

    var sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    let box = sphere;

    // Parameters: name, position, scene
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 10, -10), scene);

    // The goal distance of camera from target
    camera.radius = 30;

    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 10;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    // Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.005

    // The speed at which acceleration is halted
    camera.maxCameraSpeed = 10

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
    // targetMesh created here.
    camera.target = sphere;   // version 2.4 and earlier
    camera.lockedTarget = sphere; //version 2.5 onwards

    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    const handControl = new BABYLON.GUI.Image("hand-module", HandControl);
    handControl.height = "300px";
    handControl.width = "400px";
    handControl.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    handControl.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(handControl);    

    const power = new GUI.Checkbox();
    power.isChecked = false;
    power.color = "red";
    power.background = "red";
    power.onIsCheckedChangedObservable.add(function(value) {
        if (value) {
            power.color = "green";
            power.background = "green";
        }
        else{
            power.color = "red";
            power.background = "red";
        }
    });

    power.left = "10px";
    power.top = "-230px";
    power.height = "20px";
    power.width = "20px";
    power.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    power.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(power);


    var powerText = new BABYLON.GUI.TextBlock();
    powerText.text = "Power On System";
    // powerText.width = "180px";
    powerText.left = "40px";
    powerText.top = "-230px";
    powerText.marginLeft = "5px";

    powerText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    powerText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    powerText.color = "black";

    advancedTexture.addControl(powerText);

    const slider = new BABYLON.GUI.Slider();
    slider.minimum = 0.1;
    slider.maximum = 20;
    slider.value = 5;
    slider.height = "20px";
    slider.width = "150px";
    slider.color = "#003399";
    slider.background = "grey";
    slider.left = "200px";
    slider.top = "-230px";
    slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.onValueChangedObservable.add(function (value) {
        sphere.scaling = unitVec.scale(value);
    });
    advancedTexture.addControl(slider);


    



    return scene;
}

var scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

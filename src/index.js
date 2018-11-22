import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from 'babylonjs';

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
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    let box = sphere;

// Parameters: name, position, scene
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

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

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var selectBox = new GUI.SelectionPanel("selectBox");
    selectBox.width = 0.25;
    selectBox.height = 0.52;
    selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    advancedTexture.addControl(selectBox);
    //
    var transformGroup = new BABYLON.GUI.CheckboxGroup("Transformation");
    var colorGroup = new BABYLON.GUI.RadioGroup("Color");
    var rotateGroup = new BABYLON.GUI.SliderGroup("Rotation");

    var toSize = function(isChecked) {
        if (isChecked) {
            box.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        }
        else {
            box.scaling = new BABYLON.Vector3(1, 1, 1);
        }
    }

    var toPlace = function(isChecked) {
        if (isChecked) {
            box.position.y = 1.5;
        }
        else {
            box.position.y = 0.5;
        }
    }

    var setColor = function(but) {
        switch(but) {
            case 0:
                // box.material = blueMat;
            break
            case 1:
                // box.material = redMat;
            break
        }
    }

// Change mesh
var orientateY = function(angle) {
    box.rotation.y = angle;
}

var orientateX = function(angle) {
    box.rotation.x = angle;
}

//Format value
var displayValue = function(value) {
    return BABYLON.Tools.ToDegrees(value) | 0;
}


transformGroup.addCheckbox("Small", toSize);
transformGroup.addCheckbox("High", toPlace);

colorGroup.addRadio("Blue", setColor, true);
colorGroup.addRadio("Red", setColor);

rotateGroup.addSlider("Angle Y", orientateY, "degs", 0, 2 * Math.PI, 0, displayValue);
rotateGroup.addSlider("Angle X", orientateX, "degs", 0, 2 * Math.PI, Math.PI, displayValue);

selectBox.addGroup(rotateGroup);
selectBox.addGroup(transformGroup);
selectBox.addGroup(colorGroup);

// Return to base
var withinRange = (x, min, max) => {
    return x >= min && x <= max;
}

var spaceShip = MeshBuilder.CreateBox("spaceShip", { height: 5, width: 5, depth: 10 }, scene);
spaceShip.position.x = 10;
spaceShip.position.y = 10;
spaceShip.position.x = 10;

// Keyboard events
var inputMap = {};
scene.actionManager = new BABYLON.ActionManager(scene);
scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
    inputMap[event.sourceEvent.key] = event.sourceEvent.type == "keydown";
}));
scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {                             
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));

// Game Loop
scene.onBeforeRenderObservable.add(() => {
    // TODO: remap to a switch to activate return to home base
    if (inputMap["g"]) {
        let move = setInterval (() => {
            sphere.position.x < spaceShip.position.x ? sphere.position.x += 0.1 : sphere.position.x -= 0.1;
            sphere.position.y < spaceShip.position.y ? sphere.position.y += 0.1 : sphere.position.y -= 0.1;
            sphere.position.z < spaceShip.position.z ? sphere.position.z += 0.1 : sphere.position.z -= 0.1;
            if (withinRange(sphere.position.x, spaceShip.position.x - 10.5, spaceShip.position.x + 10.5) &&
                withinRange(sphere.position.y, spaceShip.position.y - 5, spaceShip.position.y + 5) &&
                withinRange(sphere.position.z, spaceShip.position.z - 5, spaceShip.position.z + 5)) {
                clearInterval(move);
            }
        }, 20);
    }
    // move position of the space ship for testing
    if (inputMap["w"]) {
        sphere.position.y += 0.1;
    }
    if (inputMap["s"]) {
        sphere.position.y -= 0.1;
    }
    if (inputMap["a"]) {
        sphere.position.x -= 0.1;
    }
    if (inputMap["d"]) {
        sphere.position.x += 0.1;
    }
});

return scene;
}

var scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

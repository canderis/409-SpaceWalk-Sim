import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { VirtualJoystick, JoystickAxis, Scene, Matrix, HemisphericLight, MeshBuilder, Vector3 } from 'babylonjs';

import HandControl from './assets/HandControl.svg';
import Power from './assets/Power.png';
import bk1 from './assets/cwd_px.jpg';
import bk2 from './assets/cwd_py.jpg';
import bk3 from './assets/cwd_pz.jpg';
import bk4 from './assets/cwd_nx.jpg';
import bk5 from './assets/cwd_ny.jpg';
import bk6 from './assets/cwd_nz.jpg';







const canvas = document.getElementById("canvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const engine = new BABYLON.Engine(canvas, true);


const createScene = () => {
    const scene = new Scene(engine);
    VirtualJoystick.canvas = canvas;

    const spaceShip = MeshBuilder.CreateBox("spaceShip", { height: 5, width: 5, depth: 10 }, scene);
    spaceShip.position.x = 10;
    spaceShip.position.y = 10;
    spaceShip.position.x = 10;
    
    const sphere =  MeshBuilder.CreateBox("spaceman", { height: 2, width: 2, depth: 3 }, scene);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;

    // Parameters: name, position, scene
    // var camera = new BABYLON.ArcFollowCamera("Camera", 0, 10, 100, spaceShip, scene);
    // camera.attachControl(canvas, true);
  // Parameters: alpha, beta, radius, target position, scene
    //   var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

    //   // Positions the camera overwriting alpha, beta, radius
    //       camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    
    //   // This attaches the camera to the canvas
    //       camera.attachControl(canvas, true);


   // Parameters : name, position, scene
//    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

//    // Targets the camera to a particular position. In this case the scene origin
//     camera.setTarget(BABYLON.Vector3.Zero());
   
//    // Attach the camera to the canvas
//     camera.attachControl(canvas, true);

    var camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);

    // Airplane like rotation, with faster roll correction and banked-turns.
    // Default is 100. A higher number means slower correction.
    camera.rollCorrect = 10;
    // Default is false.
    camera.bankedTurn = true;
    // Defaults to 90° in radians in how far banking will roll the camera.
    camera.bankedTurnLimit = Math.PI / 2;
    // How much of the Yawing (turning) will affect the Rolling (banked-turn.)
    // Less than 1 will reduce the Rolling, and more than 1 will increase it.
    camera.bankedTurnMultiplier = 1;
    camera.noRotationConstraint = true;
    camera.updateUpVectorFromRotation = true;

    // camera.rotationQuaternion = true;
    console.log(camera);

    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    let joystick = buildGUI(scene);

    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
        inputMap[event.sourceEvent.key] = event.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {                             
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    const withinRange = (x, min, max) => {
        return x >= min && x <= max;
    }


    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cwd", scene, null, null, [bk1,
        bk2,
        bk3,
        bk4,
        bk5,
        bk6]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    // var VJC = new BABYLON.VirtualJoysticksCamera("VJC", scene.activeCamera.position, scene);
    // VJC.rotation = scene.activeCamera.rotation;
    // VJC.checkCollisions = scene.activeCamera.checkCollisions;
    // VJC.applyGravity = scene.activeCamera.applyGravity;

    // scene.activeCamera = VJC;
    //     // Attach camera to canvas inputs
    //     scene.activeCamera.attachControl(canvas);

    // Game Loop
    scene.onBeforeRenderObservable.add(() => {
        // console.log('loop');

        
        camera.cameraRotation = camera.cameraRotation.addVector3(joystick.deltaPosition.scale(0.005));

        // console.log(joystick.deltaPosition)

        // TODO: remap to a switch to activate return to home base
        if (inputMap["g"]) {
            let move = setInterval (() => {
                camera.position.x < spaceShip.position.x ? camera.position.x += 0.1 : camera.position.x -= 0.1;
                camera.position.y < spaceShip.position.y ? camera.position.y += 0.1 : camera.position.y -= 0.1;
                camera.position.z < spaceShip.position.z ? camera.position.z += 0.1 : camera.position.z -= 0.1;
                if (withinRange(camera.position.x, spaceShip.position.x - 10.5, spaceShip.position.x + 10.5) &&
                    withinRange(camera.position.y, spaceShip.position.y - 5, spaceShip.position.y + 5) &&
                    withinRange(camera.position.z, spaceShip.position.z - 5, spaceShip.position.z + 5)) {
                    clearInterval(move);
                }
            }, 20);
        }
        // move position of the space ship for testing
        if (inputMap["w"]) {
            camera.position.y += 0.1;
        }
        if (inputMap["s"]) {
            camera.position.y -= 0.1;
        }
        if (inputMap["a"]) {
            camera.position.x -= 0.1;
        }
        if (inputMap["d"]) {
            camera.position.x += 0.1;
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



function buildGUI(scene){
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
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


    const powerText = new BABYLON.GUI.TextBlock();
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


    let joystick = new BABYLON.VirtualJoystick(true);

    joystick._joystickPointerStartPos.x = 275;
    joystick._joystickPointerStartPos.y = canvas.height - 125;

    joystick._onPointerDown = function(e) {
        var positionOnScreenCondition;

        e.preventDefault();

        if (this._leftJoystick === true) {
            positionOnScreenCondition = (e.clientX < VirtualJoystick.halfWidth);
        }
        else {
            positionOnScreenCondition = (e.clientX > VirtualJoystick.halfWidth);
        }

        // ;


        if (positionOnScreenCondition && this._joystickPointerID < 0) {
            // First contact will be dedicated to the virtual joystick
            this._joystickPointerID = e.pointerId;
            this._joystickPointerPos = this._joystickPointerStartPos.clone();
            this._joystickPreviousPointerPos = this._joystickPointerStartPos.clone();
            this._deltaJoystickVector.x = 0;
            this._deltaJoystickVector.y = 0;
            this.pressed = true;
            this._touches.add(e.pointerId.toString(), e);
        }
        else {
            // You can only trigger the action buttons with a joystick declared
            if (VirtualJoystick._globalJoystickIndex < 2 && this._action) {
                this._action();
                this._touches.add(e.pointerId.toString(), { x: e.clientX, y: e.clientY, prevX: e.clientX, prevY: e.clientY });
            }
        }
    }
     joystick._drawVirtualJoystick = function() {
        if (this.pressed) {
            this._touches.forEach((key, touch) => {
                if (touch.pointerId === this._joystickPointerID) {
                    VirtualJoystick.vjCanvasContext.clearRect(this._joystickPointerStartPos.x - 64, this._joystickPointerStartPos.y - 64, 128, 128);
                    VirtualJoystick.vjCanvasContext.clearRect(this._joystickPreviousPointerPos.x - 42, this._joystickPreviousPointerPos.y - 42, 84, 84);
                    joystick.init();                    
                    VirtualJoystick.vjCanvasContext.beginPath();
                    VirtualJoystick.vjCanvasContext.strokeStyle = this._joystickColor;
                    VirtualJoystick.vjCanvasContext.arc(this._joystickPointerPos.x, this._joystickPointerPos.y, 40, 0, Math.PI * 2, true);
                    VirtualJoystick.vjCanvasContext.stroke();
                    VirtualJoystick.vjCanvasContext.closePath();
                    this._joystickPreviousPointerPos = this._joystickPointerPos.clone();
                }
                else {
                    VirtualJoystick.vjCanvasContext.clearRect(touch.prevX - 44, touch.prevY - 44, 88, 88);
                    VirtualJoystick.vjCanvasContext.beginPath();
                    VirtualJoystick.vjCanvasContext.fillStyle = "white";
                    VirtualJoystick.vjCanvasContext.beginPath();
                    VirtualJoystick.vjCanvasContext.strokeStyle = "red";
                    VirtualJoystick.vjCanvasContext.lineWidth = 6;
                    VirtualJoystick.vjCanvasContext.arc(touch.x, touch.y, 40, 0, Math.PI * 2, true);
                    VirtualJoystick.vjCanvasContext.stroke();
                    VirtualJoystick.vjCanvasContext.closePath();
                    touch.prevX = touch.x;
                    touch.prevY = touch.y;
                }
            });
        }
        else{
            this.deltaPosition = this.deltaPosition.scale(0.9);
        }
        requestAnimationFrame(() => { this._drawVirtualJoystick(); });
    }

    joystick.init = function(){
        VirtualJoystick.vjCanvasContext.beginPath();
        VirtualJoystick.vjCanvasContext.lineWidth = 6;
        VirtualJoystick.vjCanvasContext.strokeStyle = this._joystickColor;
        VirtualJoystick.vjCanvasContext.arc(this._joystickPointerStartPos.x, this._joystickPointerStartPos.y, 40, 0, Math.PI * 2, true);
        VirtualJoystick.vjCanvasContext.stroke();
        VirtualJoystick.vjCanvasContext.closePath();
        VirtualJoystick.vjCanvasContext.beginPath();
        VirtualJoystick.vjCanvasContext.strokeStyle = this._joystickColor;
        VirtualJoystick.vjCanvasContext.lineWidth = 2;
        VirtualJoystick.vjCanvasContext.arc(this._joystickPointerStartPos.x, this._joystickPointerStartPos.y, 60, 0, Math.PI * 2, true);
        VirtualJoystick.vjCanvasContext.stroke();
        VirtualJoystick.vjCanvasContext.closePath();
    }

    joystick._onPointerUp = function (e) {
        this._deltaJoystickVector.x = 0;
        this._deltaJoystickVector.y = 0;

        if (this._joystickPointerID == e.pointerId) {
            BABYLON.VirtualJoystick.vjCanvasContext.clearRect(this._joystickPointerStartPos.x - 64, this._joystickPointerStartPos.y - 64, 128, 128);
            BABYLON.VirtualJoystick.vjCanvasContext.clearRect(this._joystickPreviousPointerPos.x - 42, this._joystickPreviousPointerPos.y - 42, 84, 84);     
            this._joystickPointerID = -1;
            this.pressed = false;
        }
        else {
            var touch = this._touches.get(e.pointerId.toString());
            if (touch) {
                BABYLON.VirtualJoystick.vjCanvasContext.clearRect(touch.prevX - 44, touch.prevY - 44, 88, 88);
            }
        }
        
        joystick.init();

        this._touches.remove(e.pointerId.toString());
    };
    joystick.setAxisForUpDown(JoystickAxis.X);
    joystick.setAxisForLeftRight(JoystickAxis.Y);

    joystick.init();
    joystick.setJoystickSensibility = 1000000000;
    // joystick.releaseCanvas()
    return joystick;
}
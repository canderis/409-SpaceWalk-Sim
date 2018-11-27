import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import {
    VirtualJoystick,
    JoystickAxis,
    Scene,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Vector3,
    Vector2,
    FlyCamera,
    StandardMaterial,
    Color3,
    CubeTexture,
    Texture,
    Matrix
} from 'babylonjs';

import HandControl from './assets/HandControl.svg';
import Power from './assets/Power.png';
import bk1 from './assets/cwd_px.jpg';
import bk2 from './assets/cwd_py.jpg';
import bk3 from './assets/cwd_pz.jpg';
import bk4 from './assets/cwd_nx.jpg';
import bk5 from './assets/cwd_ny.jpg';
import bk6 from './assets/cwd_nz.jpg';

const canvas = document.getElementById("canvas");
const engine = new Engine(canvas, true);

canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const buildSkybox = (scene) => {
    const skybox = MeshBuilder.CreateBox("skyBox", {size:8192.0}, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/cwd", scene, null, null, [bk1,bk2,bk3,bk4,bk5,bk6]);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
}

const buildGUI = (scene, guiVars, camera, spaceShip) => {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    const handControl = new GUI.Image("hand-module", HandControl);
    handControl.height = "300px";
    handControl.width = "400px";
    handControl.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    handControl.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(handControl);    

    const powerText = new GUI.TextBlock();
    powerText.text = "Power On System";
    powerText.left = "40px";
    powerText.top = "-230px";
    powerText.marginLeft = "5px";

    powerText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    powerText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    powerText.color = "black";

    advancedTexture.addControl(powerText);


    const homeText = new GUI.TextBlock();
    homeText.text = "Return to Home";
    // powerText.width = "180px";
    homeText.left = "40px";
    homeText.top = "-200px";
    homeText.marginLeft = "5px";

    homeText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    homeText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    homeText.color = "black";

    advancedTexture.addControl(homeText);

    const slider = new GUI.Slider();
    slider.minimum = 0.1;
    slider.maximum = 20;
    slider.value = 5;
    slider.height = "20px";
    slider.width = "150px";
    slider.color = "#003399";
    slider.background = "grey";
    slider.left = "200px";
    slider.top = "-230px";
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.onValueChangedObservable.add(function (value) {
        guiVars.acceleration = 0.0001 * value;
        console.log(guiVars)
    });
    advancedTexture.addControl(slider);

    let joystick = new VirtualJoystick(true);

    joystick._joystickPointerStartPos.x = 100;
    joystick._joystickPointerStartPos.y = 100;

    joystick._onPointerDown = function(e) {
        var positionOnScreenCondition;
        console.log(e);

        e.preventDefault();

        if (this._leftJoystick === true) {
            positionOnScreenCondition = (e.offsetX < VirtualJoystick.halfWidth);
        }
        else {
            positionOnScreenCondition = (e.offsetX > VirtualJoystick.halfWidth);
        }

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
                this._touches.add(e.pointerId.toString(), { x: e.offsetX, y: e.offsetY, prevX: e.offsetX, prevY: e.offsetY });
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
            // this.deltaPosition = this.deltaPosition.scale(0.9);
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
            VirtualJoystick.vjCanvasContext.clearRect(this._joystickPointerStartPos.x - 64, this._joystickPointerStartPos.y - 64, 128, 128);
            VirtualJoystick.vjCanvasContext.clearRect(this._joystickPreviousPointerPos.x - 42, this._joystickPreviousPointerPos.y - 42, 84, 84);     
            this._joystickPointerID = -1;
            this.pressed = false;
        }
        else {
            var touch = this._touches.get(e.pointerId.toString());
            if (touch) {
                VirtualJoystick.vjCanvasContext.clearRect(touch.prevX - 44, touch.prevY - 44, 88, 88);
            }
        }
        
        joystick.init();

        this._touches.remove(e.pointerId.toString());
    };

    joystick._onPointerMove = function(e) {
        // If the current pointer is the one associated to the joystick (first touch contact)
        if (this._joystickPointerID == e.pointerId) {
            this._joystickPointerPos.x = e.offsetX;
            this._joystickPointerPos.y = e.offsetY;
            this._deltaJoystickVector = this._joystickPointerPos.clone();
            this._deltaJoystickVector = this._deltaJoystickVector.subtract(this._joystickPointerStartPos);

            var directionLeftRight = this.reverseLeftRight ? -1 : 1;
            var deltaJoystickX = directionLeftRight * this._deltaJoystickVector.x / this._inversedSensibility;
            switch (this._axisTargetedByLeftAndRight) {
                case JoystickAxis.X:
                    this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
                case JoystickAxis.Y:
                    this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
                case JoystickAxis.Z:
                    this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
            }
            var directionUpDown = this.reverseUpDown ? 1 : -1;
            var deltaJoystickY = directionUpDown * this._deltaJoystickVector.y / this._inversedSensibility;
            switch (this._axisTargetedByUpAndDown) {
                case JoystickAxis.X:
                    this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
                case JoystickAxis.Y:
                    this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
                case JoystickAxis.Z:
                    this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
            }
        }
        else {
            let data = this._touches.get(e.pointerId.toString());
            if (data) {
                data.x = e.offsetX;
                data.y = e.offsetX;
            }
        }
    }

    joystick.setAxisForUpDown(JoystickAxis.X);
    joystick.setAxisForLeftRight(JoystickAxis.Y);
    VirtualJoystick.Canvas.height = 200;
    VirtualJoystick.Canvas.width = 200;
    VirtualJoystick.Canvas.style.height = '200px';
    VirtualJoystick.Canvas.style.width = '200px';
    VirtualJoystick.Canvas.style.bottom = '0';
    VirtualJoystick.Canvas.style.top = 'unset';

    VirtualJoystick.Canvas.style.left = '150px';


    const power = new GUI.Checkbox();
    power.isChecked = false;
    power.color = "red";
    power.background = "red";
    power.onIsCheckedChangedObservable.add(function(value) {
        guiVars.poweredOn = value;
        if (value) {
            joystick.deltaPosition = joystick.deltaPosition.scale(0);
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
    power.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    power.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(power);


    const returnToHome = new GUI.Checkbox();
    returnToHome.isChecked = false;
    returnToHome.color = "red";
    returnToHome.background = "red";
    returnToHome.onIsCheckedChangedObservable.add(function(value) {
        guiVars.returnToHome = value;
        if (value) {
            joystick.deltaPosition = joystick.deltaPosition.scale(0);
            returnToHome.color = "green";
            returnToHome.background = "green";

            // camera.upVector.normalize();

            
                    // camera.cameraRotation = new Vector2(guiVars.rotationTarget.x, guiVars.rotationTarget.y)

        }
        else{
            guiVars.rotationTarget = new Vector3(0,0,0);
            returnToHome.color = "red";
            returnToHome.background = "red";
        }
    });

    returnToHome.left = "10px";
    returnToHome.top = "-200px";
    returnToHome.height = "20px";
    returnToHome.width = "20px";
    returnToHome.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    returnToHome.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(returnToHome);


    joystick.init();
    joystick.setJoystickSensibility = 1000000000;
    // joystick.releaseCanvas()
    return joystick;
}

// simplified face funtion
const facePoint = (rotatingObject, pointToRotateTo) => {
    // a directional vector from one object to the other one
    var direction = pointToRotateTo.subtract(rotatingObject.position);
    
    
    if (!rotatingObject.rotationQuaternion) {
        rotatingObject.rotationQuaternion = BABYLON.Quaternion.Identity();
    }
    
    direction.normalize();
    
    var mat = BABYLON.Matrix.Identity();
    
    var upVec = BABYLON.Vector3.Up();
    
    var xaxis = BABYLON.Vector3.Cross(direction, upVec);
    var yaxis = BABYLON.Vector3.Cross(xaxis, direction);
    
    mat.m[0] = xaxis.x;
    mat.m[1] = xaxis.y;
    mat.m[2] = xaxis.z;
    
    mat.m[4] = direction.x;
    mat.m[5] = direction.y;
    mat.m[6] = direction.z;
    
    mat.m[8] = yaxis.x;
    mat.m[9] = yaxis.y;
    mat.m[10] = yaxis.z;
    
    BABYLON.Quaternion.FromRotationMatrixToRef(mat, rotatingObject.rotationQuaternion);
}


const createScene = () => {
    const scene = new Scene(engine);
    VirtualJoystick.canvas = canvas;

    const spaceShip = MeshBuilder.CreateBox("spaceShip", { height: 5, width: 5, depth: 10 }, scene);
    spaceShip.position.x = 100;
    spaceShip.position.y = 100;
    spaceShip.position.x = 100;

    const camera = new FlyCamera("FlyCamera", new Vector3(0, 5, -10), scene);
    camera.noRotationConstraint = true;
    camera.updateUpVectorFromRotation = true;
    camera.checkCollisions = true;

    var sunlight = new HemisphericLight("sunlight", new Vector3(-1, -10, -4), scene);
    sunlight.groundColor = new BABYLON.Color3(0.1, 0.15, 0.25);

    const guiVars = {
        poweredOn: false,
        returnToHome: false,
        acceleration: 0.0001,
        rotationTarget: new Vector3(0,0,0)
    };

    const joystick = buildGUI(scene, guiVars,camera, spaceShip);
    buildSkybox(scene);
    let rotation = new Vector3(0.001, 0.002, 0.003);
    let velocity = new Vector3(0.01, 0.02, 0.03);

    // Game Loop
    scene.onBeforeRenderObservable.add(() => {
        if(guiVars.poweredOn) {
            velocity = velocity.add(camera.upVector.scale(guiVars.acceleration));
            if(!guiVars.returnToHome){
                rotation = rotation.add(joystick.deltaPosition.scale(0.003));
            }
            else{
                const withinRange = (x, min, max) => x >= min && x <= max;
                velocity = new Vector3(0, 0 ,0);
                if (withinRange(camera.position.x, spaceShip.position.x - 10.5, spaceShip.position.x + 10.5) &&
                    withinRange(camera.position.y, spaceShip.position.y - 5, spaceShip.position.y + 5) &&
                    withinRange(camera.position.z, spaceShip.position.z - 5, spaceShip.position.z + 5)) {
                    
                    console.log('home');
                }
                else{
                    camera.position.x < spaceShip.position.x ? camera.position.x += 0.1 : camera.position.x -= 0.1;
                    camera.position.y < spaceShip.position.y ? camera.position.y += 0.1 : camera.position.y -= 0.1;
                    camera.position.z < spaceShip.position.z ? camera.position.z += 0.1 : camera.position.z -= 0.1;
                    
                    let matrix = Matrix.Zero();
                    let target = new Vector3(0,0,0);

                    Matrix.LookAtLHToRef(camera.position, spaceShip.position, Vector3.Up(), matrix);
                    matrix.invert();

                    target.x = Math.atan(matrix.m[6] / matrix.m[10]);

                    var vDir = spaceShip.position.subtract(camera.position);

                    if (vDir.x >= 0.0) {
                        target.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
                    } else {
                        target.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
                    }

                    if (isNaN(target.x)) {
                        target.x = 0;
                    }

                    if (isNaN(target.y)) {
                        target.y = 0;
                    }

                    camera.rotation.z = 0;
                    // camera.cameraRotation = target;
                    guiVars.rotationTarget = target;

                    if( camera.rotation.x - guiVars.rotationTarget.x > .1){
                        camera.rotation.x-=.01;
                    }
                    else if( camera.rotation.x - guiVars.rotationTarget.x < -.1)
                    {
                        camera.rotation.x+=.01;
                    }
    
                    if( camera.rotation.y - guiVars.rotationTarget.y > .1){
                        camera.rotation.y-=.01;
                    }
                    else if( camera.rotation.y - guiVars.rotationTarget.y < -0.1)
                    {
                        camera.rotation.y+=.01;
                    }
                }
            }
        }
        guiVars.velocity+=guiVars.acceleration;
        camera.cameraRotation = rotation;
        camera.position = camera.position.subtract(velocity);

    });


    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
    VirtualJoystick.Canvas.height = 125;
    VirtualJoystick.Canvas.width = 125;
});
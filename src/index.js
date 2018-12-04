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
    Matrix,
    Quaternion
} from 'babylonjs';

import './favicons/favicons';

import HandControl from './assets/HandControl.svg';
import HomeProtocol from './assets/HomeProtocol.png';
import FuelWarning from './assets/FuelWarning.png';
import OxygenWarning from './assets/OxygenWarning.png';
import NoFuel from './assets/NoFuel.png';

import SpaceBase from './assets/HomeBase_V3.babylon';

import bk1 from './assets/cwd_px.jpg';
import bk2 from './assets/cwd_py.jpg';
import bk3 from './assets/cwd_pz.jpg';
import bk4 from './assets/cwd_nx.jpg';
import bk5 from './assets/cwd_ny.jpg';
import bk6 from './assets/cwd_nz.jpg';
import FuturisticArmour from './assets/FuturisticArmour.otf';
import Success from './assets/Success.png';
import Failure from './assets/Failure.png';

document.body.style.src = `url(${FuturisticArmour}) format("opentype")`;

const canvas = document.getElementById("canvas");
const engine = new Engine(canvas, true);

canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

const buildSkybox = (scene) => {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 8192.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/cwd", scene, null, null, [bk1, bk2, bk3, bk4, bk5, bk6]);
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

    const homeProtocol = new GUI.Image("home-protocol", HomeProtocol);
    homeProtocol.height = "80px";
    homeProtocol.width = "800px";
    homeProtocol.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    homeProtocol.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(homeProtocol);

    const win = new GUI.Image("win", Success);
    win.height = "80px";
    win.width = "800px";
    win.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    win.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(win);
    win.isVisible = false;

    guiVars.win = win;

    const lose = new GUI.Image("lose", Failure);
    lose.height = "80px";
    lose.width = "800px";
    lose.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    lose.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(lose);
    lose.isVisible = false;

    guiVars.lose = lose;

    const fuelWarning = new GUI.Image("fuel-warning", FuelWarning);
    fuelWarning.height = "80px";
    fuelWarning.width = "800px";
    fuelWarning.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    fuelWarning.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(fuelWarning);

    const noFuel = new GUI.Image("no-fuel", NoFuel);
    noFuel.height = "80px";
    noFuel.width = "800px";
    noFuel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    noFuel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(noFuel);

    const oxygenWarning = new GUI.Image("oxygen-warning", OxygenWarning);
    oxygenWarning.height = "80px";
    oxygenWarning.width = "800px";
    oxygenWarning.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    oxygenWarning.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(oxygenWarning);

    const powerText = new GUI.TextBlock();
    powerText.text = "Power On System";
    powerText.left = "40px";
    powerText.top = "-230px";
    powerText.marginLeft = "5px";
    powerText.fontFamily = "FuturisticArmour";

    powerText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    powerText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    powerText.color = "white";

    advancedTexture.addControl(powerText);


    const homeText = new GUI.TextBlock();
    homeText.text = "Return to Home";
    // powerText.width = "180px";
    homeText.left = "40px";
    homeText.top = "-200px";
    homeText.marginLeft = "5px";

    homeText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    homeText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    homeText.color = "white";
    homeText.fontFamily = "FuturisticArmour";
    advancedTexture.addControl(homeText);

    const throttleText = new GUI.TextBlock();
    throttleText.text = "Throttle";
    // powerText.width = "180px";
    throttleText.left = "10px";
    throttleText.top = "-140px";
    throttleText.marginLeft = "5px";

    throttleText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    throttleText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    throttleText.color = "white";
    throttleText.fontFamily = "FuturisticArmour";
    advancedTexture.addControl(throttleText);


    const fuel = new GUI.TextBlock();
    guiVars.fuelGUI = fuel;
    fuel.text = `Fuel: ${guiVars.fuel}%`;
    fuel.top = "10px";
    fuel.left = "-10px";
    fuel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fuel.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    fuel.color = "white";
    advancedTexture.addControl(fuel);


    const oxygen = new GUI.TextBlock();
    guiVars.oxygenGUI = oxygen;
    oxygen.text = `Oxygen: ${guiVars.oxygen}%`;
    oxygen.top = "30px";
    oxygen.left = "-10px";
    oxygen.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    oxygen.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    oxygen.color = "white";
    oxygenWarning.isVisible = false;
    advancedTexture.addControl(oxygen);

    // fuel.fontFamily="FuturisticArmour";

    const roll = new GUI.TextBlock();
    guiVars.rollGUI = roll;
    roll.text = `Roll: ${guiVars.axes.x}`;
    roll.top = "50px";
    roll.left = "-10px";
    roll.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    roll.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    roll.color = "white";
    advancedTexture.addControl(roll);

    const pitch = new GUI.TextBlock();
    guiVars.pitchGUI = pitch;
    pitch.text = `Pitch: ${guiVars.axes.y}`;
    pitch.top = "70px";
    pitch.left = "-10px";
    pitch.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    pitch.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    pitch.color = "white";
    advancedTexture.addControl(pitch);

    const yaw = new GUI.TextBlock();
    guiVars.yawGUI = yaw;
    yaw.text = `Yaw: ${guiVars.axes.z}`;
    yaw.top = "90px";
    yaw.left = "-10px";
    yaw.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    yaw.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    yaw.color = "white";
    advancedTexture.addControl(yaw);

    const slider = new GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 20;
    slider.value = 0;
    slider.height = "20px";
    slider.width = "150px";
    slider.color = "#003399";
    slider.background = "grey";
    slider.left = "5px";
    slider.top = "-110px";
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.onValueChangedObservable.add(function (value) {
        guiVars.acceleration = 0.00001 * value;
        console.log(guiVars)
    });
    advancedTexture.addControl(slider);

    let joystick = new VirtualJoystick(true);

    joystick._joystickPointerStartPos.x = 120;
    joystick._joystickPointerStartPos.y = 190;

    joystick._onPointerDown = function (e) {
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
    joystick._drawVirtualJoystick = function () {
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
        else {
            // this.deltaPosition = this.deltaPosition.scale(0.9);
        }
        requestAnimationFrame(() => { this._drawVirtualJoystick(); });
    }

    joystick.init = function () {
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
        this.deltaPosition = new Vector3(0,0,0);

        this.init();

        this._touches.remove(e.pointerId.toString());
    };

    joystick._onPointerMove = function (e) {
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
    VirtualJoystick.Canvas.height = 280;
    VirtualJoystick.Canvas.width = 230;
    VirtualJoystick.Canvas.style.height = '280px';
    VirtualJoystick.Canvas.style.width = '230px';
    VirtualJoystick.Canvas.style.bottom = '0';
    VirtualJoystick.Canvas.style.top = 'unset';

    VirtualJoystick.Canvas.style.left = '150px';

    const power = new GUI.Checkbox();
    power.isChecked = false;
    power.color = "red";
    power.background = "red";


    power.left = "10px";
    power.top = "-230px";
    power.height = "20px";
    power.width = "20px";
    power.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    power.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(power);

    homeProtocol.isVisible = false;
    fuelWarning.isVisible = false;
    noFuel.isVisible = false;


    guiVars.noFuel = () => {
        homeProtocol.isVisible = false;
        noFuel.isVisible = true;
        fuelWarning.isVisible = false;
        oxygenWarning.isVisible = false;
    }

    guiVars.fuelWarning = () => {
        homeProtocol.isVisible = false;
        fuelWarning.isVisible = true;
        oxygenWarning.isVisible = false;
        noFuel.isVisible = false;

    }

    guiVars.oxygenWarning = () => {
        homeProtocol.isVisible = false;
        fuelWarning.isVisible = false;
        oxygenWarning.isVisible = true;
        noFuel.isVisible = false;
    }


    const returnToHome = new GUI.Checkbox();
    returnToHome.isChecked = false;
    returnToHome.color = "red";
    returnToHome.background = "red";
    returnToHome.isEnabled = false;
    returnToHome.onIsCheckedChangedObservable.add(function (value) {
        guiVars.returnToHome = value;
        if (value) {
            joystick.deltaPosition = joystick.deltaPosition.scale(0);
            if (!fuelWarning.isVisible)
                homeProtocol.isVisible = true;
            returnToHome.color = "green";
            returnToHome.background = "green";
        }
        else {
            guiVars.rotationTarget = new Vector3(0, 0, 0);
            homeProtocol.isVisible = false;

            returnToHome.color = "red";
            returnToHome.background = "red";
        }
    });

    power.onIsCheckedChangedObservable.add(function (value) {
        guiVars.poweredOn = value;
        if (value) {
            joystick.deltaPosition = joystick.deltaPosition.scale(0);
            returnToHome.isEnabled = true;
            power.color = "green";
            power.background = "green";
        }
        else {
            power.color = "red";
            power.background = "red";
            returnToHome.isEnabled = false;
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

    return joystick;
}

const createScene = () => {
    const scene = new Scene(engine);
    VirtualJoystick.canvas = canvas;
 
    BABYLON.SceneLoader.Append("",SpaceBase, scene, function (scene)
    {
    });

    //This is just the box that is centered at the base for the math to work
    const spaceShip = MeshBuilder.CreateBox("spaceShip", { height: 0, width: 0, depth: 0 }, scene);
    spaceShip.position.x = 0;
    spaceShip.position.y = 0;
    spaceShip.position.x = 0;

    const camera = new FlyCamera("FlyCamera", new Vector3(200, 150, -100), scene);
    camera.noRotationConstraint = true;
    camera.updateUpVectorFromRotation = true;
    camera.checkCollisions = true;

    var sunlight = new HemisphericLight("sunlight", new Vector3(-1, -10, -4), scene);
    sunlight.groundColor = new BABYLON.Color3(0.1, 0.15, 0.25);

    const guiVars = {
        poweredOn: false,
        returnToHome: false,
        acceleration: 0,
        rotationTarget: new Vector3(0, 0, 0),
        fuel: 100,
        oxygen: 100,
        velocity: new Vector3(0, 0, 0),
        axes: new Vector3(0, 0, 0)
    };

    const joystick = buildGUI(scene, guiVars, camera, spaceShip);
    buildSkybox(scene);
    // camera.rotation = camera.rotation.add(new Vector3(0.01, 1, 1));
    let velocity = new Vector3(0.01, 0.02, 0.03);
    camera.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);

    // Game Loop
    let ctr = 0;
    let oxyCtr = 0;
    const withinRange = (x, min, max) => x >= min && x <= max;
    let rotationVelocity = {
        _yaw: 0.001,
        _pitch: 0.001,
        _roll: 0.001,
        _yawfactor: 0.00,
        _pitchfactor: 0.001,
        _rollfactor: 0.00,

        get yaw() {return this._yaw+=this._yawfactor},
        get pitch() {return this._pitch+=this._pitchfactor},
        get roll() {return this._roll+=this._rollfactor},
        add(vector) {
            this._pitchfactor+= vector.x;
            this._yawfactor+= -1 * vector.y;
        }
    };
    scene.onBeforeRenderObservable.add(() => {        
        if (withinRange(camera.position.x, spaceShip.position.x - 70, spaceShip.position.x + 70) &&
            withinRange(camera.position.y, spaceShip.position.y - 70, spaceShip.position.y + 70) &&
            withinRange(camera.position.z, spaceShip.position.z - 70, spaceShip.position.z + 70)) {

            guiVars.win.isVisible = true;
            return;
        }
        oxyCtr++;
        if (oxyCtr > 100) {
            if (guiVars.oxygen < 16) {
                if (guiVars.oxygen == 0) {
                    guiVars.lose.isVisible = true;
                    return;
                } else {
                    guiVars.oxygenWarning();

                }
            }
            oxyCtr = 0;
            guiVars.oxygen--;
            guiVars.oxygenGUI.text = `Oxygen: ${guiVars.oxygen}%`;
        }
        if (guiVars.fuel == 0) {
            guiVars.noFuel();
        }

        let acceleration = guiVars.acceleration;
        let resQ = false;
        
        if (guiVars.poweredOn && guiVars.fuel > 0) {
            ctr++;
            
            if (!guiVars.returnToHome) {
                console.log(joystick.deltaPosition)
                rotationVelocity.add(joystick.deltaPosition.scale(0.00005));
                acceleration = acceleration + .0001;
            }
            else {                
                camera.position.x < spaceShip.position.x ? camera.position.x += 0.05 : camera.position.x -= 0.05;
                camera.position.y < spaceShip.position.y ? camera.position.y += 0.05 : camera.position.y -= 0.05;
                camera.position.z < spaceShip.position.z ? camera.position.z += 0.05 : camera.position.z -= 0.05;

                let matrix = Matrix.Zero();
                let target = new Vector3(0, 0, 0);

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
                
                target.z = 0;

                guiVars.rotationTarget = target;
                
                let targetQ = Quaternion.RotationYawPitchRoll(target.y, target.x, target.z);
                resQ = camera.rotationQuaternion;

                let accelerate= true;

                let xThresh = resQ.x - targetQ.x;
                console.log(xThresh);
                if( xThresh > .03){
                    if(rotationVelocity._pitchfactor > -.1*xThresh){
                        rotationVelocity._pitchfactor-=0.0001;
                        accelerate= false;
                    }
                }
                else if(xThresh < -.03){
                    if(rotationVelocity._pitchfactor < -.1*xThresh){
                        rotationVelocity._pitchfactor+=0.0001;
                        accelerate= false;
                    }
                }

                let yThresh = resQ.y - targetQ.y;
                console.log(xThresh);
                if(yThresh > .03 ){
                    if(rotationVelocity._yawfactor > -.1*yThresh){
                        rotationVelocity._yawfactor-=0.0001;
                        accelerate= false;
                    }
                }
                else if(yThresh < -.03 ){
                    if(rotationVelocity._yawfactor < -.1*yThresh){
                        rotationVelocity._yawfactor+=0.0001;
                        accelerate= false;
                    }
                }

                if(resQ.z > targetQ.z - .01){
                    if(rotationVelocity._rollfactor > -.0001)
                        rotationVelocity._rollfactor-=0.0001;
                }
                else if(resQ.z < targetQ.z + .01){
                    if(rotationVelocity._rollfactor < .0001)
                        rotationVelocity._rollfactor+=0.0001;
                }

                if(accelerate){
                    acceleration = .0002;
                }
                else{
                    acceleration = 0;
                }
            }

            if (ctr*1000*acceleration > 80) {
                guiVars.fuel--;
                guiVars.fuelGUI.text = `Fuel: ${guiVars.fuel}%`;
                if (guiVars.fuel < 16) {
                    guiVars.fuelWarning();
                }
                ctr = 0;
            }
        }
        const direction = camera.getForwardRay().direction.scale(acceleration);
        velocity = velocity.add(direction);
        camera.position = camera.position.add(velocity);
        camera.rotationQuaternion = Quaternion.RotationYawPitchRoll(rotationVelocity.yaw, rotationVelocity.pitch, rotationVelocity.roll);

        guiVars.axes = camera.rotation;
        guiVars.rollGUI.text = `Roll: ${(rotationVelocity._rollfactor*1000).toFixed(2)}`;  
        guiVars.pitchGUI.text = `Pitch: ${(rotationVelocity._pitchfactor*1000).toFixed(2)}`;
        guiVars.yawGUI.text = `Yaw: ${(rotationVelocity._yawfactor*1000).toFixed(2)}`; 


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
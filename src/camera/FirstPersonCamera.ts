import { Quaternion, Vector3 } from 'three';
import { clamp } from 'three/src/math/MathUtils';

import { InputController } from '../input/InputController';
import { Config } from '../utils/config';
import { CameraCore } from './CameraCore';

// This class handles the simulating movement of the camera from a first person perspective.
export class FirstPersonCamera {

  cameraCore: CameraCore;
  inputController: InputController;
  rotation: Quaternion;
  translation: Vector3;
  phi: number;
  phiSpeed: number;
  theta: number;
  thetaSpeed: number;
  headBobActive: boolean;
  headBobTimer: number;
  jumpActive: boolean;
  jumpVelocity: number;

  constructor(cameraCore: CameraCore, inputController: InputController) {
    // console.log('FirstPersonCamera Init');
    this.cameraCore = cameraCore;
    this.inputController = inputController;
    this.rotation = new Quaternion();
    this.translation = new Vector3(0, 1, 1);
    this.phi = 0;
    this.phiSpeed = 8;
    this.theta = 0;
    this.thetaSpeed = 5;
    this.headBobActive = false;
    this.headBobTimer = 0;
    this.jumpActive = false;
    this.jumpVelocity = 0;
    this.init();
  }

  init() {
  }

  update(deltaS: number) {
    this.updateRotation(deltaS);
    this.updateTranslation(deltaS);
    this.updateHeadBob(deltaS);
    this.updateJump(deltaS);
    this.updateCamera(deltaS);
  }

  updateCamera(deltaS: number) {
    this.cameraCore.camera.quaternion.copy(this.rotation);
    this.cameraCore.camera.position.copy(this.translation);
    this.cameraCore.camera.position.y = Config.THREEJS.PLAYER_SETTINGS.PLAYER_EYE_LEVEL;
    if (this.headBobActive) {
      this.cameraCore.camera.position.y += (Math.sin(this.headBobTimer * 20) * 0.1)
    }
    if (this.jumpActive) {
      this.cameraCore.camera.position.y += (this.jumpVelocity);
    }
  }

  updateHeadBob(deltaS: number) {
    if (this.headBobActive) {
      const wavelength = Math.PI;
      const nextStep = 1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength);
      const nextStepTime = nextStep * wavelength / 10;
      this.headBobTimer = Math.min(this.headBobTimer + deltaS, nextStepTime);
      if (this.headBobTimer === nextStepTime) {
        this.headBobActive = false;
      }
    }
  }

  updateJump(deltaS: number) {
    if (this.jumpActive) {
      this.jumpVelocity -= Config.THREEJS.PLAYER_SETTINGS.GRAVITY * deltaS;
    }
    if (this.jumpVelocity <= 0) {
      this.jumpVelocity = 0;
      this.jumpActive = false;
    }
  }

  // Update camera rotation based on mouse
  updateRotation(deltaS: number) {
    const xh = this.inputController.current.mouseXDelta / window.innerWidth;
    const yh = this.inputController.current.mouseYDelta / window.innerHeight;

    this.phi += -xh * this.phiSpeed;
    this.theta = clamp(this.theta + -yh * this.thetaSpeed, -Math.PI / 3, Math.PI / 3);

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi);
    const qz = new Quaternion();
    qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta);

    const q = new Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation.copy(q);
  }

  // Update camera position based on mouse
  updateTranslation(deltaS: number) {
    const forwardVelocity = (this.inputController.keys['w'] ? 1 : 0) + (this.inputController.keys['s'] ? -1 : 0);
    const strafeVelocity = (this.inputController.keys['a'] ? 1 : 0) + (this.inputController.keys['d'] ? -1 : 0);

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi);

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * deltaS * 10);

    const left = new Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * deltaS * 10);

    this.translation.add(forward);
    this.translation.add(left);

    if (forwardVelocity !== 0 || strafeVelocity !== 0) {
      this.headBobActive = true;
    }

    if (this.inputController.keys[' ']) {
      if (!this.jumpActive) {
        this.jumpVelocity = Config.THREEJS.PLAYER_SETTINGS.JUMP_POWER;
        this.jumpActive = true;
      }
    }
  }

}

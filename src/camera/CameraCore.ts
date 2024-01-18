import { PerspectiveCamera } from 'three';

import { Config } from '../utils/config';

// This class is the core camera class handling initial positioning and targeting.
export class CameraCore {
  camera: PerspectiveCamera;

  constructor() {
    // console.log('CameraCore Init');
    this.camera = new PerspectiveCamera(
      Config.THREEJS.CAMERA_SETTINGS.FOV,
      window.innerWidth / window.innerHeight,
      Config.THREEJS.CAMERA_SETTINGS.NEAR,
      Config.THREEJS.CAMERA_SETTINGS.FAR,
    );
    this.init();
  }

  init() {
    this.camera.position.set(
      Config.THREEJS.CAMERA_SETTINGS.POS_X,
      Config.THREEJS.CAMERA_SETTINGS.POS_Y,
      Config.THREEJS.CAMERA_SETTINGS.POS_Z,
    );
    window.addEventListener(
      'resize',
      (e: UIEvent) => this.onWindowResize(e),
      false,
    );
  }

  onWindowResize(e: UIEvent) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

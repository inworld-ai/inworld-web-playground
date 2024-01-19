import { PerspectiveCamera } from 'three';

import { Config } from '../utils/config';
import { log } from '../utils/log';

// This class is the core camera class handling initial positioning and targeting.
export class CameraCore {
  camera: PerspectiveCamera;

  constructor() {
    log('CameraCore Created');
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
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

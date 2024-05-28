import { PerspectiveCamera } from 'three';

import { Config } from '../utils/config';
import { log } from '../utils/log';

// This class is the core camera class handling initial positioning and targeting.
export class CameraCore {
  camera: PerspectiveCamera;

  constructor() {
    log('CameraCore Created');

    this.camera = new PerspectiveCamera(
      Config.Threejs.CameraSettings.FOV,
      window.innerWidth / window.innerHeight,
      Config.Threejs.CameraSettings.NEAR,
      Config.Threejs.CameraSettings.FAR,
    );

    this.camera.position.set(
      Config.Threejs.CameraSettings.POS_X,
      Config.Threejs.CameraSettings.POS_Y,
      Config.Threejs.CameraSettings.POS_Z,
    );

    this.onResizeWindow = this.onResizeWindow.bind(this);

    window.addEventListener('resize', this.onResizeWindow);
  }

  remove() {

  }

  onResizeWindow() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

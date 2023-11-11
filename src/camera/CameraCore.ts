import { PerspectiveCamera, Vector3 } from "three";
import { Config } from "../utils/config";

// This class is the core camera class handling initial positioning and targeting.
export class CameraCore {

  camera: PerspectiveCamera;

  constructor() {
    // console.log('CameraCore Init');
    this.camera = new PerspectiveCamera(
      Config.CAMERA_SETTINGS.FOV,
      window.innerWidth / window.innerHeight,
      Config.CAMERA_SETTINGS.NEAR,
      Config.CAMERA_SETTINGS.FAR
    )
    this.init();
  }

  init() {
    this.camera.position.set(
      Config.CAMERA_SETTINGS.POS_X,
      Config.CAMERA_SETTINGS.POS_Y,
      Config.CAMERA_SETTINGS.POS_Z
    );
    // this.camera.lookAt(
    //   new Vector3(
    //     Config.CAMERA_SETTINGS.TAR_X,
    //     Config.CAMERA_SETTINGS.TAR_Y,
    //     Config.CAMERA_SETTINGS.TAR_Z
    //   )
    // );
    window.addEventListener("resize", (e: UIEvent) => this.onWindowResize(e), false);
  }

  onWindowResize(e: UIEvent) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
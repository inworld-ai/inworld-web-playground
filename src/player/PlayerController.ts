import { Clock } from 'three/src/Three';

import { CameraCore } from '../camera/CameraCore';
import { FirstPersonCamera } from '../camera/FirstPersonCamera';
import { InputController } from '../input/InputController';
import { inworld, STATE_INIT } from '../inworld/Inworld';
import { SoundController } from '../sound/SoundController';
import { SOUND_FOOTSTEPS } from '../sound/SoundIDs';
import { EVENT_SYSTEM_STATE, STATE_PAUSED, STATE_RUNNING, system } from '../system/System';

export interface PlayerControllerProps {
  cameraCore: CameraCore;
  inputController: InputController;
}

class PlayerController {
  escClick: boolean;
  fpsCamera: FirstPersonCamera;
  inputController: InputController;
  // soundController: SoundController;

  constructor(props: PlayerControllerProps) {
    this.escClick = false;
    this.inputController = props.inputController;
    this.fpsCamera = new FirstPersonCamera({ cameraCore: props.cameraCore, inputController: this.inputController });
    // this.soundController = new SoundController({ camera: props.cameraCore });
    this.onSystemState = this.onSystemState.bind(this);

    system.addListener(EVENT_SYSTEM_STATE, this.onSystemState);

  }

  onFrame(delta: number) {
    this.inputController.update();
    // Check if the user pressed the escape key. If so pause the game.
    if (this.inputController.keys['Escape'] && !this.escClick) {
      // if (system.systemState === STATE_RUNNING) {
      //   system.setSystemState(STATE_PAUSED);
      // } else if (system.systemState === STATE_PAUSED) {
      //   system.setSystemState(STATE_RUNNING);
      // }
      this.escClick = true;
    }

    if (!this.inputController.keys['Escape'] && this.escClick) {
      this.escClick = false;
    }

    // Check if the game is running and no character chat is happening.
    if (true) {
      // if (system.systemState === STATE_RUNNING && inworld.state === STATE_INIT) {
      const forwardVelocity =
        (this.inputController.keys['w'] ? 1 : 0) +
        (this.inputController.keys['s'] ? -1 : 0);
      const strafeVelocity =
        (this.inputController.keys['a'] ? 1 : 0) +
        (this.inputController.keys['d'] ? -1 : 0);
      // Check if the character is running. If so play sound effect.
      // if (this.soundController && (forwardVelocity !== 0 || strafeVelocity !== 0)) {
      //   this.soundController?.play(SOUND_FOOTSTEPS);
      // } else {
      //   this.soundController?.pause(SOUND_FOOTSTEPS);
      // }
      // Update the fps camera.
      if (this.fpsCamera) {
        this.fpsCamera.update(delta);
      }
    }

  }

  onSystemState(state: string) {
    // if (state === STATE_RUNNING) {
    //   this.soundController.enable();
    // } else {
    //   this.soundController.disable();
    // }
  }

}
export default PlayerController;

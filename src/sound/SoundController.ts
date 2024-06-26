import { AudioListener } from 'three';

import { CameraCore } from '../camera/CameraCore';
import { log } from '../utils/log';
import { SOUND_FOOTSTEPS, SOUND_JUMP } from './SoundIDs';
import { ISoundCore } from './sounds/ISoundCore';
import { SoundFootStep } from './sounds/SoundFootStep';
import { SoundJump } from './sounds/SoundJump';

interface SoundControllerProps {
  camera: CameraCore;
}

enum SoundState {
  ON,
  OFF,
}

enum SoundControllerState {
  DISABLED,
  ENABLED,
}

type SoundItem = {
  state: SoundState;
  sound: ISoundCore;
};

export class SoundController {
  audioListener: AudioListener;
  soundTuner: { [key: string]: SoundItem };
  state: SoundControllerState;

  constructor(props: SoundControllerProps) {
    this.audioListener = new AudioListener();
    props.camera.camera.add(this.audioListener);
    this.soundTuner = {};
    this.state = SoundControllerState.DISABLED;
    this.soundTuner[SOUND_FOOTSTEPS] = {
      state: SoundState.OFF,
      sound: new SoundFootStep(this.audioListener),
    };
    this.soundTuner[SOUND_JUMP] = {
      state: SoundState.OFF,
      sound: new SoundJump(this.audioListener),
    };
  }

  disable() {
    if (this.state === SoundControllerState.DISABLED) return;
    const sounds: string[] = Object.keys(this.soundTuner);
    this.state = SoundControllerState.DISABLED;
    for (let i = 0; i < sounds.length; i++) {
      this.soundTuner[sounds[i]].sound.pause();
    }
  }

  enable() {
    if (this.state === SoundControllerState.ENABLED) return;
    const sounds: string[] = Object.keys(this.soundTuner);
    this.state = SoundControllerState.ENABLED;
    for (let i = 0; i < sounds.length; i++) {
      if (this.soundTuner[sounds[i]].state === SoundState.ON) {
        this.soundTuner[sounds[i]].sound.play();
      }
    }
  }

  pause(sound: string) {
    if (this.state === SoundControllerState.ENABLED) {
      if (!this.soundTuner[sound])
        throw new Error(`SoundController pause sound not found ${sound}`);
      if (this.soundTuner[sound].state === SoundState.OFF) return;
      this.soundTuner[sound].state = SoundState.OFF;
      this.soundTuner[sound].sound.pause();
    }
  }

  play(sound: string) {
    if (this.state === SoundControllerState.ENABLED) {
      if (!this.soundTuner[sound])
        throw new Error(`SoundController play sound not found ${sound}`);
      if (this.soundTuner[sound].state === SoundState.ON) return;
      this.soundTuner[sound].state = SoundState.ON;
      this.soundTuner[sound].sound.play();
    }
  }

  stop(sound: string) {
    if (this.state === SoundControllerState.ENABLED) {
      if (!this.soundTuner[sound])
        throw new Error(`SoundController stop sound not found ${sound}`);
      if (this.soundTuner[sound].state === SoundState.OFF) return;
      this.soundTuner[sound].state = SoundState.OFF;
      this.soundTuner[sound].sound.stop();
    }
  }
}

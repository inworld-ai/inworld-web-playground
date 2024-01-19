import { Audio, AudioListener, AudioLoader } from 'three';

import { log } from '../../utils/log';
import { ISoundCore } from './ISoundCore';

const SOUND_FILE_URI =
  '/assets/v1.0/sounds/FootstepSFX/Concrete_Shoes_Running.wav';

export class SoundFootStep implements ISoundCore {
  sound: Audio;
  isReady: boolean;

  constructor(listener: AudioListener) {
    this.sound = new Audio(listener);
    this.isReady = false;
    this.init();
  }

  init() {
    const audioLoader = new AudioLoader();

    audioLoader.load(
      SOUND_FILE_URI,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(0.5);
      },
      (xhr) => {
        // onProgress callback
        log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (err) => {
        // onError callback
        log('An error happened', err);
      },
    );
  }

  pause() {
    this.sound.pause();
  }

  play() {
    this.sound.play();
  }

  stop() {
    this.sound.stop();
  }
}

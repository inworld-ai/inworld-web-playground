import { Audio, AudioListener, AudioLoader } from 'three';

import { model } from '../../model/Model';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';
import { ISoundCore } from './ISoundCore';

export class SoundJump implements ISoundCore {
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
      Config.AssetBaseURI + model.soundsData["SoundAmbient"],
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setVolume(0.5);
      },
      (xhr) => {
        // onProgress callback
        // log('SoundJump', Math.round(xhr.loaded / xhr.total * 100) + '% loaded');
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

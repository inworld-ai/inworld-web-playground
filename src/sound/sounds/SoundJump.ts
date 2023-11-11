import { Audio, AudioListener, AudioLoader } from "three";
import { ISoundCore } from "./ISoundCore";

const SOUND_FILE_URI: string = "/assets/sounds/jumping/jumping.wav";

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
      SOUND_FILE_URI,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setVolume(0.5);
      },
      (xhr) => { // onProgress callback
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (err) => { // onError callback
        console.log('An error happened');
      }
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
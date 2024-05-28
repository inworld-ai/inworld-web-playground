
import { GLTFModelLoader } from '@inworld/web-threejs/build/src/loaders/GLTFModelLoader';

import EventDispatcher from '../events/EventDispatcher';
import { FileLoader } from '../loaders/FileLoader';
import { JSONFileLoader } from '../loaders/JSONFileLoader';
import { Config } from '../utils/config';
import { log } from '../utils/log';

export const EVENT_COMPLETE = "event_complete";
export const EVENT_LOADING = "event_loading";
export const EVENT_PROGRESS = "event_progress";

const STATE_INIT: string = "state_init";

export type CallbacksType = {
  [key: string]: Function;
}

export type ProgressType = {
  progress: number;
}

// A class that preloads all the media and data assets used in the video game.
class Resources extends EventDispatcher {

  callbacks: CallbacksType;
  isLoaded: boolean;
  loadCount: number;
  totalCount: number;

  constructor() {

    log('---> Resources Init');

    super();

    this.loadCount = 0;
    this.totalCount = 0;
    this.callbacks = {};
    this.isLoaded = false;
    this.decrementCount = this.decrementCount.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoadImage = this.onLoadImage.bind(this);
    this.onLoadJSON = this.onLoadJSON.bind(this);
    this.onLoadModel = this.onLoadModel.bind(this);
    this.onError = this.onError.bind(this);

  }

  decrementCount() {
    this.loadCount--;
    const progress: number = Math.round((this.totalCount - this.loadCount) / this.totalCount * 100);
    this.dispatch(EVENT_PROGRESS, { progress } as ProgressType);
    if (this.loadCount === 0) {
      this.totalCount = 0;
      this.dispatch(EVENT_COMPLETE);
    }
  }

  incrementCount() {
    this.loadCount++;
    this.totalCount++;
  }

  loadFile(fileURI: string) {
    this.incrementCount();
    const loader = new FileLoader({ name: fileURI, fileURI });
    loader.load(this.onLoad, this.onError);
  }

  loadJSON(fileURI: string, callback?: Function) {
    this.incrementCount();
    const loader = new JSONFileLoader({ name: fileURI, fileURI: fileURI });
    if (callback) {
      this.callbacks[fileURI] = callback;
    }
    loader.load(this.onLoadJSON, this.onError);
  }

  // TODO Currently not implemented correctly
  loadModel(fileURI: string, callback?: Function) {
    this.incrementCount();
    const loader = new GLTFModelLoader({
      path: fileURI,
      dracoPath: Config.Threejs.DracoCompressionURI,
    });
    if (callback) {
      this.callbacks[fileURI] = callback;
    }
    loader.load(this.onLoad);
    return loader;
  }

  get loaded(): boolean {
    return (this.loadCount === 0) ? true : false;
  }

  onError(event: any) {
    console.error('Resources load error', event);
  }

  onLoad() {
    this.decrementCount();
  }

  // TODO Currently not implemented correctly
  onLoadModel(path: string) {
    if (this.callbacks[path]) {
      this.callbacks[path]();
      this.callbacks[path] = () => { };
    }
    this.decrementCount();
  }

  onLoadImage() {
    this.decrementCount();
  }

  onLoadJSON(name: string, data: JSON) {
    if (this.callbacks[name]) {
      this.callbacks[name](data);
      this.callbacks[name] = () => { };
    }
    this.decrementCount();
  }

}

export const resources = new Resources();

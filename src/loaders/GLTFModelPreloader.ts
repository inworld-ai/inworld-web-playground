/* eslint-disable */
import { Mesh } from 'three';
import { DRACOLoader, GLTF, GLTFLoader } from 'three-stdlib';

import { log } from '../utils/log';
import { IFileLoader } from './IFileLoader';

export interface GLTFModelPreloaderProps {
  path: string;
  dracoPath?: string;
}

export default class GLTFModelPreloader implements IFileLoader {
  path: string;
  dracoLoader?: DRACOLoader;
  loader: GLTFLoader;
  callback?: Function;
  isLoaded: Boolean = false;
  model?: GLTF;

  constructor(props: GLTFModelPreloaderProps) {
    this.path = props.path;
    this.loader = new GLTFLoader();
    if (props.dracoPath) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(props.dracoPath);
      this.loader.setDRACOLoader(this.dracoLoader);
    }
    this.onLoad = this.onLoad.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onError = this.onError.bind(this);
  }

  public getGLTF(): GLTF | undefined {
    if (!this.model) {
      throw new Error('GLTFModelPreloader model not loaded');
    }
    return this.model;
  }

  public load(callback: Function) {
    log('GLTFModelPreloader load');
    this.callback = callback;
    this.loader.load(this.path, this.onLoad, this.onUpdate, this.onError);
  }

  private onError(error: ErrorEvent) {
    log('GLTFModelPreloader onError', error);
    throw new Error('Error loading file ' + this.path + ' ' + error);
  }

  private onLoad(model: GLTF) {
    log('GLTFModelPreloader onLoad');
    this.model = model;
    this.model.scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    this.isLoaded = true;
    this.callback!();
  }

  private onUpdate(event: ProgressEvent) {
    // log('GLTFModelPreloader onUpdate', event);
  }
}

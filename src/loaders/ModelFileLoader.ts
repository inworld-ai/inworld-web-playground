import { Mesh, Object3D, Object3DEventMap } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';

export class ModelFileLoader {
  path: string;
  loader: GLTFLoader;
  callback?: Function;
  isLoaded: Boolean = false;
  model?: GLTF;

  constructor(path: string) {
    this.path = path;
    this.loader = new GLTFLoader();
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
  }

  public getModel(): Object3D<Object3DEventMap> | undefined {
    return this.model?.scene.children[0];
  }

  public load(callback: Function) {
    this.callback = callback;
    this.loader.load(this.path, this.onLoad, undefined, this.onError);
  }

  private onError(error: ErrorEvent) {
    throw new Error('Error loading file ' + this.path + ' ' + error);
  }

  private onLoad(model: GLTF) {
    this.model = model;
    this.model.scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    this.model.scene.children[0].castShadow = true;
    this.model.scene.children[0].receiveShadow = true;
    this.isLoaded = true;
    this.callback!();
  }
}

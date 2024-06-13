import { Group, Object3D, Object3DEventMap } from 'three';
import { GLTF } from 'three-stdlib';

import GLTFModelPreloader from '../../loaders/GLTFModelPreloader';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';

export type RoomHallProps = {
  id: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MESH_NAME = "ShowcaseBlock";
export const MODEL_URI = "/models/room_block_hall.glb";

export class RoomHall {

  id: string;
  isLoaded: boolean;
  modelFile: GLTFModelPreloader | undefined;
  onLoad: () => void;
  onProgress: (progress: number) => void;

  constructor(props: RoomHallProps) {
    this.isLoaded = false;
    this.id = props.id;
    this.onLoad = props.onLoad;
    this.onProgress = props.onProgress;
    this.onLoadComplete = this.onLoadComplete.bind(this);
    this.onLoadProgress = this.onLoadProgress.bind(this);
    this.load();
  }

  getGLTF(): GLTF | undefined {
    if (this.modelFile && this.modelFile.getGLTF()) {
      return this.modelFile.getGLTF();
    }
    return;
  }

  getObject(): Object3D<Object3DEventMap> {
    if (!this.getScene()?.getObjectByName(MESH_NAME))
      throw new Error("Error: RoomHall getObject object not found:",);
    return this.getGLTF()?.scene.getObjectByName(MESH_NAME)!;
  }

  getScene(): Group<Object3DEventMap> | undefined {
    if (this.getGLTF()) {
      return this.getGLTF()?.scene;
    }
    return;
  }

  load() {
    const fileURI: string = Config.AssetBaseURI + MODEL_URI;
    this.modelFile = new GLTFModelPreloader({
      path: fileURI,
      dracoPath: Config.Threejs.DracoCompressionURI,
    });
    this.modelFile.load(this.onLoadComplete);
  }

  onLoadComplete() {
    console.log('RoomHall - Loaded.');
    this.isLoaded = true;
    this.onLoad();
  }

  onLoadProgress(progress: number) {
    console.log('-----> RoomHall Loading Progress:', progress);
    this.onProgress(progress);
  }
}

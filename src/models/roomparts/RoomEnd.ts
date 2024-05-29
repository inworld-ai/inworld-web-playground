import { Group, Object3D, Object3DEventMap } from 'three';
import { GLTF } from 'three-stdlib';

import { GLTFModelLoader } from '../../loaders/GLTFModelLoader';
import { resources } from '../../resources/Resources';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';

export type RoomEndProps = {
  id: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MESH_NAME = "TeleportBlock";
export const MODEL_URI = "/models/room_block_end.glb";

export class RoomEnd {

  id: string;
  isLoaded: boolean;
  modelFile: GLTFModelLoader | undefined;
  onLoad: () => void;
  onProgress: (progress: number) => void;

  constructor(props: RoomEndProps) {
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
      throw new Error("Error: RoomEnd getObject object not found:",);
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
    // this.modelFile = resources.loadModel(fileURI, this.onLoadComplete)
    this.modelFile = new GLTFModelLoader({
      path: fileURI,
      dracoPath: Config.Threejs.DracoCompressionURI,
    });
    this.modelFile.load(this.onLoadComplete);
  }

  onLoadComplete() {
    console.log('RoomEnd - Loaded.');
    this.isLoaded = true;
    this.onLoad();
  }

  onLoadProgress(progress: number) {
    console.log('-----> RoomEnd Loading Progress:', progress);
    this.onProgress(progress);
  }
}

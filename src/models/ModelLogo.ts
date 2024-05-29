import { Group, Mesh, Object3D, Object3DEventMap } from 'three';
import { GLTF } from 'three-stdlib';
import { SRGBColorSpace } from 'three/src/constants';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { VideoTexture } from 'three/src/textures/VideoTexture';

import { GLTFModelLoader } from '../loaders/GLTFModelLoader';
import { Config } from '../utils/config';
import { log } from '../utils/log';

export type ModelLogoProps = {
  id: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MESH_NAME = "Logo";
export const MODEL_URI = "/models/logo.glb";
export const VIDEO_URI = "/videos/sample.mp4";

export default class ModelLogo {

  id: string;
  isLoaded: boolean;
  modelFile: GLTFModelLoader | undefined;
  modelMaterial: MeshBasicMaterial;
  onLoad: () => void;
  onProgress: (progress: number) => void;
  videoElement: HTMLVideoElement;
  videoTexture: VideoTexture;

  constructor(props: ModelLogoProps) {
    log('ModelLogo - constructor.');
    this.isLoaded = false;
    this.id = props.id;

    this.onLoad = props.onLoad;
    this.onProgress = props.onProgress;

    this.videoElement = document.createElement('video');
    this.videoElement.src = Config.AssetBaseURI + VIDEO_URI;
    this.videoElement.crossOrigin = 'Anonymous';
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.play();

    this.videoTexture = new VideoTexture(this.videoElement);
    this.videoTexture.colorSpace = SRGBColorSpace;

    this.modelMaterial = new MeshBasicMaterial({ toneMapped: false });
    this.modelMaterial.map = this.videoTexture;

    this.onLoadComplete = this.onLoadComplete.bind(this);
    this.onLoadProgress = this.onLoadProgress.bind(this);
    this.load();
  }

  getGLTF(): GLTF | undefined {
    if (this.modelFile && this.modelFile.getGLTF()) {
      return this.modelFile.getGLTF() as GLTF;
    }
    return;
  }

  getObject(): Object3D<Object3DEventMap> {
    if (!this.getScene()?.getObjectByName(MESH_NAME))
      throw new Error("Error: ModelLogo getObject object not found:",);
    return this.getGLTF()?.scene.getObjectByName(MESH_NAME)!;
  }

  getScene(): Group<Object3DEventMap> | undefined {
    if (this.getGLTF()) {
      return this.getGLTF()?.scene;
    }
    return;
  }

  load() {
    log('ModelLogo - Load.');
    const fileURI: string = Config.AssetBaseURI + MODEL_URI;
    this.modelFile = new GLTFModelLoader({
      path: fileURI,
      dracoPath: Config.Threejs.DracoCompressionURI,
    });
    this.modelFile.load(this.onLoadComplete);
  }

  onLoadComplete() {
    log('ModelLogo - Loaded.');
    (this.getGLTF()?.scene.getObjectByName(MESH_NAME)! as Mesh).material = this.modelMaterial;
    this.isLoaded = true;
    this.onLoad();
  }

  onLoadProgress(progress: number) {
    log('-----> ModelLogo Loading Progress:', progress);
    this.onProgress(progress);
  }
}

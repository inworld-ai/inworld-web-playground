import { Group, Object3DEventMap } from 'three';
import { GLTF } from 'three-stdlib';
import { Object3D } from 'three/src/core/Object3D';

import { GLTFModelLoader } from '../../loaders/GLTFModelLoader';
import { Textbox } from '../../ui/text/Textbox';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';

export type RoomPortalProps = {
  id: string;
  label?: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MESH_NAME = "Objects";
export const MODEL_URI = "/models/room_portal.glb";

export class RoomPortal {

  group: Group;
  id: string;
  isLoaded: boolean;
  labelTitle: Textbox;
  modelFile: GLTFModelLoader | undefined;
  onLoad: () => void;
  onProgress: (progress: number) => void;

  constructor(props: RoomPortalProps) {
    this.isLoaded = false;
    this.group = new Group();
    this.id = props.id;
    this.labelTitle = new Textbox({ label: props.label || '', font: "Arial", fontSize: 30, color: "white", width: 600, height: 100 });
    this.onLoad = props.onLoad;
    this.onProgress = props.onProgress;
    this.onLoadComplete = this.onLoadComplete.bind(this);
    this.onLoadProgress = this.onLoadProgress.bind(this);
    this.load();
  }

  get portal(): Group {
    return this.group;
  }

  // getGLTF(): GLTF | undefined {
  //   if (this.modelFile && this.modelFile.getGLTF()) {
  //     return this.modelFile.getGLTF();
  //   }
  //   return;
  // }

  // getObject(): Object3D<Object3DEventMap> {
  //   if (!this.getScene()?.getObjectByName(MESH_NAME))
  //     throw new Error("Error: RoomHall getObject object not found:",);
  //   return this.getGLTF()?.scene.getObjectByName(MESH_NAME)!;
  // }

  // getScene(): Group<Object3DEventMap> | undefined {
  //   if (this.getGLTF()) {
  //     return this.getGLTF()?.scene;
  //   }
  //   return;
  // }

  load() {
    const fileURI: string = Config.AssetBaseURI + MODEL_URI;
    this.modelFile = new GLTFModelLoader({
      path: fileURI,
      dracoPath: Config.Threejs.DracoCompressionURI,
    });
    this.modelFile.load(this.onLoadComplete);
  }

  onLoadComplete() {
    console.log('RoomPortal - Loaded.');
    if (this.modelFile && this.modelFile.getGLTF()) {
      const model = this.modelFile.getGLTF()!.scene.getObjectByName(MESH_NAME);
      if (!model) throw new Error("Model not found");
      model.position.set(0, 0, 0);
      model.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
      this.group.add(model);
      this.labelTitle.mesh.position.set(2.3, 0, 0);
      this.group.add(this.labelTitle.mesh);
    }
    this.isLoaded = true;
    this.onLoad();
  }

  onLoadProgress(progress: number) {
    console.log('-----> RoomPortal Loading Progress:', progress);
    this.onProgress(progress);
  }
}

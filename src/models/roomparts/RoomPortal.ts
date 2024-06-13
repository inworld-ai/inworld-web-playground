import { Group, Object3DEventMap, Vector3 } from 'three';
import { GLTF } from 'three-stdlib';
import { Object3D } from 'three/src/core/Object3D';

import GLTFModelPreloader from '../../loaders/GLTFModelPreloader';
import { TextAlign, Textbox } from '../../ui/text/Textbox';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';
import ColidableCube from '../colidables/ColidableCube';

export type RoomPortalProps = {
  id: string;
  label?: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MESH_NAME = "Objects";
export const MODEL_URI = "/models/room_portal.glb";

export class RoomPortal {

  boundingBox: ColidableCube;
  group: Group;
  id: string;
  isLoaded: boolean;
  labelTitle: Textbox;
  modelFile: GLTFModelPreloader | undefined;
  onLoad: () => void;
  onProgress: (progress: number) => void;

  constructor(props: RoomPortalProps) {

    this.isLoaded = false;
    this.group = new Group();
    this.id = props.id;
    this.labelTitle = new Textbox({ label: props.label || '', font: "Arial", fontSize: 60, color: "white", width: 500, height: 60, align: TextAlign.Center });
    this.boundingBox = new ColidableCube({ length: 3, width: 3, height: 0.5, position: new Vector3(0, -1.7, 0) });
    this.boundingBox.show();

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
    this.modelFile = new GLTFModelPreloader({
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
      // model.position.set(0, 0, 0);
      // model.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
      // this.group.add(model);
      // this.group.add(this.boundingBox.model);
      this.labelTitle.mesh.position.set(0, 0.1, 0);
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

import { Group, Object3DEventMap, Vector3 } from 'three';
import { GLTF } from 'three-stdlib';

import GLTFModelPreloader from '../../loaders/GLTFModelPreloader';
import { Textbox } from '../../ui/text/Textbox';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';

export type RoomShowcaseProps = {
  id: string;
  labelHeader: string;
  labelDescription: string;
  onLoad: () => void;
  onProgress: (progress: number) => void;
};

export const MODEL_URI = "/models/room_showcase.glb";

export class RoomShowcase {

  group: Group;
  id: string;
  isLoaded: boolean;
  labelHeader: Textbox;
  labelDescription: Textbox;
  modelFile: GLTFModelPreloader | undefined;
  onLoad: () => void;
  onProgress: (progress: number) => void;

  constructor(props: RoomShowcaseProps) {
    this.isLoaded = false;
    this.id = props.id;
    this.group = new Group();
    this.labelHeader = new Textbox({ label: props.labelHeader, font: "Arial", fontSize: 60, color: "white", width: 600, height: 75 });
    this.labelDescription = new Textbox({ label: props.labelDescription, font: "Arial", fontSize: 30, color: "white", width: 600, height: 100 });
    this.onLoad = props.onLoad;
    this.onProgress = props.onProgress;
    this.onLoadComplete = this.onLoadComplete.bind(this);
    this.onLoadProgress = this.onLoadProgress.bind(this);
    this.load();
  }

  get showcase(): Group {
    return this.group;
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
    console.log('RoomShowcase - Loaded.');
    if (this.modelFile && this.modelFile.getGLTF()) {
      const model = this.modelFile.getGLTF()!.scene.getObjectByName("ShowcaseBlock");
      if (!model) throw new Error("Model not found");
      this.group.add(model);
      this.labelHeader.mesh.position.set(1.6, 3, -0.5);
      this.labelHeader.mesh.rotation.set(0, Math.PI, 0);
      this.labelDescription.mesh.position.set(1.6, 2.5, -0.5);
      this.labelDescription.mesh.rotation.set(0, Math.PI, 0);
      this.group.add(this.labelHeader.mesh);
      this.group.add(this.labelDescription.mesh);
    }
    this.isLoaded = true;
    this.onLoad();
  }

  onLoadProgress(progress: number) {
    console.log('-----> RoomShowcase Loading Progress:', progress);
    this.onProgress(progress);
  }
}

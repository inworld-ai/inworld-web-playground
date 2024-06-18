import { PointLight, Vector3 } from 'three';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { HemisphereLight } from 'three/src/lights/HemisphereLight';
import { Group } from 'three/src/objects/Group';

import ModelInnequin from '../models/ModelInnequin';
import { RoomModel } from '../models/roomparts/RoomModel';
import Portal from '../portal/Portal';
import { TextAlign, Textbox } from '../ui/text/Textbox';
import { log } from '../utils/log';
import RoomBase, { RoomBaseProps } from './RoomBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/lobby_bot_-_innequin';
export const EVENT_LOADED = 'event_loaded';
const NAME_INNEQUIN = 'InnequinMain';
const TRIGGER_WELCOME = 'greet_player';

const ROOM_TITLE = 'Playground Showcases';
const ROOM_DESCRIPTION = 'Walk into a portal to explore Inworld\'s features for Web.';

export default class RoomMain extends RoomBase {

  groupMain: Group;
  innequin: ModelInnequin;
  labelHeader: Textbox;
  labelDescription: Textbox;
  lightAmbient: AmbientLight;
  lightHemisphere: HemisphereLight;
  lightPoint1: PointLight;
  lightPoint2: PointLight;
  portalKitchen: Portal;
  roomModel: RoomModel;

  constructor(props: RoomBaseProps) {

    super();

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);

    this.groupMain = new Group();
    this.groupMain.name = "GroupMain";
    this.groupMain.position.set(props.position?.x || 0, props.position?.y || 0, props.position?.z || 0);
    this.groupMain.rotation.set(props.rotation?.x || 0, props.rotation?.y || 0, props.rotation?.z || 0);

    this.portalKitchen = new Portal({position: new Vector3(0, 2, -18)});

    this.labelHeader = new Textbox({ label: ROOM_TITLE, font: "Arial", fontSize: 100, color: "white", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelHeader.mesh.position.set(0.1, 5, -8.5);

    this.labelDescription = new Textbox({ label: ROOM_DESCRIPTION, font: "Arial", fontSize: 40, color: "white", align: TextAlign.Center, width: 1100, height: 60 });
    this.labelDescription.mesh.position.set(0.1, 4.4, -8.6);

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(0, 0.64, -4),
        setConfig: this.onLoad,
      }
    );

    this.roomModel = new RoomModel({
      id: 'roomModel',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.lightAmbient = new AmbientLight();
    this.lightHemisphere = new HemisphereLight('#fff', '#333');

    this.lightPoint1 = new PointLight(0xffffff, 200, 100);
    this.lightPoint1.position.set(0, 10, 0);

    this.lightPoint2 = new PointLight(0xffffff, 100, 100);
    this.lightPoint2.position.set(0, 5, -50);
    
  }

  getObject() {
    return this.groupMain;
  }

  onFrame(delta: number) {
    if (this.innequin.isLoaded) {
      this.innequin.frameUpdate(delta);
    }
  }

  onLoad() {
    log('RoomMain onLoad');
    if (
      this.roomModel &&
      this.roomModel.isLoaded &&
      this.innequin &&
      this.innequin.isLoaded
    ) {
      log('RoomMain Loaded');

      
      this.groupMain.add(this.roomModel.getObject());
      this.groupMain.add(this.portalKitchen.portal);
      this.groupMain.add(this.innequin.group);

      this.groupMain.add(this.labelHeader.mesh);
      this.groupMain.add(this.labelDescription.mesh);

      this.groupMain.add(this.lightAmbient);
      this.groupMain.add(this.lightHemisphere);
      this.groupMain.add(this.lightPoint1);
      this.groupMain.add(this.lightPoint2);

      this.isLoaded = true;
      this.dispatch(EVENT_LOADED);
    }
  };

  onTPInteraction() {
    console.log('onTPInteraction');
  }

  onProgress(progress: number) {
    log('RoomMain onProgress', progress);
  };

}

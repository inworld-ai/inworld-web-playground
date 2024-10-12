import { PointLight, Vector3 } from 'three';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { HemisphereLight } from 'three/src/lights/HemisphereLight';
import { Group } from 'three/src/objects/Group';

import { EVENT_INWORLD_STATE, inworld, STATE_OPEN } from '../inworld/Inworld';
import ModelInnequin from '../models/ModelInnequin';
import { RoomModel } from '../models/roomparts/RoomModel';
import { TextAlign, Textbox } from '../ui/text/Textbox';
import { log } from '../utils/log';
import GroupAnimations from './groups/GroupAnimations';
import GroupAvatars from './groups/GroupAvatars';
import GroupEmotions from './groups/GroupEmotions';
import GroupGoals from './groups/GroupGoals';
import RoomBase, { RoomBaseProps } from './RoomBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/lobby_bot_-_innequin';
export const EVENT_LOADED = 'event_loaded';
const NAME_INNEQUIN = 'InnequinMain';

const ROOM_LABEL_TITLE = 'Playground Showcases';
const ROOM_LABEL_DESCRIPTION = 'Walk into a portal to explore Inworld\'s features for Web.';
const ROOM_LABEL_ANIMATIONS = 'Animations';
const ROOM_LABEL_AVATARS = 'Avatars';
const ROOM_LABEL_EMOTIONS = 'Emotions';
const ROOM_LABEL_GOALS = 'Goals';
export const TRIGGER_WELCOME = 'greet_player';

export default class RoomMain extends RoomBase {

  groupMain: Group;
  innequin: ModelInnequin;
  labelHeader: Textbox;
  labelDescription: Textbox;
  labelRoomAnimations: Textbox;
  labelRoomAvatars: Textbox;
  labelRoomEmotions: Textbox;
  labelRoomGoals: Textbox;
  lightAmbient: AmbientLight;
  lightHemisphere: HemisphereLight;
  lightPoint1: PointLight;
  lightPoint2: PointLight;
  roomAnimations: GroupAnimations;
  roomAvatars: GroupAvatars;
  roomEmotions: GroupEmotions;
  roomGoals: GroupGoals;
  roomModel: RoomModel;

  constructor(props: RoomBaseProps) {

    super();

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onStateInworld = this.onStateInworld.bind(this);

    this.groupMain = new Group();
    this.groupMain.name = "GroupMain";
    this.groupMain.position.set(props.position?.x || 0, props.position?.y || 0, props.position?.z || 0);
    this.groupMain.rotation.set(props.rotation?.x || 0, props.rotation?.y || 0, props.rotation?.z || 0);

    this.labelHeader = new Textbox({ label: ROOM_LABEL_TITLE, font: "Arial", fontSize: 100, color: "white", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelHeader.mesh.position.set(0, 5, -8.5);

    this.labelDescription = new Textbox({ label: ROOM_LABEL_DESCRIPTION, font: "Arial", fontSize: 40, color: "white", align: TextAlign.Center, width: 1100, height: 60 });
    this.labelDescription.mesh.position.set(0, 4.4, -8.6);
    
    this.labelRoomAnimations = new Textbox({ label: ROOM_LABEL_ANIMATIONS, font: "Arial", fontSize: 100, color: "black", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelRoomAnimations.mesh.position.set(0, 5, -29);
    
    this.labelRoomAvatars = new Textbox({ label: ROOM_LABEL_AVATARS, font: "Arial", fontSize: 100, color: "black", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelRoomAvatars.mesh.position.set(29 * Math.cos(45 * Math.PI / 180), 5, -29 * Math.sin(45 * Math.PI / 180));
    this.labelRoomAvatars.mesh.rotation.set(0, -Math.PI/180 * 45, 0);

    this.labelRoomEmotions = new Textbox({ label: ROOM_LABEL_EMOTIONS, font: "Arial", fontSize: 100, color: "black", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelRoomEmotions.mesh.position.set(29, 5, 0);
    this.labelRoomEmotions.mesh.rotation.set(0, -Math.PI/180 * 90, 0);

    this.labelRoomGoals = new Textbox({ label: ROOM_LABEL_GOALS, font: "Arial", fontSize: 100, color: "black", align: TextAlign.Center, width: 1100, height: 125 });
    this.labelRoomGoals.mesh.position.set(29 * Math.cos(45 * Math.PI / 180), 5, 29 * Math.sin(45 * Math.PI / 180));
    this.labelRoomGoals.mesh.rotation.set(0, -Math.PI/180 * 135, 0);

    this.innequin = new ModelInnequin({
      name: NAME_INNEQUIN,
      characterId: CHARACTER_ID,
      isLoaded: true,
      position: new Vector3(0, 0, -4),
      setConfig: this.onLoad,
    });

    this.roomModel = new RoomModel({
      id: 'roomModel',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.roomAnimations = new GroupAnimations({
      position: new Vector3(0, 0, -36),
      onLoad: this.onLoad,
    });

    this.roomAvatars = new GroupAvatars({
      position: new Vector3(36 * Math.cos(45 * Math.PI / 180), 0, -36 * Math.sin(45 * Math.PI / 180)),
      rotation: new Vector3(0, -Math.PI/180 * 45, 0),
      onLoad: this.onLoad,
    });

    this.roomEmotions = new GroupEmotions({
      position: new Vector3(36, 0, 0),
      rotation: new Vector3(0, -Math.PI/180 * 90, 0),
      onLoad: this.onLoad,
    })

    this.roomGoals = new GroupGoals({
      position: new Vector3(36 * Math.cos(45 * Math.PI / 180), 0, 36 * Math.sin(45 * Math.PI / 180)),
      rotation: new Vector3(0, -Math.PI/180 * 135, 0),
      onLoad: this.onLoad,
    })


    inworld.addListener(EVENT_INWORLD_STATE, this.onStateInworld);

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
    if (this.roomAnimations.isLoaded) {
      this.roomAnimations.onFrame(delta);
    }
    if (this.roomAvatars.isLoaded) {
      this.roomAvatars.onFrame(delta);
    }
    if (this.roomEmotions.isLoaded) {
      this.roomEmotions.onFrame(delta);
    }
    if (this.roomGoals.isLoaded) {
      this.roomGoals  .onFrame(delta);
    }
  }

  onLoad() {
    
    log(
      'RoomMain onLoad', 
      this.roomModel.isLoaded, 
      this.innequin.isLoaded, 
      this.roomAnimations.isLoaded, 
      this.roomAvatars.isLoaded, 
      this.roomEmotions.isLoaded, 
      this.roomGoals.isLoaded
    );
    
    if (
      this.roomModel &&
      this.roomModel.isLoaded &&
      this.innequin &&
      this.innequin.isLoaded &&
      this.roomAnimations && 
      this.roomAnimations.isLoaded &&
      this.roomAvatars && 
      this.roomAvatars.isLoaded &&
      this.roomEmotions && 
      this.roomEmotions.isLoaded &&
      this.roomGoals && 
      this.roomGoals.isLoaded
    ) {
      log('RoomMain Loaded');

      this.groupMain.add(this.roomModel.getObject());
      this.groupMain.add(this.innequin.group);
      this.groupMain.add(this.roomAnimations.group);
      this.groupMain.add(this.roomAvatars.group);
      this.groupMain.add(this.roomEmotions.group);
      this.groupMain.add(this.roomGoals.group);

      this.groupMain.add(this.labelHeader.mesh);
      this.groupMain.add(this.labelDescription.mesh);
      this.groupMain.add(this.labelRoomAnimations.mesh);
      this.groupMain.add(this.labelRoomAvatars.mesh);
      this.groupMain.add(this.labelRoomEmotions.mesh);
      this.groupMain.add(this.labelRoomGoals.mesh);

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

  onStateInworld(state: string) {
    if ((inworld.name === NAME_INNEQUIN) 
      && state === STATE_OPEN) {
        inworld.sendTrigger(TRIGGER_WELCOME);
    }
  }
}

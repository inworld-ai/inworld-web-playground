import { Vector3 } from 'three';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { HemisphereLight } from 'three/src/lights/HemisphereLight';
import { Group } from 'three/src/objects/Group';

import EventDispatcher from '../events/EventDispatcher';
import ModelInnequin from '../models/ModelInnequin';
import { RoomEnd } from '../models/roomparts/RoomEnd';
import { RoomHall } from '../models/roomparts/RoomHall';
import { RoomPortal } from '../models/roomparts/RoomPortal';
import { Textbox } from '../ui/text/Textbox';
import { log } from '../utils/log';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/lobby_bot_-_innequin';
export const EVENT_LOADED = 'event_loaded';
const NAME_INNEQUIN = 'InnequinLobby';
const TRIGGER_WELCOME = 'greet_player';

const ROOM_TITLE = 'Playground Showcases';
const ROOM_DESCRIPTION = 'Walk into a portal to explore Inworld\'s features for Web.';

export default class RoomLobby extends EventDispatcher {

  groupLobby: Group;
  innequin: ModelInnequin;
  labelHeader: Textbox;
  labelDescription: Textbox;
  lightAmbient: AmbientLight;
  lightHemisphere: HemisphereLight;
  roomEnd1: RoomEnd;
  roomEnd2: RoomEnd;
  roomHall1: RoomHall;
  roomHall2: RoomHall;
  roomHall3: RoomHall;
  roomPortalInteraction: RoomPortal;
  roomPortalGoals: RoomPortal;
  roomPortalMutations: RoomPortal;
  roomPortalEmotions: RoomPortal;
  roomPortalAvatars: RoomPortal;
  roomPortalScene: RoomPortal;
  roomPortalEnvironment: RoomPortal;

  constructor() {

    super();

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);

    this.groupLobby = new Group();
    this.groupLobby.name = "GroupLobby";
    this.groupLobby.position.set(0, 0, 0);
    this.groupLobby.rotation.set(0, 0, 0);

    this.labelHeader = new Textbox({ label: ROOM_TITLE, font: "Arial", fontSize: 60, color: "white", width: 650, height: 100 });
    this.labelDescription = new Textbox({ label: ROOM_DESCRIPTION, font: "Arial", fontSize: 20, color: "white", width: 600, height: 400 });

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(0, 0, -5),
        setConfig: this.onLoad,
      }
    );

    this.roomHall1 = new RoomHall({
      id: 'hall1',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomHall2 = new RoomHall({
      id: 'hall2',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomHall3 = new RoomHall({
      id: 'hall3',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomEnd1 = new RoomEnd({
      id: 'end1',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomEnd2 = new RoomEnd({
      id: 'end2',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.roomPortalInteraction = new RoomPortal({
      id: 'roomPortalInteraction',
      label: 'Interactions',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalGoals = new RoomPortal({
      id: 'roomPortalGoals',
      label: 'Goals',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalMutations = new RoomPortal({
      id: 'roomPortalMutations',
      label: 'Mutations',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalEmotions = new RoomPortal({
      id: 'roomPortalEmotions',
      label: 'Emotions',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalAvatars = new RoomPortal({
      id: 'roomPortalAvatars',
      label: 'Avatars',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalScene = new RoomPortal({
      id: 'roomPortalScene',
      label: 'Scene',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomPortalEnvironment = new RoomPortal({
      id: 'roomPortalEnvironment',
      label: 'Environment',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.lightAmbient = new AmbientLight();
    this.lightHemisphere = new HemisphereLight('#fff', '#333');

  }

  getObject() {
    return this.groupLobby;
  }

  onFrame(delta: number) {
    if (this.innequin.isLoaded) {
      this.innequin.frameUpdate(delta);
    }
  }

  onLoad() {
    log('RoomLobby onLoad', this.innequin.isLoaded);
    if (
      this.roomHall1 &&
      this.roomHall1.isLoaded &&
      this.roomHall2 &&
      this.roomHall2.isLoaded &&
      this.roomHall3 &&
      this.roomHall3.isLoaded &&
      this.roomEnd1 &&
      this.roomEnd1.isLoaded &&
      this.roomEnd2 &&
      this.roomEnd2.isLoaded &&
      this.roomPortalInteraction &&
      this.roomPortalInteraction.isLoaded &&
      this.roomPortalGoals &&
      this.roomPortalGoals.isLoaded &&
      this.roomPortalMutations &&
      this.roomPortalMutations.isLoaded &&
      this.roomPortalEmotions &&
      this.roomPortalEmotions.isLoaded &&
      this.roomPortalAvatars &&
      this.roomPortalAvatars.isLoaded &&
      this.roomPortalScene &&
      this.roomPortalScene.isLoaded &&
      this.roomPortalEnvironment &&
      this.roomPortalEnvironment.isLoaded &&
      this.innequin &&
      this.innequin.isLoaded
    ) {
      log('RoomLobby Loaded');
      this.roomHall2.getObject().position.set(10, 0, 0);
      this.roomHall3.getObject().position.set(-10, 0, 0);
      this.roomEnd1.getObject().position.set(-17.5, 0, 0);
      this.roomEnd2.getObject().position.set(17.5, 0, 0);
      this.roomEnd2.getObject().rotation.set(-Math.PI / 2, Math.PI, 0);

      this.groupLobby.add(this.roomHall1.getObject());
      this.groupLobby.add(this.roomHall2.getObject());
      this.groupLobby.add(this.roomHall3.getObject());
      this.groupLobby.add(this.roomEnd1.getObject());
      this.groupLobby.add(this.roomEnd2.getObject());

      this.groupLobby.add(this.innequin.group);

      const groupInteraction = new Group();
      groupInteraction.position.set(-15, 3.5, -8.5);
      const groupGoals = new Group();
      groupGoals.position.set(-10, 3.5, -8.5);
      const groupMutations = new Group();
      groupMutations.position.set(-5, 3.5, -8.5);
      const groupEmotions = new Group();
      groupEmotions.position.set(0, 3.5, -8.5);
      const groupAvatars = new Group();
      groupAvatars.position.set(5, 3.5, -8.5);
      const groupScene = new Group();
      groupScene.position.set(10, 3.5, -8.5);
      const groupEnvironment = new Group();
      groupEnvironment.position.set(15, 3.5, -8.5);


      this.labelHeader.mesh.position.set(0, 5.5, -8.5);
      this.labelDescription.mesh.position.set(0, 3, -8.5);

      groupInteraction.add(this.roomPortalInteraction.portal);
      groupGoals.add(this.roomPortalGoals.portal);
      groupMutations.add(this.roomPortalMutations.portal);
      groupEmotions.add(this.roomPortalEmotions.portal);
      groupAvatars.add(this.roomPortalAvatars.portal);
      groupScene.add(this.roomPortalScene.portal);
      groupEnvironment.add(this.roomPortalEnvironment.portal);

      this.groupLobby.add(groupInteraction);
      this.groupLobby.add(groupGoals);
      this.groupLobby.add(groupMutations);
      this.groupLobby.add(groupEmotions);
      this.groupLobby.add(groupAvatars);
      this.groupLobby.add(groupScene);
      this.groupLobby.add(groupEnvironment);

      this.groupLobby.add(this.labelHeader.mesh);
      this.groupLobby.add(this.labelDescription.mesh);
      this.groupLobby.add(this.lightAmbient);
      this.groupLobby.add(this.lightHemisphere);
      this.dispatch(EVENT_LOADED);
    }
  };

  onTPInteraction() {
    console.log('onTPInteraction');
  }

  onProgress(progress: number) {
    log('RoomLobby onProgress', progress);
  };

}

import { Vector3 } from 'three';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { HemisphereLight } from 'three/src/lights/HemisphereLight';
import { Group } from 'three/src/objects/Group';

import { RoomEnd } from '../models/roomparts/RoomEnd';
import { RoomHall } from '../models/roomparts/RoomHall';
import { RoomPortal } from '../models/roomparts/RoomPortal';
import { RoomShowcase } from '../models/roomparts/RoomShowcase';
import { log } from '../utils/log';
import RoomBase, { RoomBaseProps } from './RoomBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/lobby_bot_-_innequin';
export const EVENT_LOADED = 'event_loaded';
const NAME_INNEQUIN = 'InnequinLobby';
const TRIGGER_WELCOME = 'greet_player';

export default class RoomInteraction extends RoomBase {

  groupInteraction: Group;
  lightAmbient: AmbientLight;
  lightHemisphere: HemisphereLight;
  roomEnd1: RoomEnd;
  roomEnd2: RoomEnd;
  roomHall1: RoomHall;
  roomHall2: RoomHall;
  roomHall3: RoomHall;
  roomPortal: RoomPortal;
  roomShowcase1: RoomShowcase;
  roomShowcase2: RoomShowcase;
  roomShowcase3: RoomShowcase;

  constructor(props: RoomBaseProps) {

    super();

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);

    this.groupInteraction = new Group();
    this.groupInteraction.name = "groupInteraction";
    this.groupInteraction.position.set(props.position?.x || 0, props.position?.y || 0, props.position?.z || 0);
    this.groupInteraction.rotation.set(props.rotation?.x || 0, props.rotation?.y || 0, props.rotation?.z || 0);

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
    this.roomPortal = new RoomPortal({
      id: 'portal',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomShowcase1 = new RoomShowcase({
      id: 'showcase1',
      labelHeader: 'Showcase1',
      labelDescription: 'Showcase1 description',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomShowcase2 = new RoomShowcase({
      id: 'showcase2',
      labelHeader: 'Showcase2',
      labelDescription: 'Showcase2 description',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });
    this.roomShowcase3 = new RoomShowcase({
      id: 'showcase3',
      labelHeader: 'Showcase3',
      labelDescription: 'Showcase3 description',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.lightAmbient = new AmbientLight();
    this.lightHemisphere = new HemisphereLight('#fff', '#333');

  }

  getObject() {
    return this.groupInteraction;
  }

  onLoad() {
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
      this.roomPortal &&
      this.roomPortal.isLoaded &&
      this.roomShowcase1 &&
      this.roomShowcase1.isLoaded &&
      this.roomShowcase2 &&
      this.roomShowcase2.isLoaded &&
      this.roomShowcase3 &&
      this.roomShowcase3.isLoaded
    ) {
      log('RoomInteraction Loaded');
      this.roomHall2.getObject().position.set(10, 0, 0);
      this.roomHall3.getObject().position.set(-10, 0, 0);
      this.roomEnd1.getObject().position.set(-17.5, 0, 0);
      this.roomEnd2.getObject().position.set(17.5, 0, 0);
      this.roomEnd2.getObject().rotation.set(-Math.PI / 2, Math.PI, 0);

      this.roomShowcase1.showcase.position.set(0, 0, 9.7);
      this.roomShowcase2.showcase.position.set(0, 0, -9.7);
      this.roomShowcase2.showcase.rotation.set(0, Math.PI, 0);
      this.roomShowcase3.showcase.position.set(10, 0, -9.7);
      this.roomShowcase3.showcase.rotation.set(0, Math.PI, 0);
      this.roomPortal.portal.position.set(-17.5, 3.5, 0);
      this.roomPortal.portal.rotation.set(0, Math.PI / 2, 0);

      this.groupInteraction.add(this.roomHall1.getObject());
      this.groupInteraction.add(this.roomHall2.getObject());
      this.groupInteraction.add(this.roomHall3.getObject());
      this.groupInteraction.add(this.roomEnd1.getObject());
      this.groupInteraction.add(this.roomEnd2.getObject());
      this.groupInteraction.add(this.roomShowcase1.showcase!);
      this.groupInteraction.add(this.roomShowcase2.showcase!);
      this.groupInteraction.add(this.roomShowcase3.showcase!);
      this.groupInteraction.add(this.roomPortal.portal);
      this.groupInteraction.add(this.lightAmbient);
      this.groupInteraction.add(this.lightHemisphere);

      this.isLoaded = true;
      this.dispatch(EVENT_LOADED);
    }
  };

  onProgress(progress: number) {
    log('RoomInteraction onProgress', progress);
  };

}

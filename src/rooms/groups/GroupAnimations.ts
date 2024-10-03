import { Vector3 } from 'three';

import {
    InnequinAnimationType, InnequinConfiguration, RPMAnimationType, RPMConfiguration
} from '@inworld/web-threejs';

import ModelInnequin from '../../models/ModelInnequin';
import ModelRPM from '../../models/ModelRPM';
import { RoomMenuType, uiController } from '../../ui/UIController';
import { log } from '../../utils/log';
import GroupBase from './GroupBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/animation_bot_-_innequin';
const NAME_INNEQUIN = 'InnequinAnimations';
const NAME_RPM = 'RPMAnimations';

export interface GroupAnimationsProps {
  position?: Vector3;
  rotation?: Vector3;
  onLoad: () => void;
}

export default class GroupAnimations extends GroupBase {

  innequin: ModelInnequin;
  rpm: ModelRPM;
  isLoaded: boolean;
  onLoaded: () => void;

  constructor(props: GroupAnimationsProps) {

    super({name: 'GroupAnimations', position: props.position, rotation: props.rotation});

    this.isLoaded = false;

    this.onClick = this.onClick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoaded = props.onLoad;

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(-2, 0, -6),
        onClick: this.onClick,
        setConfig: this.onLoad,
      }
    );

    this.rpm = new ModelRPM(
      {
        name: NAME_RPM,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(2, 0, -6),
        onClick: this.onClick,
        setConfig: this.onLoad,
      }
    );

  }

  onClick(name: string) {
    console.log('RoomAnimations: onClick', name);
    if (name === NAME_INNEQUIN || name === NAME_RPM) {
      uiController.setRoomMenuType(RoomMenuType.ANIMATIONS);
    }
  }
 
  onFrame(delta: number) {
    if (this.innequin.isLoaded) {
      this.innequin.frameUpdate(delta);
    }
    if (this.rpm.isLoaded) {
      this.rpm.frameUpdate(delta);
    }
  }

  onLoad() {
    log('GroupAnimations onLoad');
    if (
      this.innequin &&
      this.innequin.isLoaded &&
      this.rpm && 
      this.rpm.isLoaded
    ) {

      log('GroupAnimations Loaded');

      this.group.add(this.innequin.group);
      this.group.add(this.rpm.group);

      this.isLoaded = true;
      this.onLoaded();

    }

  };
   
}

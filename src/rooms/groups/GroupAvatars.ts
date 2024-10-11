import { Euler, Vector3 } from 'three';

import { EVENT_INWORLD_STATE, inworld, STATE_OPEN } from '../../inworld/Inworld';
import ModelInnequin from '../../models/ModelInnequin';
import ModelRPM from '../../models/ModelRPM';
import ModelSphere from '../../models/ModelSphere';
import { log } from '../../utils/log';
import GroupBase from './GroupBase';
import { TRIGGER_WELCOME } from './GroupGoals';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/avatar_bot_-_innequin';
const NAME_INNEQUIN = 'InnequinAvatars';
const NAME_RPM = 'RPMAvatars';
const NAME_SPHERE = 'SphereAvatars';
const SKIN_INNEQUIN = 'SCIFI';

export interface GroupAvatarsProps {
  position?: Vector3;
  rotation?: Vector3;
  onLoad: () => void;
}

export default class GroupAvatars extends GroupBase {

  innequin: ModelInnequin;
  rpm: ModelRPM;
  sphere: ModelSphere;
  isLoaded: boolean;
  onLoaded: () => void;

  constructor(props: GroupAvatarsProps) {

    super({name: 'GroupAvatars', position: props.position, rotation: props.rotation});

    this.isLoaded = false;

    this.onClick = this.onClick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoaded = props.onLoad;
    this.onStateInworld = this.onStateInworld.bind(this);

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        skinName: SKIN_INNEQUIN,
        isLoaded: true,
        position: new Vector3(3, 0, -6),
        rotation: new Euler(0, -Math.PI / 8, 0),
        onClick: this.onClick,
        setConfig: this.onLoad,
      }
    );

    this.sphere = new ModelSphere(
      {
        name: NAME_SPHERE,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(0, 1, -6),
        onClick: this.onClick
      }
    )

    this.rpm = new ModelRPM(
      {
        name: NAME_RPM,
        characterId: CHARACTER_ID,
        isLoaded: true,
        position: new Vector3(-3, 0, -6),
        rotation: new Euler(0, Math.PI / 8, 0),
        onClick: this.onClick,
        setConfig: this.onLoad,
      }
    );

    inworld.addListener(EVENT_INWORLD_STATE, this.onStateInworld);

  }


  onClick(characterName: string) {
    console.log('GroupAvatars: onClick', characterName);
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
    if (
      this.innequin &&
      this.innequin.isLoaded &&
      this.sphere &&
      this.sphere.isLoaded &&
      this.rpm && 
      this.rpm.isLoaded
    ) {

      this.group.add(this.innequin.group);
      this.group.add(this.sphere.group);
      this.group.add(this.rpm.group);

      this.isLoaded = true;
      this.onLoaded();

    }

  }
   
  onStateInworld(state: string) {
    if ((inworld.name === NAME_INNEQUIN || inworld.name === NAME_SPHERE || inworld.name === NAME_RPM) 
      && state === STATE_OPEN) {
        inworld.sendTrigger(TRIGGER_WELCOME);
    }
  }

}

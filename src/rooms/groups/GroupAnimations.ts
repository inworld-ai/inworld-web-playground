import { Vector3 } from 'three';

import { EmotionBehaviorCode } from '@inworld/web-core';
import { InnequinAnimationType, RPMAnimationType } from '@inworld/web-threejs';

import { EVENT_INWORLD_STATE, inworld, STATE_OPEN } from '../../inworld/Inworld';
import ModelInnequin from '../../models/ModelInnequin';
import ModelRPM from '../../models/ModelRPM';
import { RoomTypes } from '../../types/RoomTypes';
import { RoomMenuType, uiController } from '../../ui/UIController';
import { log } from '../../utils/log';
import { camelize } from '../../utils/strings';
import GroupBase from './GroupBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/animation_bot_-_innequin';
const NAME_INNEQUIN = 'InnequinAnimations';
const NAME_RPM = 'RPMAnimations';
const TRIGGER_WELCOME = 'greet_player';

export interface GroupAnimationsProps {
  position?: Vector3;
  rotation?: Vector3;
  onLoad: () => void;
}

export default class GroupAnimations extends GroupBase {

  animationOptions: object;
  emotionCurrent: string;
  emotionOptions: object;
  innequin: ModelInnequin;
  rpm: ModelRPM;
  isLoaded: boolean;
  onLoaded: () => void;

  constructor(props: GroupAnimationsProps) {

    super({name: 'GroupAnimations', position: props.position, rotation: props.rotation});

    this.animationOptions = {};
    this.emotionCurrent = camelize(EmotionBehaviorCode.NEUTRAL);
    this.emotionOptions = {};
    this.isLoaded = false;

    this.onChangeEmotion = this.onChangeEmotion.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClickAnimation = this.onClickAnimation.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoaded = props.onLoad;
    this.onStateInworld = this.onStateInworld.bind(this);

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

    inworld.addListener(EVENT_INWORLD_STATE, this.onStateInworld);
    uiController.setRoomMenuData({type: RoomTypes.ANIMATIONS, onChangeEmotion: this.onChangeEmotion, onClickAnimation: this.onClickAnimation});

  }

  onChangeEmotion(emotion: string) {
    console.log('GroupAnimations: onChangeEmotion', emotion);
  }

  onClick(characterName: string) {
    console.log('RoomAnimations: onClick', characterName);
    if (characterName === NAME_INNEQUIN || characterName === NAME_RPM) {
      uiController.setRoomMenuType(RoomMenuType.ANIMATIONS);
      let animations: {
        [key: string]: RPMAnimationType | InnequinAnimationType;
      } = {};
      if(characterName === NAME_INNEQUIN && this.innequin.config?.innequin.animations) {
        animations = this.innequin.config?.innequin.animations;
      } else if(characterName === NAME_RPM && this.rpm.config?.rpm.animations) {
        animations = this.rpm.config?.rpm.animations;
      }
      if (animations === undefined) return;
      const keys: string[] = Object.keys(animations);
      const emotions = keys
      .map((key) => animations[key].emotion)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .map((emotion) => camelize(emotion));

      this.animationOptions = animations;
      this.emotionOptions = emotions;
      this.emotionCurrent = camelize(EmotionBehaviorCode.NEUTRAL);
      
      uiController.setRoomMenuData({type: RoomTypes.ANIMATIONS, emotionCurrent: this.emotionCurrent, animationOptions: this.animationOptions, emotionOptions: this.emotionOptions});
    }
  }
 
  onClickAnimation(animation: string) {
    if (inworld.name === NAME_INNEQUIN) {
      this.innequin.setAnimation(animation);
    } 
    if (inworld.name === NAME_RPM) {
      this.rpm.setAnimation(animation);
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
    if (
      this.innequin &&
      this.innequin.isLoaded &&
      this.rpm && 
      this.rpm.isLoaded
    ) {

      this.group.add(this.innequin.group);
      this.group.add(this.rpm.group);

      this.isLoaded = true;
      this.onLoaded();

    }

  }

  onStateInworld(state: string) {
    if ((inworld.name === NAME_INNEQUIN || inworld.name === NAME_RPM) 
      && state === STATE_OPEN) {
        inworld.sendTrigger(TRIGGER_WELCOME);
    }
  }
   
}

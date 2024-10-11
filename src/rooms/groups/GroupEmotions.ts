import { Vector3 } from 'three';

import { EmotionBehaviorCode } from '@inworld/web-core';

import { EVENT_INWORLD_STATE, inworld, STATE_OPEN } from '../../inworld/Inworld';
import ModelInnequin from '../../models/ModelInnequin';
import ModelRPM from '../../models/ModelRPM';
import { RoomTypes } from '../../types/RoomTypes';
import { RoomMenuType, uiController } from '../../ui/UIController';
import { camelize } from '../../utils/strings';
import GroupBase from './GroupBase';
import { TRIGGER_WELCOME } from './GroupGoals';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/emotion_bot';
const EMOTIONS_SUPPORTED = {
  ANGER: 'emotion_anger',
  DISGUST: 'emotion_disgust',
  JOY: 'emotion_joy',
  NEUTRAL: 'emotion_neutral',
  SADNESS: 'emotion_sadness',
  SURPRISE: 'emotion_surprise',
};
const NAME_INNEQUIN = 'InnequinEmotions';
const NAME_RPM = 'RPMEmotions';
const SKIN_INNEQUIN = 'DOTS';

export interface GroupEmotionsProps {
  position?: Vector3;
  rotation?: Vector3;
  onLoad: () => void;
}

export default class GroupEmotions extends GroupBase {

  emotionCurrent: string;
  emotionOptions: string[];
  innequin: ModelInnequin;
  rpm: ModelRPM;
  isLoaded: boolean;
  onLoaded: () => void;

  constructor(props: GroupEmotionsProps) {

    super({name: 'GroupEmotions', position: props.position, rotation: props.rotation});

    this.emotionCurrent = camelize(EmotionBehaviorCode.NEUTRAL);
    this.emotionOptions = Object.keys(EMOTIONS_SUPPORTED).map((emotion) => camelize(emotion));
    this.isLoaded = false;

    this.onClick = this.onClick.bind(this);
    this.onClickEmotion = this.onClickEmotion.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoaded = props.onLoad;
    this.onStateInworld = this.onStateInworld.bind(this);

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        skinName: SKIN_INNEQUIN,
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

    uiController.setRoomMenuData({type: RoomTypes.EMOTIONS, onClickEmotion: this.onClickEmotion, emotionOptions: this.emotionOptions});

  }

  onClick(characterName: string) {
    if (characterName === NAME_INNEQUIN || characterName === NAME_RPM) {
      uiController.setRoomMenuType(RoomMenuType.EMOTIONS);
    }
  }
 
  onClickEmotion(emotion: string) {
    if (inworld.sendTrigger) { 
      inworld.sendTrigger(
        EMOTIONS_SUPPORTED[
          emotion.toUpperCase() as keyof typeof EMOTIONS_SUPPORTED
        ].toLowerCase(),
      );
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

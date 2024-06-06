

import { Euler, Group, Object3D, Object3DEventMap, Vector3 } from 'three';

import { EmotionBehaviorCode, EmotionEvent } from '@inworld/web-core';
import { AdditionalPhonemeInfo } from '@inworld/web-core/build/proto/ai/inworld/packets/packets.pb';
import {
  Innequin, InnequinBodyEmotionToBehavior, InnequinConfiguration
} from '@inworld/web-threejs';
import { GENDER_TYPES } from '@inworld/web-threejs/build/src/types/types';

import EventDispatcher from '../events/EventDispatcher';
import {
  EVENT_EMOTION as EVENT_INWORLD_EMOTION, EVENT_PHONEMES_HISTORY, inworld, OpenConnectionType,
  STATE_INIT
} from '../inworld/Inworld';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import ClickableCube from './clickables/ClickableCube';

export interface ModelInnequinProps {
  isLoaded: boolean;
  animationCurrent?: string | undefined;
  emotionCurrent?: string | undefined;
  gender?: GENDER_TYPES | undefined;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  skinName?: string;
  setConfig?: (config: InnequinConfiguration) => void;
  onClick?: (name: string) => void;
  onChangeEmotion?: (emotion: EmotionBehaviorCode) => void;
}


export const DEFAULT_NAME = 'Innequin';
export const DEFAULT_SKIN = 'WOOD1';

export const EVENT_EMOTION = 'event_emotion';
export const EVENT_LOADED = 'event_loaded';

export default class ModelInnequin extends EventDispatcher {

  callbackClick?: (name: string) => void;
  callbackSetConfig?: (config: InnequinConfiguration) => void;
  callbackSetEmotion?: (emotion: EmotionBehaviorCode) => void;
  boundingBox: ClickableCube;
  characterId?: string;
  config?: InnequinConfiguration;
  emotion?: EmotionBehaviorCode;
  group: Group;
  innequin?: Innequin;
  isLoaded: boolean;
  name?: string;
  skinNameInitial: string;

  // const { emotionEvent, name, open, phonemes, state } = useInworld();

  constructor(props: ModelInnequinProps) {
    super();

    this.isLoaded = false;
    this.group = new Group();
    this.characterId = props.characterId;
    this.name = props.name;
    this.skinNameInitial = props.skinName || DEFAULT_SKIN;

    this.callbackClick = props.onClick;
    this.callbackSetConfig = props.setConfig;
    this.callbackSetEmotion = props.onChangeEmotion;

    this.onClick = this.onClick.bind(this);
    this.onEmotion = this.onEmotion.bind(this);
    this.onLoadInnequin = this.onLoadInnequin.bind(this);
    this.onPhonemes = this.onPhonemes.bind(this);
    this.onProgressInnequin = this.onProgressInnequin.bind(this);

    this.innequin = new Innequin({
      baseURI: Config.AssetBaseURI + '/innequin',
      configURI: Config.AssetBaseURI + (props.gender === GENDER_TYPES.FEMALE ? '/innequin/config_female.json' : '/innequin/config_male.json'),
      dracoURI: Config.Threejs.DracoCompressionURI,
      skinName: this.skinNameInitial,
      onLoad: this.onLoadInnequin,
      onProgress: this.onProgressInnequin,
    });

    this.boundingBox = new ClickableCube({ length: 0.5, width: 1.7, height: 0.5, position: new Vector3(0, 0.85, 0), onClick: this.onClick });

    inworld.addListener(EVENT_INWORLD_EMOTION, this.onEmotion);
    inworld.addListener(EVENT_PHONEMES_HISTORY, this.onPhonemes);

  }

  get model(): Group {
    return this.group;
  }

  frameUpdate(delta: number) {
    if (this.innequin) {
      this.innequin.updateFrame(delta);
    }
  }

  setAnimation(animationName: string) {
    if (this.isLoaded && this.innequin && inworld.name === this.name) {
      this.innequin.playAnimation(animationName);
    }
  }

  setEmotion(emotion: EmotionBehaviorCode) {
    if (this.isLoaded && this.innequin && inworld.name === this.name) {
      // if (this.callbackSetEmotion)
      //   this.callbackSetEmotion(emotion);
      this.innequin.setEmotion(
        EmotionBehaviorCode[
        InnequinBodyEmotionToBehavior[
        emotion.toUpperCase() as keyof typeof InnequinBodyEmotionToBehavior
        ] as keyof typeof EmotionBehaviorCode
        ],
      );
      this.dispatch(EVENT_EMOTION, emotion);
    }
  }

  setLoaded(loaded: boolean) {
    if (loaded !== this.isLoaded) {
      this.isLoaded = loaded;
      this.dispatch(EVENT_LOADED, loaded);
    }
  }

  onClick() {
    if (!inworld.open) return;
    if (inworld.state !== STATE_INIT) return;
    const options: OpenConnectionType = { name: this.name || DEFAULT_NAME };
    if (this.characterId) options.characterId = this.characterId;
    inworld.open(options);
    if (this.callbackClick && this.name) {
      this.callbackClick(this.name);
    }
    if (this.callbackSetEmotion && this.emotion) this.callbackSetEmotion(this.emotion);
  }

  onEmotion(emotionEvent: EmotionEvent) {
    if (this.isLoaded && this.innequin && inworld.name === this.name) {
      this.setEmotion(emotionEvent.behavior.code);
      this.innequin.setEmotion(emotionEvent.behavior.code);
      if (this.callbackSetEmotion)
        this.callbackSetEmotion(emotionEvent.behavior.code);
    }
  }

  onLoadInnequin(config: InnequinConfiguration) {
    this.config = config;
    if (this.innequin && this.innequin.getModel()) {
      this.group.add(this.innequin?.getModel() as Object3D<Object3DEventMap>);
      this.group.add(this.boundingBox.model);
      this.setEmotion(config.innequin.defaults.EMOTION);
      if (this.callbackSetEmotion)
        this.callbackSetEmotion(config.innequin.defaults.EMOTION);
      this.setLoaded(true);
    }
    if (this.callbackSetConfig) {
      this.callbackSetConfig(config);
    }
  }

  onPhonemes(phonemes: AdditionalPhonemeInfo[]) {
    if (this.isLoaded && this.innequin && inworld.name === this.name) {
      this.innequin.setPhonemes(phonemes);
    }
  }

  onProgressInnequin(progress: number) {
    // log('ModelInnequin onProgressInnequin', progress);
  }

}

import { Euler, Group, Object3D, Object3DEventMap, Vector3 } from 'three';

import { EmotionBehaviorCode, EmotionEvent } from '@inworld/web-core';
import { AdditionalPhonemeInfo } from '@inworld/web-core/build/proto/ai/inworld/packets/packets.pb';
import { RPM, RPMBodyEmotionToBehavior, RPMConfiguration } from '@inworld/web-threejs';
import { GENDER_TYPES } from '@inworld/web-threejs/build/src/types/types';

import EventDispatcher from '../events/EventDispatcher';
import {
    EVENT_EMOTION as EVENT_INWORLD_EMOTION, EVENT_PHONEMES_HISTORY, inworld, OpenConnectionType,
    STATE_INIT
} from '../inworld/Inworld';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import ClickableCube from './clickables/ClickableCube';

export interface ModelRPMProps {
  isLoaded: boolean;
  animationCurrent?: string | undefined;
  emotionCurrent?: string | undefined;
  gender?: GENDER_TYPES | undefined;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  setConfig?: (config: RPMConfiguration) => void;
  onClick?: (name: string) => void;
  onChangeEmotion?: (emotion: EmotionBehaviorCode) => void;
}


export const DEFAULT_NAME = 'RPM';

export const EVENT_EMOTION = 'event_emotion';
export const EVENT_LOADED = 'event_loaded';

export default class ModelRPM extends EventDispatcher {

  callbackClick?: (name: string) => void;
  callbackSetConfig?: (config: RPMConfiguration) => void;
  callbackSetEmotion?: (emotion: EmotionBehaviorCode) => void;
  boundingBox: ClickableCube;
  characterId?: string;
  config?: RPMConfiguration;
  emotion?: EmotionBehaviorCode;
  group: Group;
  rpm?: RPM;
  isLoaded: boolean;
  name?: string;

  constructor(props: ModelRPMProps) {

    super();

    this.isLoaded = false;
  
    this.characterId = props.characterId;
    this.name = props.name;

    this.callbackClick = props.onClick;
    this.callbackSetConfig = props.setConfig;
    this.callbackSetEmotion = props.onChangeEmotion;

    this.onClick = this.onClick.bind(this);
    this.onEmotion = this.onEmotion.bind(this);
    this.onLoadRPM = this.onLoadRPM.bind(this);
    this.onPhonemes = this.onPhonemes.bind(this);
    this.onProgressRPM = this.onProgressRPM.bind(this);

    this.group = new Group();
    
    if (props.position) {
      this.group.position.set(props.position.x, props.position.y, props.position.z)
    }

    if (props.rotation) {
      this.group.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
    }

    this.rpm = new RPM({
      baseURI: Config.AssetBaseURI + '/rpm',
      configURI: Config.AssetBaseURI + (props.gender === GENDER_TYPES.FEMALE ? '/rpm/config_female.json' : '/rpm/config_male.json'),
      dracoURI: Config.Threejs.DracoCompressionURI,
      onLoad: this.onLoadRPM,
      onProgress: this.onProgressRPM,
    });

    this.boundingBox = new ClickableCube({ length: 0.5, width: 1.7, height: 0.5, position: new Vector3(0, 0.85, 0), onClick: this.onClick });

    inworld.addListener(EVENT_INWORLD_EMOTION, this.onEmotion);
    inworld.addListener(EVENT_PHONEMES_HISTORY, this.onPhonemes);

  }

  frameUpdate(delta: number) {
    if (this.rpm) {
      this.rpm.updateFrame(delta);
    }
  }

  get model(): Group {
    return this.group;
  }

  setAnimation(animationName: string) {
    if (this.isLoaded && this.rpm && inworld.name === this.name) {
      this.rpm.playAnimation(animationName);
    }
  }

  setEmotion(emotion: EmotionBehaviorCode) {
    if (this.isLoaded && this.rpm && inworld.name === this.name) {
      // if (this.callbackSetEmotion)
      //   this.callbackSetEmotion(emotion);
      this.rpm.setEmotion(
        EmotionBehaviorCode[
        RPMBodyEmotionToBehavior[
        emotion.toUpperCase() as keyof typeof RPMBodyEmotionToBehavior
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
    if (this.isLoaded && this.rpm && inworld.name === this.name) {
      this.setEmotion(emotionEvent.behavior.code);
      this.rpm.setEmotion(emotionEvent.behavior.code);
      if (this.callbackSetEmotion)
        this.callbackSetEmotion(emotionEvent.behavior.code);
    }
  }

  onLoadRPM(config: RPMConfiguration) {
    this.config = config;
    if (this.rpm && this.rpm.getModel()) {
      this.group.add(this.rpm?.getModel() as Object3D<Object3DEventMap>);
      this.group.add(this.boundingBox.model);
      this.setEmotion(config.rpm.defaults.EMOTION);
      if (this.callbackSetEmotion)
        this.callbackSetEmotion(config.rpm.defaults.EMOTION);
      this.setLoaded(true);
    }
    if (this.callbackSetConfig) {
      this.callbackSetConfig(config);
    }
  }

  onPhonemes(phonemes: AdditionalPhonemeInfo[]) {
    if (this.isLoaded && this.rpm && inworld.name === this.name) {
      this.rpm.setPhonemes(phonemes);
    }
  }

  onProgressRPM(progress: number) {
    // log('ModelRPM onProgressRPM', progress);
  }

}

import { S } from 'vite/dist/node/types.d-aGj9QkWt';

import {
    Innequin, InnequinAnimationType, InnequinConfiguration, RPMConfiguration
} from '@inworld/web-threejs';
import { EMOTIONS_FACE, FACE_TEXTURE_TYPES } from '@inworld/web-threejs/build/src/types/types';

import { MODEL_URI as LOGO_MODEL_URI, VIDEO_URI as LOGO_VIDEO_URI } from '../models/ModelLogo';
import { MODEL_URI as ROOM_MODEL_URI } from '../models/roomparts/RoomModel';
import { EVENT_COMPLETE, resources } from '../resources/Resources';
import { CharactersDataType, SoundsDataType } from '../types/DataTypes';
import { ICON_PTT_URI, ICON_RECORD_URI, ICON_RETURN_URI } from '../ui/Chat';
import { Config } from '../utils/config';
import { log } from '../utils/log';

class Model {

  charactersData: CharactersDataType;
  characterConfigs: (InnequinConfiguration | RPMConfiguration)[];
  soundsData: SoundsDataType;
  onLoadCallback?: Function;
  onPreloadCallback?: Function;

  constructor() {
    this.charactersData = {};
    this.characterConfigs = [];
    this.soundsData = {};
    this.onLoadCharacters = this.onLoadCharacters.bind(this);
    this.onLoadCharacterConfig = this.onLoadCharacterConfig.bind(this);
    this.onLoadSounds = this.onLoadSounds.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPreload = this.onPreload.bind(this);
    this.onPreloadComplete = this.onPreloadComplete.bind(this);
  }

  // Loads the assets needed for the main scene.
  load(onLoad: () => void) {
    log("Model - Load");
    this.onLoadCallback = onLoad;
    resources.addListener(EVENT_COMPLETE, this.onLoad);
    resources.loadFile(Config.AssetBaseURI + ROOM_MODEL_URI);
    resources.loadFile(Config.AssetBaseURI + ICON_RETURN_URI);
    resources.loadFile(Config.AssetBaseURI + ICON_RECORD_URI);
    resources.loadFile(Config.AssetBaseURI + ICON_PTT_URI);

    const characterAssets = new Set();

    this.characterConfigs.forEach(config => {
      if (config.hasOwnProperty("innequin")) {
        const innequinConfig: InnequinConfiguration = config as InnequinConfiguration;
        resources.loadFile(Config.AssetBaseURI + "/innequin" + innequinConfig.innequin.baseURIs.MODELS_BODY + innequinConfig.innequin.defaults.MODEL);
        for (const animationName in innequinConfig.innequin.animations) {
          const animation: InnequinAnimationType =
            innequinConfig.innequin.animations[animationName];
          const fileURI: string = Config.AssetBaseURI + "/innequin" +
            innequinConfig.innequin.baseURIs.MODELS_ANIMATIONS_EMOTIONS +
            animation.file;
          characterAssets.add(fileURI);
        }
        Object.values(EMOTIONS_FACE).forEach((valueEmotionType) => {
          Object.values(FACE_TEXTURE_TYPES).forEach((valueFaceType) => {
            let fileURI = Config.AssetBaseURI + "/innequin";
            fileURI += innequinConfig.innequin.baseURIs.TEXTURES_FACIAL_EMOTIONS;
            fileURI += innequinConfig.innequin.defaults.GENDER;
            fileURI += '/';
            fileURI += valueEmotionType.toLowerCase() + '/';
            fileURI += valueFaceType + '_' + valueEmotionType.toLowerCase() + '.png';
            characterAssets.add(fileURI);
          });
        });
      }
      if (config.hasOwnProperty("rpm")) {
        const rpmConfig: RPMConfiguration = config as RPMConfiguration;
        resources.loadFile(Config.AssetBaseURI + "/rpm" + rpmConfig.rpm.baseURIs.MODELS_BODY + rpmConfig.rpm.defaults.MODEL);
        for (const animationName in rpmConfig.rpm.animations) {
          const animation: InnequinAnimationType =
            rpmConfig.rpm.animations[animationName];
          const fileURI: string =
            Config.AssetBaseURI + "/rpm" +
            rpmConfig.rpm.baseURIs.ANIMATIONS_JSON +
            animation.file;
          characterAssets.add(fileURI);
        }
      }
      for (const fileURL of characterAssets) {
        resources.loadFile(fileURL as string);
      }
    });
  }

  // Preloads the assets needed for the preloader scene.
  preload(onPreload: () => void) {
    log("Model - Preload");
    this.onPreloadCallback = onPreload;
    resources.addListener(EVENT_COMPLETE, this.onPreload);
    resources.loadJSON(Config.AssetBaseURI + Config.CharactersDataURI, this.onLoadCharacters);
    resources.loadJSON(Config.AssetBaseURI + Config.SoundsDataURI, this.onLoadSounds);
    resources.loadFile(Config.AssetBaseURI + LOGO_VIDEO_URI);
    resources.loadFile(Config.AssetBaseURI + LOGO_MODEL_URI);
  }

  // Loads the list of characters.
  onLoadCharacters(charactersData: CharactersDataType) {
    // log("Model - onLoadCharacters");
    this.charactersData = charactersData;
  }

  // Loads the files associated with a character.\
  onLoadCharacterConfig(config: InnequinConfiguration | RPMConfiguration) {
    // log("Model - onLoadCharacterConfig");
    this.characterConfigs.push(config);
  }

  // 2 of 2 parts of the preloader. Loads all the character parts.
  onLoad() {
    log('Model - onLoad');
    resources.removeListener(EVENT_COMPLETE, this.onLoad);
    this.onLoadCallback!();
  }

  // Loads the sound file data for the sound controller.
  onLoadSounds(soundsData: SoundsDataType) {
    // log("Model - onLoadSounds");
    this.soundsData = soundsData;
  }

  // 1 of 2 parts of the preloader. Handles load complete of JSON and preload models.
  onPreload() {
    log('Model - onPreload');
    resources.removeListener(EVENT_COMPLETE, this.onPreload);
    // Preload all character configuration files
    const characterNames = Object.keys(this.charactersData);
    const configURIs = characterNames.map(name => this.charactersData[name].configURI);
    resources.addListener(EVENT_COMPLETE, this.onPreloadComplete);
    configURIs.forEach(uri => {
      resources.loadJSON(uri, this.onLoadCharacterConfig);
    });
  }

  // 2 of 2 parts of the preloader. Loads all the character parts.
  onPreloadComplete() {
    log('Model - onPreloadComplete');
    resources.removeListener(EVENT_COMPLETE, this.onPreloadComplete);
    this.onPreloadCallback!();
  }

}

export const model = new Model();

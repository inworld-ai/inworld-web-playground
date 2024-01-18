import { Configuration } from '../types/types';

export const Config: Configuration = {
  THREEJS: {
    CAMERA_SETTINGS: {
      POS_X: 0,
      POS_Y: 1.5,
      POS_Z: 1,
      TAR_X: 0,
      TAR_Y: 1,
      TAR_Z: 0,
      FOV: 45,
      NEAR: 0.01,
      FAR: 1000,
    },
    DRACO_COMPRESSION_URI: process.env.REACT_APP_DRACO_COMPRESSION_URI!,
    WORLD_SETTINGS: {
      LENGTH: 50,
      WIDTH: 50,
    },
    PLAYER_SETTINGS: {
      GRAVITY: 9.8,
      PLAYER_EYE_LEVEL: 1.5,
      JUMP_POWER: 3,
    },
  },
  INWORLD: {
    characterId: process.env.REACT_APP_INWORLD_CHARACTER_ID!,
    sceneId: process.env.REACT_APP_INWORLD_SCENE_ID!,
    tokenURL:
      process.env.REACT_APP_INWORLD_GENERATE_TOKEN_URL ||
      'http://localhost:4000',
  },
  INNEQUIN: {
    baseURI: process.env.REACT_APP_INNEQUIN_BASE_URI!,
    configURI: process.env.REACT_APP_INNEQUIN_CONFIG_URI!,
    dracoURI: process.env.REACT_APP_DRACO_COMPRESSION_URI || '',
  },
  RPM: {
    baseURI: process.env.REACT_APP_RPM_BASE_URI!,
    configURI: process.env.REACT_APP_RPM_CONFIG_URI!,
    dracoURI: process.env.REACT_APP_DRACO_COMPRESSION_URI || '',
  },
};

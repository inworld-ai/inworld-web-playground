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
    DRACO_COMPRESSION_URI: import.meta.env.VITE_DRACO_COMPRESSION_URI || '',
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
    characterId: import.meta.env.VITE_INWORLD_CHARACTER_ID || '',
    sceneId: import.meta.env.VITE_INWORLD_SCENE_ID || '',
    tokenURL:
      import.meta.env.VITE_INWORLD_GENERATE_TOKEN_URI ||
      'http://localhost:4000',
  },
  INNEQUIN_MALE: {
    baseURI: import.meta.env.VITE_INNEQUIN_BASE_URI || '',
    configURI: import.meta.env.VITE_INNEQUIN_MALE_CONFIG_URI || '',
    dracoURI: import.meta.env.VITE_DRACO_COMPRESSION_URI || '',
  },
  INNEQUIN_FEMALE: {
    baseURI: import.meta.env.VITE_INNEQUIN_BASE_URI || '',
    configURI: import.meta.env.VITE_INNEQUIN_FEMALE_CONFIG_URI || '',
    dracoURI: import.meta.env.VITE_DRACO_COMPRESSION_URI || '',
  },
  RPM: {
    baseURI: import.meta.env.VITE_RPM_BASE_URI || '',
    configURI: import.meta.env.VITE_RPM_CONFIG_URI || '',
    dracoURI: import.meta.env.VITE_DRACO_COMPRESSION_URI || '',
  },
};

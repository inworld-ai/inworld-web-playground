export type CameraConfigType = {
  POS_X: number;
  POS_Y: number;
  POS_Z: number;
  TAR_X: number;
  TAR_Y: number;
  TAR_Z: number;
  FOV: number;
  NEAR: number;
  FAR: number;
};

export type ConfigType = {
  AssetBaseURI: string;
  CharactersDataURI: string;
  SoundsDataURI: string;
  Threejs: ThreejsConfigType;
  Inworld: InworldConfigType;
}

export type InworldConfigType = {
  CharacterID: string;
  SceneId: string;
  TokenURL: string;
};

export type ThreejsConfigType = {
  CameraSettings: CameraConfigType;
  DracoCompressionURI: string;
  PlayerSettings: PlayerConfigType;
  WorldSettings: WorldConfigType;
};

export type PlayerConfigType = {
  GRAVITY: number;
  PLAYER_EYE_LEVEL: number;
  JUMP_POWER: number;
};

export type WorldConfigType = {
  LENGTH: number;
  WIDTH: number;
};

export const Config: ConfigType = {
  AssetBaseURI: import.meta.env.VITE_ASSETS_BASE_URI || '',
  CharactersDataURI: import.meta.env.VITE_JSON_CHARACTERS_URI || '',
  SoundsDataURI: import.meta.env.VITE_JSON_SOUNDS_URI || '',
  Inworld: {
    CharacterID: import.meta.env.VITE_INWORLD_CHARACTER_ID || '',
    SceneId: import.meta.env.VITE_INWORLD_SCENE_ID || '',
    TokenURL:
      import.meta.env.VITE_INWORLD_GENERATE_TOKEN_URI ||
      'http://localhost:4000',
  },
  Threejs: {
    CameraSettings: {
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
    DracoCompressionURI: import.meta.env.VITE_DRACO_COMPRESSION_URI || '',
    WorldSettings: {
      LENGTH: 50,
      WIDTH: 50,
    },
    PlayerSettings: {
      GRAVITY: 9.8,
      PLAYER_EYE_LEVEL: 1.5,
      JUMP_POWER: 3,
    },
  },
}

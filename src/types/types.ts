import { EmotionEvent } from '@inworld/web-core';

export type Configuration = {
  THREEJS: ThreejsConfiguration;
  INNEQUIN: InnequinAssetsConfiguration;
  RPM: RPMAssetsConfiguration;
  INWORLD: InworldConfiguration;
}

export type ConfigurationWorld = {
  LENGTH: number;
  WIDTH: number;
}

export type ConfigurationCamera = {
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

export type InnequinAssetsConfiguration = {
  baseURI: string;
  configURI: string;
  dracoURI: string;
};

export type InworldConfiguration = {
  characterId: string;
  sceneId: string;
  tokenURL: string;
};

export type PlayerConfiguration = {
  GRAVITY: number,
  PLAYER_EYE_LEVEL: number,
  JUMP_POWER: number,
};

export type RPMAssetsConfiguration = {
  baseURI: string;
  configURI: string;
  dracoURI: string;
};

export type ThreejsConfiguration = {
  CAMERA_SETTINGS: ConfigurationCamera;
  DRACO_COMPRESSION_URI: string;
  PLAYER_SETTINGS: PlayerConfiguration;
  WORLD_SETTINGS: ConfigurationWorld;
}

// Defines the name of the type of Clickable object
export const Clickable = {
  Cube: "ClickableCube",
  Cylinder: "ClickableCube",
  Sphere: "ClickableSphere",
}

export interface EmotionsMap {
  [key: string]: EmotionEvent;
}

export type Configuration = {
    CAMERA_SETTINGS: ConfigurationCamera;
    DRACO_COMPRESSION_URI: string;
    WORLD_SETTINGS: ConfigurationWorld;
    INNEQUIN: InnequinAssetsConfiguration;
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
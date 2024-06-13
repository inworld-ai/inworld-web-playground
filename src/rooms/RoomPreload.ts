import { Group } from 'three';
import { Reflector } from 'three-stdlib';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { PolarGridHelper } from 'three/src/helpers/PolarGridHelper';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { SpotLight } from 'three/src/lights/SpotLight';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial';
import { Color } from 'three/src/math/Color';
import { Vector2 } from 'three/src/math/Vector2';
import { Mesh } from 'three/src/objects/Mesh';
import { Fog } from 'three/src/scenes/Fog';

import { TextureFileLoader } from '@inworld/web-threejs/build/src/loaders/TextureFileLoader';

import EventDispatcher from '../events/EventDispatcher';
import ModelLogo from '../models/ModelLogo';
import { Config } from '../utils/config';
import { log } from '../utils/log';

export const EVENT_LOADED = 'event_loaded';

const TEXTURE_BASE_URI: string = "/textures/floor/preload/SurfaceImperfections003_1K_var1.jpg";
const TEXTURE_NORMAL_URI: string = "/textures/floor/preload/SurfaceImperfections003_1K_Normal.jpg";

export default class RoomPreload extends EventDispatcher {

  fog: Fog;
  groupRoom: Group;
  ground: Reflector;
  // groundTextureBase: TextureFileLoader;
  // groundTextureNormal: TextureFileLoader;
  lightAmbient: AmbientLight;
  lightDirectional: DirectionalLight;
  lightSpot: SpotLight;
  logo: ModelLogo;

  constructor() {
    super();

    this.groupRoom = new Group();
    this.groupRoom.name = "groupRoom";
    this.groupRoom.position.set(0, 0, 0);
    this.groupRoom.rotation.set(0, 0, 0);

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);

    // this.groundTextureBase = new TextureFileLoader({ fileURI: Config.AssetBaseURI + TEXTURE_BASE_URI });
    // this.groundTextureBase.load(this.onLoad);
    // this.groundTextureNormal = new TextureFileLoader({ fileURI: Config.AssetBaseURI + TEXTURE_NORMAL_URI });
    // this.groundTextureNormal.load(this.onLoad);

    this.logo = new ModelLogo({
      id: 'ModelLogo',
      onLoad: this.onLoad,
      onProgress: this.onProgress,
    });

    this.fog = new Fog(new Color('black'), 30, 40);

    const floor = new Mesh(
      new PlaneGeometry(100, 100)
    );
    floor.rotation.x = -Math.PI / 2;

    this.ground = new Reflector(floor.geometry, {
      clipBias: 0.003,
      color: new Color(0xffffff),
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio
    });
    this.ground.rotation.x = -Math.PI / 2;

    this.lightAmbient = new AmbientLight(undefined, 0.5);
    this.lightDirectional = new DirectionalLight(undefined, 0.7);
    this.lightDirectional.position.set(-50, 0, -40);
    this.lightSpot = new SpotLight(undefined, 0.3);
    this.lightSpot.position.set(0, 10, 0);
  }

  dispose() {
    
  }

  getFog() {
    return this.fog;
  }

  getObject() {
    return this.groupRoom;
  }

  onLoad() {
    if (
      this.logo &&
      this.logo.isLoaded /* &&
      this.groundTextureBase &&
      this.groundTextureBase.isLoaded &&
      this.groundTextureNormal &&
      this.groundTextureNormal.isLoaded */
    ) {
      log('RoomPreload Loaded');

      this.logo.getObject().position.set(0, 0, -25); // -25
      this.logo.getObject().rotation.set(Math.PI / 2, 0, Math.PI / 6);

      // const materialGround = new MeshStandardMaterial({
      //   color: 0xa0a0a0,
      //   emissive: 0x8d8d8d,
      //   depthWrite: true,
      //   metalness: 0.4,
      //   roughnessMap: this.groundTextureBase.texture,
      //   normalMap: this.groundTextureNormal.texture,
      //   normalScale: new Vector2(2, 2)
      // })

      // this.ground.material = materialGround;
      this.groupRoom.add(this.ground);

      // const size = 10;
      // const divisions = 10;
      // const gridHelper = new PolarGridHelper(size, divisions);
      // this.groupRoom.add(gridHelper);

      this.groupRoom.add(this.logo.getObject());
      this.groupRoom.add(this.lightAmbient);
      this.groupRoom.add(this.lightDirectional);
      this.groupRoom.add(this.lightSpot);
      this.dispatch(EVENT_LOADED);
    }
  };

  onProgress(progress: number) {
    log('RoomPreload onProgress', progress);
  };

}

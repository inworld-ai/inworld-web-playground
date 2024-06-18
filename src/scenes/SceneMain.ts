import './SceneMain.css';

import { Clock, Scene, Vector3, WebGLRenderer } from 'three';

import { CameraCore } from '../camera/CameraCore';
import ClickDetection from '../helpers/ClickDetection';
import { InputController } from '../input/InputController';
import ColidableCube from '../models/colidables/ColidableCube';
import PlayerController from '../player/PlayerController';
import RoomMain, { EVENT_LOADED } from '../rooms/RoomMain';
import { log } from '../utils/log';

export interface SceneMainProps {
  parent: HTMLDivElement;
}

export default class SceneMain {

  // boundingBox: ColidableCube;
  camera: CameraCore;
  clickDetection?: ClickDetection;
  clock: Clock;
  inputController: InputController;
  parent: HTMLDivElement;
  playerController: PlayerController;
  rafID: number;
  renderer: WebGLRenderer;
  roomMain: RoomMain;
  // roomLobby: RoomLobby;
  // roomInteraction: RoomInteraction;
  scene: Scene;

  constructor(props: SceneMainProps) {

    log('SceneMain constructor');

    this.parent = props.parent;
    this.rafID = 0;
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new CameraCore();

    // this.boundingBox = new ColidableCube({ length: 1, width: 1, height: 1, position: new Vector3(0, 0, 0) });
    // this.boundingBox.show();
    this.inputController = new InputController();
    this.playerController = new PlayerController({ cameraCore: this.camera, inputController: this.inputController });
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.onFrame = this.onFrame.bind(this);
    this.onLoadedRoom = this.onLoadedRoom.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);
    this.onResizeWindow();

    this.roomMain = new RoomMain({ position: new Vector3(0, 0, 0) });
    this.roomMain.addListener(EVENT_LOADED, this.onLoadedRoom);
    
    // this.roomLobby = new RoomLobby({ position: new Vector3(0, 0, 0) });
    // this.roomInteraction = new RoomInteraction({ position: new Vector3(45, 0, 0) });
    // this.roomLobby.addListener(EVENT_LOADED, this.onLoadedRoom);
    // this.roomInteraction.addListener(EVENT_LOADED, this.onLoadedRoom);

  }

  hide() {
    if (this.rafID !== 0) cancelAnimationFrame(this.rafID);
    window.removeEventListener("resize", this.onResizeWindow);
    this.parent.removeChild(this.renderer.domElement);
  }

  show() {
    window.addEventListener("resize", this.onResizeWindow);
    this.parent.appendChild(this.renderer.domElement);
    this.onFrame();
  }

  onFrame() {
    this.rafID = requestAnimationFrame(this.onFrame);
    let delta: number = this.clock.getDelta();
    this.playerController.onFrame(delta);
    this.renderer.render(this.scene, this.camera.camera);
    this.roomMain.onFrame(delta);
    // this.boundingBox.model.position.set(this.camera.camera.position.x, this.boundingBox.model.position.y, this.camera.camera.position.z);
  }

  onLoadedRoom() {
    log('SceneMain onLoadedRoom');
    if (
      this.roomMain.isLoaded
      // this.roomLobby.isLoaded &&
      // this.roomInteraction.isLoaded
    ) {
      log('SceneMain YO MAMA');
      this.scene.add(this.roomMain.getObject());
      // this.scene.add(this.roomLobby.getObject());
      // this.scene.add(this.roomInteraction.getObject());
      // this.scene.add(this.boundingBox.model);
      this.clickDetection = new ClickDetection({ cameraCore: this.camera, scene: this.scene });
    }
  }

  onResizeWindow() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

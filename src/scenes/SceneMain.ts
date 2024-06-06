import './SceneMain.css';

import { Clock, Scene, WebGLRenderer } from 'three';

import { CameraCore } from '../camera/CameraCore';
import ClickDetection from '../helpers/ClickDetection';
import { InputController } from '../input/InputController';
import PlayerController from '../player/PlayerController';
import RoomLobby, { EVENT_LOADED } from '../rooms/RoomLobby';
import { log } from '../utils/log';

export interface SceneMainProps {
  parent: HTMLDivElement;
}

export default class SceneMain {

  camera: CameraCore;
  clickDetection?: ClickDetection;
  clock: Clock;
  inputController: InputController;
  parent: HTMLDivElement;
  playerController: PlayerController;
  rafID: number;
  renderer: WebGLRenderer;
  roomLobby: RoomLobby;
  scene: Scene;

  constructor(props: SceneMainProps) {
    log('SceneMain constructor');
    this.parent = props.parent;
    this.rafID = 0;
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new CameraCore();

    this.inputController = new InputController();
    this.playerController = new PlayerController({ cameraCore: this.camera, inputController: this.inputController });
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.onFrame = this.onFrame.bind(this);
    this.onLoadedRoom = this.onLoadedRoom.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);
    this.onResizeWindow();

    this.roomLobby = new RoomLobby();
    this.roomLobby.addListener(EVENT_LOADED, this.onLoadedRoom);

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
    this.roomLobby.onFrame(delta);
  }

  onLoadedRoom() {
    log('SceneMain onLoadedRoom');
    this.scene.add(this.roomLobby.getObject());
    this.clickDetection = new ClickDetection({ cameraCore: this.camera, scene: this.scene });
  }

  onResizeWindow() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

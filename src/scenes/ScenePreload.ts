import './ScenePreload.css';

import { Clock, Scene, WebGLRenderer } from 'three';

import { CameraCore } from '../camera/CameraCore';
import EventDispatcher from '../events/EventDispatcher';
import { InputController } from '../input/InputController';
import PlayerController from '../player/PlayerController';
import RoomPreload, { EVENT_LOADED } from '../rooms/RoomPreload';
import { log } from '../utils/log';

export interface ScenePreloadProps {
  parent: HTMLDivElement;
}

export default class ScenePreload extends EventDispatcher {

  camera: CameraCore;
  clock: Clock;
  inputController: InputController;
  parent: HTMLDivElement;
  playerController: PlayerController;
  rafID: number;
  renderer: WebGLRenderer;
  roomPreload: RoomPreload;
  scene: Scene;

  constructor(props: ScenePreloadProps) {
    log('ScenePreload constructor');

    super();

    this.parent = props.parent;
    this.rafID = 0;
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new CameraCore();

    this.inputController = new InputController();
    this.playerController = new PlayerController({ cameraCore: this.camera, inputController: this.inputController });
    this.renderer = new WebGLRenderer({ alpha: false, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);


    this.onFrame = this.onFrame.bind(this);
    this.onLoadedRoom = this.onLoadedRoom.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);
    this.onResizeWindow();

    this.roomPreload = new RoomPreload();
    this.roomPreload.addListener(EVENT_LOADED, this.onLoadedRoom);
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
  }

  onLoadedRoom() {
    log('ScenePreload onLoadedRoom');
    this.scene.fog = this.roomPreload.getFog();
    this.scene.add(this.roomPreload.getObject());
    this.dispatch(EVENT_LOADED);
  }

  onResizeWindow() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

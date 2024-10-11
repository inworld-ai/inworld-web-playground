import './App.css';

import { model } from '../data/Model';
import { EVENT_LOADED } from '../rooms/RoomPreload';
import SceneMain from '../scenes/SceneMain';
import ScenePreload from '../scenes/ScenePreload';
import { SCENE_MAIN, SCENE_PRELOAD, STATE_RUNNING, system } from '../system/System';
import Hud from '../ui/Hud';
import { uiController } from '../ui/UIController';
import { log } from '../utils/log';

export interface AppProps {
  root: HTMLDivElement;
}

export default class App {

  hud?: Hud;
  root: HTMLDivElement;
  scenePreload?: ScenePreload;
  sceneMain?: SceneMain;

  constructor(props: AppProps) {
    this.root = props.root;
    this.onLoaded = this.onLoaded.bind(this);
    this.onPreloaded = this.onPreloaded.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onScenePreload = this.onScenePreload.bind(this);
    model.preload(this.onPreloaded);
  }

  onLoaded() {
    log("App onLoaded");
    uiController.setLabel1(" ");
    this.sceneMain = new SceneMain({ parent: this.root });
    this.scenePreload?.hide();
    this.scenePreload?.dispose();
    this.sceneMain?.show();
    system.setSystemState(STATE_RUNNING);
    system.setSceneState(SCENE_MAIN);
  }

  onPreloaded() {
    log("App onPreloaded");
    this.scenePreload = new ScenePreload({ parent: this.root });
    this.scenePreload.addListener(EVENT_LOADED, this.onScenePreload);
  }

  onProgress() {
    // console.log("App onProgress");
  }

  onScenePreload() {
    log("App onScenePreload");
    this.scenePreload?.show();
    this.hud = new Hud();
    model.load(this.onLoaded);
    system.setSceneState(SCENE_PRELOAD);
  }

}

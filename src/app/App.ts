import './App.css';

import { model } from '../data/Model';
import { EVENT_LOADED } from '../rooms/RoomPreload';
import SceneMain from '../scenes/SceneMain';
import ScenePreload from '../scenes/ScenePreload';
import { STATE_RUNNING, system } from '../system/System';
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
    console.log("App onLoaded");
    uiController.setLabel1(" ");
    this.sceneMain = new SceneMain({ parent: this.root });
    this.sceneMain?.show();
    this.scenePreload?.hide();
    system.setSystemState(STATE_RUNNING);
  }

  onPreloaded() {
    console.log("App onPreloaded");
    this.scenePreload = new ScenePreload({ parent: this.root });
    this.scenePreload.addListener(EVENT_LOADED, this.onScenePreload);
  }

  onProgress() {
    // console.log("App onProgress");
  }

  onScenePreload() {
    log("onScenePreload");
    this.scenePreload?.show();
    this.hud = new Hud({});
    model.load(this.onLoaded);
  }

}

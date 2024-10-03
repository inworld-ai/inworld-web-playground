import './Hud.css';

import { EVENT_PROGRESS, ProgressType, resources } from '../resources/Resources';
import { EVENT_SCENE_STATE, SCENE_MAIN, system } from '../system/System';
import { log } from '../utils/log';
import ChatUI from './Chat';
import AnimationsMenu from './menus/AnimationsMenu';
import {
    EVENT_LABEL1, EVENT_MENU_DATA, EVENT_MENU_ROOM, RoomMenuType, uiController
} from './UIController';

export interface HudProps {
}

export default class Hud {

  chatUI: ChatUI;
  hudUpperLeft: HTMLDivElement;
  labelCopywrite: HTMLParagraphElement;
  labelProjectName: HTMLParagraphElement;
  labelProjectTitle: HTMLParagraphElement;
  menuAnimations: AnimationsMenu;
  parent: HTMLDivElement;
  progressBar: HTMLDivElement;
  roomMenuTypeActive: RoomMenuType;

  constructor(props: HudProps) {

    this.parent = document.getElementById('hud') as HTMLDivElement;

    this.labelProjectName = document.createElement('p');
    this.labelProjectName.id = "hudLabelLL";
    this.labelProjectName.className = "hudLabelLower inter-regular";
    this.labelProjectName.innerHTML = "Web Playgrounds 1.5.0";
    this.parent.appendChild(this.labelProjectName);

    this.labelCopywrite = document.createElement('p');
    this.labelCopywrite.id = "hudLabelLR";
    this.labelCopywrite.className = "hudLabelLower inter-regular";
    this.labelCopywrite.innerHTML = "Copyright © 2024 Inworld";
    this.parent.appendChild(this.labelCopywrite);

    this.hudUpperLeft = document.createElement('div');
    this.hudUpperLeft.id = "hudUL";
    this.parent.appendChild(this.hudUpperLeft);

    this.labelProjectTitle = document.createElement('p');
    this.labelProjectTitle.id = "hudLabelUL";
    this.labelProjectTitle.className = "hudLabelUpper inter-bold";
    this.labelProjectTitle.innerHTML = "Loading";
    this.hudUpperLeft.appendChild(this.labelProjectTitle);

    this.progressBar = document.createElement('div');
    this.progressBar.id = "hudProgressBar";
    this.progressBar.style.width = "0%"
    this.hudUpperLeft.appendChild(this.progressBar);

    this.onLabel1 = this.onLabel1.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onRoomData = this.onRoomData.bind(this);
    this.onRoomMenu = this.onRoomMenu.bind(this);
    this.onScene = this.onScene.bind(this);

    this.chatUI = new ChatUI({ parent: this.parent });
    this.menuAnimations = new AnimationsMenu({ parent: this.parent });

    resources.addListener(EVENT_PROGRESS, this.onProgress);
    uiController.addListener(EVENT_LABEL1, this.onLabel1);
    uiController.addListener(EVENT_MENU_DATA, this.onRoomData);
    uiController.addListener(EVENT_MENU_ROOM, this.onRoomMenu);
    system.addListener(EVENT_SCENE_STATE, this.onScene);

    // this.labelProjectTitle = document.createElement('p');
    // this.labelProjectTitle.id = "hudLabelUR";
    // this.labelProjectTitle.className = "hudLabel inter-regular";
    // this.labelProjectTitle.innerHTML = "";
    // this.parent.appendChild(this.labelProjectTitle);

  }

  onLabel1(text: string) {
    this.labelProjectTitle.innerHTML = text;
  }

  onProgress(progress: ProgressType) {
    this.progressBar.style.width = `${progress.progress}%`;
  }

  onRoomData(data: any) {
    switch(type) {
      case RoomMenuType.ANIMATIONS:
        if (!this.parent.contains(this.menuAnimations.container))
          this.parent.appendChild(this.menuAnimations.container);
        break;
      default:
        break;
    }
  }

  onRoomMenu(type: RoomMenuType) {
    console.log('Hud: onRoomMenu:', type);
    if (this.parent.contains(this.menuAnimations.container))
      this.parent.removeChild(this.menuAnimations.container);
    switch(type) {
      case RoomMenuType.ANIMATIONS:
        if (!this.parent.contains(this.menuAnimations.container))
          this.parent.appendChild(this.menuAnimations.container);
        break;
      default:
        break;
    }
  }

  onScene(scene: string) {
    if (scene === SCENE_MAIN) {
      this.hudUpperLeft.removeChild(this.progressBar);
    }
  }

}

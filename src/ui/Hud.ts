import './Hud.css';
import './menus/Menus.css';

import { EVENT_PROGRESS, ProgressType, resources } from '../resources/Resources';
import { EVENT_SCENE_STATE, SCENE_MAIN, system } from '../system/System';
import { RoomTypes } from '../types/RoomTypes';
import ChatUI from './Chat';
import AnimationsMenu from './menus/AnimationsMenu';
import EmotionsMenu from './menus/EmotionsMenu';
import GoalsMenu from './menus/GoalsMenu';
import {
    EVENT_LABEL1, EVENT_MENU_DATA, EVENT_MENU_ROOM, RoomMenuType, uiController
} from './UIController';

export default class Hud {

  chatUI: ChatUI;
  hudUpperLeft: HTMLDivElement;
  labelCopywrite: HTMLParagraphElement;
  labelProjectName: HTMLParagraphElement;
  labelProjectTitle: HTMLParagraphElement;
  menuAnimations: AnimationsMenu;
  menuEmotions: EmotionsMenu;
  menuGoals: GoalsMenu;
  parent: HTMLDivElement;
  progressBar: HTMLDivElement;
  roomMenuTypeActive: RoomMenuType;

  constructor() {

    this.parent = document.getElementById('hud') as HTMLDivElement;

    this.roomMenuTypeActive = RoomMenuType.NONE;
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
    this.menuEmotions = new EmotionsMenu({parent: this.parent });
    this.menuGoals = new GoalsMenu({parent: this.parent });

    resources.addListener(EVENT_PROGRESS, this.onProgress);
    uiController.addListener(EVENT_LABEL1, this.onLabel1);
    uiController.addListener(EVENT_MENU_DATA, this.onRoomData);
    uiController.addListener(EVENT_MENU_ROOM, this.onRoomMenu);
    system.addListener(EVENT_SCENE_STATE, this.onScene);

  }

  onLabel1(text: string) {
    this.labelProjectTitle.innerHTML = text;
  }

  onProgress(progress: ProgressType) {
    this.progressBar.style.width = `${progress.progress}%`;
  }

  onRoomData(data: any) {
    // console.log('Hud: onRoomData:', data);
    switch(data.type as RoomTypes) {
      case RoomTypes.ANIMATIONS:
        this.menuAnimations.setData(data);
        break;
      case RoomTypes.EMOTIONS:
        this.menuEmotions.setData(data);
        break;
      case RoomTypes.GOALS:
        this.menuGoals.setData(data);
        break;
      default:
        break;
    }
  }

  onRoomMenu(type: RoomMenuType) {
    console.log('Hud: onRoomMenu:', type);
    if (this.parent.contains(this.menuAnimations.container))
      this.parent.removeChild(this.menuAnimations.container);
    if (this.parent.contains(this.menuEmotions.container))
      this.parent.removeChild(this.menuEmotions.container);
    if (this.parent.contains(this.menuGoals.container))
      this.parent.removeChild(this.menuGoals.container);
    switch(type) {
      case RoomMenuType.ANIMATIONS:
        if (!this.parent.contains(this.menuAnimations.container))
          this.parent.appendChild(this.menuAnimations.container);
        break;
      case RoomMenuType.EMOTIONS:
        if (!this.parent.contains(this.menuEmotions.container))
          this.parent.appendChild(this.menuEmotions.container);
        break;
      case RoomMenuType.GOALS:
        if (!this.parent.contains(this.menuGoals.container))
          this.parent.appendChild(this.menuGoals.container);
        break;
      default:
        break;
    }
    this.roomMenuTypeActive = type;
  }

  onScene(scene: string) {
    if (scene === SCENE_MAIN) {
      this.hudUpperLeft.removeChild(this.progressBar);
    }
  }

}

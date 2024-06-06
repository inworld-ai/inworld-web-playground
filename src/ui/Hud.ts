import './Hud.css';

import { EVENT_PROGRESS, ProgressType, resources } from '../resources/Resources';
import { log } from '../utils/log';
import ChatUI from './Chat';
import { EVENT_LABEL1, uiController } from './UIController';

export interface HudProps {
}

export default class Hud {

  chatUI: ChatUI;
  hudUpperLeft: HTMLDivElement;
  labelCopywrite: HTMLParagraphElement;
  labelProjectName: HTMLParagraphElement;
  labelProjectTitle: HTMLParagraphElement;
  parent: HTMLDivElement;
  progressBar: HTMLDivElement;

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

    this.chatUI = new ChatUI({ parent: this.parent });

    resources.addListener(EVENT_PROGRESS, this.onProgress);
    uiController.addListener(EVENT_LABEL1, this.onLabel1)

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

}

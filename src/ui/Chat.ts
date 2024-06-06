import './Chat.css';

import { EVENT_INWORLD_STATE, inworld, STATE_INIT, STATE_OPEN } from '../inworld/Inworld';

export interface ChatUIProps {
  parent: HTMLDivElement;
}

export default class ChatUI {

  chatInput: HTMLInputElement;
  closeButton: HTMLButtonElement;
  parent: HTMLDivElement;

  constructor(props: ChatUIProps) {

    this.parent = props.parent;

    this.chatInput = document.createElement('input');
    this.chatInput.id = "chatUIInput";
    this.chatInput.className = "chatUIInput inter-regular";
    this.chatInput.innerHTML = "Web Playgrounds 1.5.0";

    this.closeButton = document.createElement('button');
    this.closeButton.id = "closeButton";
    this.closeButton.className = "chatUICloseButton inter-regular";
    this.closeButton.innerHTML = "Close";

    this.onClickClose = this.onClickClose.bind(this);
    this.onInworldState = this.onInworldState.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onPressSend = this.onPressSend.bind(this);

    this.chatInput.addEventListener("keypress", this.onKeyPress);
    this.closeButton.addEventListener("mousedown", this.onClickClose);
    inworld.addListener(EVENT_INWORLD_STATE, this.onInworldState);

  }

  onClickClose() {
    inworld.close();
  }

  onInworldState(state: string) {
    if (state === STATE_INIT) {
      if (this.parent.contains(this.chatInput)) {
        this.parent.removeChild(this.chatInput);
        this.parent.removeChild(this.closeButton);
      }
    } else {
      if (!this.parent.contains(this.chatInput)) {
        this.parent.appendChild(this.chatInput);
        this.parent.appendChild(this.closeButton);
      }
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onPressSend();
    }
  }

  onPressSend() {
    if (this.chatInput.value !== '' && inworld.state === STATE_OPEN) {
      inworld.sendText(this.chatInput.value);
      this.chatInput.value = '';
    }
  }

}

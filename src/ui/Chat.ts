import './Chat.css';

import { EVENT_INWORLD_STATE, inworld, STATE_INIT, STATE_OPEN } from '../inworld/Inworld';

export interface ChatUIProps {
  parent: HTMLDivElement;
}

export default class ChatUI {

  chatContainer: HTMLDivElement;
  buttonClose: HTMLButtonElement;
  buttonEnter: HTMLButtonElement;
  buttonPTT: HTMLButtonElement;
  buttonRecord: HTMLButtonElement;
  textInput: HTMLInputElement;
  parent: HTMLDivElement;

  constructor(props: ChatUIProps) {

    this.parent = props.parent;

    this.chatContainer = document.createElement('div');
    this.chatContainer.id = "chatUI";
    this.chatContainer.className = "chatUI";

    this.textInput = document.createElement('input');
    this.textInput.id = "chatUITextInput";
    this.textInput.className = "chatUIInput chatUIRound inter-regular";

    this.buttonEnter = document.createElement('button');
    this.buttonEnter.id = "chatUIButtonEnter";
    this.buttonEnter.className = "chatUIButtonEnter chatUIRound chatUIButton inter-regular";
    this.buttonEnter.innerHTML = "<embed src=\"/assets/v4.0/icons/return.svg\" />";

    this.buttonRecord = document.createElement('button');
    this.buttonRecord.id = "chatUIButtonRecord";
    this.buttonRecord.className = "chatUIButtonRecord chatUIRound chatUIButton inter-regular";
    this.buttonRecord.innerHTML = "<embed src=\"/assets/v4.0/icons/microphone-outline.svg\" />";
    
    this.buttonPTT = document.createElement('button');
    this.buttonPTT.id = "chatUIButtonPTT";
    this.buttonPTT.className = "chatUIButtonPTT chatUIRound chatUIButton inter-regular";
    this.buttonPTT.innerHTML = "<embed src=\"/assets/v4.0/icons/microphone-settings.svg\" />";

    this.buttonClose = document.createElement('button');
    this.buttonClose.id = "chatUIButtonClose";
    this.buttonClose.className = "chatUIButtonClose chatUIRound chatUIButton inter-regular";
    this.buttonClose.innerHTML = "X Close";

    this.chatContainer.appendChild(this.textInput);
    this.chatContainer.appendChild(this.buttonEnter);
    this.chatContainer.appendChild(this.buttonRecord);
    this.chatContainer.appendChild(this.buttonPTT);
    this.chatContainer.appendChild(this.buttonClose);

    this.onClickClose = this.onClickClose.bind(this);
    this.onClickPTT = this.onClickPTT.bind(this);
    this.onClickRecord = this.onClickRecord.bind(this);
    this.onInworldState = this.onInworldState.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onPressSend = this.onPressSend.bind(this);

    this.textInput.addEventListener("keypress", this.onKeyPress);
    this.buttonEnter.addEventListener("mousedown", this.onPressSend);
    this.buttonRecord.addEventListener("mousedown", this.onClickRecord);
    this.buttonPTT.addEventListener("mousedown", this.onClickPTT);
    this.buttonClose.addEventListener("mousedown", this.onClickClose);

    inworld.addListener(EVENT_INWORLD_STATE, this.onInworldState);


    

    this.parent.appendChild(this.chatContainer);

  }

  onClickClose() {
    inworld.close();
  }

  onClickPTT() {
    console.log('Click PTT');
  }

  onClickRecord() {
    console.log('Click Record');
  }

  onInworldState(state: string) {

    if (state === STATE_INIT) {
      if (this.parent.contains(this.chatContainer)) {
        this.parent.removeChild(this.chatContainer);
      }
    } else {
      if (!this.parent.contains(this.chatContainer)) {
        this.parent.appendChild(this.chatContainer);
      }
    }

  }

  onKeyPress(event: KeyboardEvent) {

    if (event.key === 'Enter') {
      this.onPressSend();
    }

  }

  onPressSend() {

    if (this.textInput.value !== '' && inworld.state === STATE_OPEN) {
      inworld.sendText(this.textInput.value);
      this.textInput.value = '';
    }

  }

}

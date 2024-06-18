import './Chat.css';

import {
    EVENT_INWORLD_STATE, EVENT_ISRECORDING, inworld, STATE_INIT, STATE_OPEN
} from '../inworld/Inworld';
import { Config } from '../utils/config';

export interface ChatUIProps {
  parent: HTMLDivElement;
}

export const ICON_RETURN_URI = "/icons/return.png";
export const ICON_RECORD_URI = "/icons/microphone-outline.png";
export const ICON_PTT_URI = "/icons/microphone-settings.png";

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
    this.textInput.placeholder = "Enter your message";

    this.buttonEnter = document.createElement('button');
    this.buttonEnter.id = "chatUIButtonEnter";
    this.buttonEnter.className = "chatUIButtonEnter chatUIRound chatUIButton inter-regular";
    this.buttonEnter.innerHTML = `<img src=\"${Config.AssetBaseURI}${ICON_RETURN_URI}\" cross-origin=\"anonymous\" />`;

    this.buttonRecord = document.createElement('button');
    this.buttonRecord.id = "chatUIButtonRecord";
    this.buttonRecord.className = "chatUIButtonRecord chatUIRound chatUIButton inter-regular";
    this.buttonRecord.innerHTML = `<img src=\"${Config.AssetBaseURI}${ICON_RECORD_URI}\" cross-origin=\"anonymous\" />`;
    
    this.buttonPTT = document.createElement('button');
    this.buttonPTT.id = "chatUIButtonPTT";
    this.buttonPTT.className = "chatUIButtonPTT chatUIRound chatUIButton inter-regular";
    this.buttonPTT.innerHTML = `<img src=\"${Config.AssetBaseURI}${ICON_PTT_URI}\" cross-origin=\"anonymous\" />`;

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
    this.onClickPTTOn = this.onClickPTTOn.bind(this);
    this.onClickPTTOff = this.onClickPTTOff.bind(this);
    this.onClickRecord = this.onClickRecord.bind(this);
    this.onInworldRecording = this.onInworldRecording.bind(this);
    this.onInworldState = this.onInworldState.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onPressSend = this.onPressSend.bind(this);

    this.textInput.addEventListener("keypress", this.onKeyPress);
    this.buttonEnter.addEventListener("mousedown", this.onPressSend);
    this.buttonRecord.addEventListener("mousedown", this.onClickRecord);
    this.buttonPTT.addEventListener("mousedown", this.onClickPTTOn);
    this.buttonPTT.addEventListener("mouseup", this.onClickPTTOff);
    this.buttonClose.addEventListener("mousedown", this.onClickClose);

    inworld.addListener(EVENT_INWORLD_STATE, this.onInworldState);
    inworld.addListener(EVENT_ISRECORDING, this.onInworldRecording);

    // TODO CAN DELETE USED TO PROTOTYPE
    // this.parent.appendChild(this.chatContainer);

  }

  onClickClose() {
    inworld.close();
  }

  onClickPTTOn() {
    console.log('onClickPTTOn');
    inworld.startRecording();
  }

  onClickPTTOff() {
    console.log('onClickPTTOff');
    inworld.stopRecording();
  }

  onClickRecord() {
    console.log('Click Record');
    if(!inworld.isRecording) {
      inworld.startRecording();
    } else {
      inworld.stopRecording();
    }
  }

  onInworldRecording(state: string) {
    if (state) {
      this.buttonRecord.classList.add('chatUIButtonActive');
    } else {
      this.buttonRecord.classList.remove('chatUIButtonActive');
    }
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


import {
    AdditionalPhonemeInfo, Character, EmotionEvent, HistoryItem, InworldConnectionService,
    InworldPacket, TriggerEvent, TriggerParameter
} from '@inworld/web-core';

import EventDispatcher from '../events/EventDispatcher';
import { uiController } from '../ui/UIController';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import { InworldService } from './InworldService';

const EVENT_CHARACTER = "event_character";
const EVENT_CHARACTERS = "event_characters";
const EVENT_CHATTING = "event_chatting";
const EVENT_CHAT_HISTORY = "event_chat_history";
const EVENT_CONNECTION = "event_connection";
const EVENT_EMOTION = "event_emotion";
const EVENT_INWORLD_STATE = "event_inworld_state";
const EVENT_ISRECORDING = "event_isrecording";
const EVENT_PHONEMES_HISTORY = "event_phonemes_history";
const EVENT_PREVCHAT_HISTORY = "event_prevchat_history";
const EVENT_TRIGGER = "event_trigger";

const STATE_ACTIVE = 'state_active';
const STATE_ERROR = 'state_error';
const STATE_INIT = 'state_init';
const STATE_OPENING = 'state_opening';
const STATE_OPEN = 'state_open';

export type OpenConnectionType = {
  name: string;
  characterId?: string;
  previousState?: string;
};

class Inworld extends EventDispatcher {

  character: Character | undefined;
  characters: Character[];
  chatHistory: HistoryItem[];
  chatting: boolean;
  connection: InworldConnectionService | undefined;
  emotionEvent: EmotionEvent | undefined;
  hasPlayedWorkaroundSound: boolean;
  isRecording: boolean;
  name: string | undefined;
  phonemes: AdditionalPhonemeInfo[];
  prevChatHistory: HistoryItem[];
  state: string;
  triggerEvent: TriggerEvent | undefined;

  constructor() {
    super();
    this.characters = [];
    this.chatHistory = [];
    this.chatting = false;
    this.isRecording = false;
    this.hasPlayedWorkaroundSound = false;
    this.phonemes = [];
    this.prevChatHistory = [];
    this.state = "";
    this.onHistoryChange = this.onHistoryChange.bind(this);
    this.setState(STATE_INIT);
  }


  async close() {
    log('InworldProvider: close');
    // Disable flags
    this.setChatting(false);

    // Stop audio playing and capturing
    this.connection?.player?.stop();
    this.connection?.player?.clear();
    this.connection?.recorder?.stop();

    // Clear collections
    this.setChatHistory([]);
    this.setPrevChatHistory([]);

    // Close connection and clear connection data
    this.connection?.close();
    this.setConnection(undefined);
    this.setCharacter(undefined);
    this.setCharacters([]);

    this.setPhonemes([]);

    this.name = '';
    this.setState(STATE_INIT);
  }

  async open(props: OpenConnectionType) {
    log('InworldProvider: open');
    this.setState(STATE_OPENING);
    this.name = props.name;
    this.setChatHistory([]);
    this.setChatting(true);

    const service = new InworldService({
      onHistoryChange: this.onHistoryChange,
      capabilities: {
        phonemes: true,
        interruptions: true,
        emotions: true,
        narratedActions: true,
      },
      sceneName: Config.Inworld.SceneId,
      playerName: 'Friend',
      onPhoneme: (phonemes: AdditionalPhonemeInfo[]) => {
        this.setPhonemes(phonemes);
      },
      onReady: () => {
        log('Active!');
        this.setState(STATE_ACTIVE);
      },
      onDisconnect: () => {
        log('Disconnect!');
        this.setState(STATE_OPEN);
      },
      onMessage: (inworldPacket: InworldPacket) => {
        if (
          inworldPacket.isEmotion() &&
          inworldPacket.packetId?.interactionId
        ) {
          this.setEmotionEvent(inworldPacket.emotions);
        } else if (
          inworldPacket.isTrigger() &&
          inworldPacket.packetId?.interactionId
        ) {
          this.setTriggerEvent(inworldPacket.trigger);
        }
      },
      onError: (err: Error) => {
        log('InworldProvider: onError', err);
      },
    });
    log(
      'InworldProvider - Opening Connection',
      props.characterId ? props.characterId : Config.Inworld.CharacterID,
    );
    const characters = await service.connection.getCharacters();
    const character = characters.find(
      (c: Character) =>
        c.resourceName ===
        (props.characterId ? props.characterId : Config.Inworld.CharacterID),
    );

    log('InworldProvider - Getting Scene Characters');
    if (character) {
      service.connection.setCurrentCharacter(character);
    }

    this.setConnection(service.connection);
    this.setCharacter(character);
    this.setCharacters(characters);
    this.setState(STATE_OPEN);
    log('InworldProvider - Connected');
  }

  playWorkaroundSound() {
    // Workaround for browsers with restrictive auto-play policies
    if (this.connection) {
      this.connection?.player.playWorkaroundSound();
      this.hasPlayedWorkaroundSound = true;
    }
  }

  sendText(text: string) {
    if (text && this.connection) {
      !this.hasPlayedWorkaroundSound && this.playWorkaroundSound();
      this.connection.sendText(text);
    } else {
      throw new Error(
        'Inworld - Error sendText before connection was open.',
      );
    }
  }

  sendTrigger(trigger: string, parameters?: TriggerParameter[] | undefined) {
    if (trigger && this.connection) {
      this.connection.sendTrigger(trigger, parameters);
    } else {
      throw new Error(
        'Inworld - Error sendTrigger before connection was open.',
      );
    }
  }


  setCharacter(character: Character | undefined) {
    if (character !== this.character) {
      this.character = character;
      this.dispatch(EVENT_CHARACTER, character);
    }
  }

  setCharacters(characters: Character[]) {
    if (characters !== this.characters) {
      this.characters = characters;
      this.dispatch(EVENT_CHARACTERS, characters);
    }
  }

  setConnection(connection: InworldConnectionService | undefined) {
    if (connection !== this.connection) {
      this.connection = connection;
      this.dispatch(EVENT_CONNECTION, connection);
    }
  }

  setChatting(chatting: boolean) {
    if (chatting !== this.chatting) {
      this.chatting = chatting;
      this.dispatch(EVENT_CHATTING, chatting);
    }
  }

  setChatHistory(history: HistoryItem[]) {
    if (history !== this.chatHistory) {
      this.chatHistory = history;
      this.dispatch(EVENT_CHAT_HISTORY, history);
    }
  }

  setEmotionEvent(emotionEvent: EmotionEvent | undefined) {
    if (emotionEvent !== this.emotionEvent) {
      this.emotionEvent = emotionEvent;
      this.dispatch(EVENT_EMOTION, emotionEvent);
    }
  }

  setIsRecording(isRecording: boolean) {
    if (isRecording !== this.isRecording) {
      this.isRecording = isRecording;
      this.dispatch(EVENT_ISRECORDING, isRecording);
    }
  }
  setPhonemes(phonemes: AdditionalPhonemeInfo[]) {
    if (phonemes !== this.phonemes) {
      this.phonemes = phonemes;
      this.dispatch(EVENT_PHONEMES_HISTORY, phonemes);
    }
  }

  setPrevChatHistory(history: HistoryItem[]) {
    if (history !== this.prevChatHistory) {
      this.prevChatHistory = history;
      this.dispatch(EVENT_PREVCHAT_HISTORY, history);
    }
  }

  setState(state: string) {
    if (state !== this.state) {
      uiController.setInworldState(state);
      this.state = state;
      this.dispatch(EVENT_INWORLD_STATE, this.state);
    }
  }

  setTriggerEvent(triggerEvent: TriggerEvent | undefined) {
    if (triggerEvent !== this.triggerEvent) {
      this.triggerEvent = triggerEvent;
      this.dispatch(EVENT_TRIGGER, triggerEvent);
    }
  }

  async startRecording() {
    try {
      if (this.connection && !this.isRecording) {
        this.setIsRecording(true);
        this.connection.sendAudioSessionStart();
        await this.connection.recorder.start();
      }
    } catch (e) {
      console.error(e);
    }
  }

  stopRecording() {
    if (this.connection && this.isRecording) {
      this.connection.recorder.stop();
      this.connection.sendAudioSessionEnd();
      this.setIsRecording(false);
    }
  }

  onHistoryChange(history: HistoryItem[]) {
    this.setChatHistory(history);
  }

}

export {
  EVENT_CHARACTER,
  EVENT_CHARACTERS,
  EVENT_CHATTING,
  EVENT_CHAT_HISTORY,
  EVENT_CONNECTION,
  EVENT_EMOTION,
  EVENT_INWORLD_STATE,
  EVENT_ISRECORDING,
  EVENT_PHONEMES_HISTORY,
  EVENT_PREVCHAT_HISTORY,
  EVENT_TRIGGER,
  STATE_ACTIVE,
  STATE_ERROR,
  STATE_INIT,
  STATE_OPENING,
  STATE_OPEN
};

export const inworld = new Inworld();

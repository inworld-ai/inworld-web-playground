import {
  AdditionalPhonemeInfo,
  Character,
  EmotionEvent,
  HistoryItem,
  InworldConnectionService,
  InworldPacket,
  TriggerEvent,
  TriggerParameter,
} from '@inworld/web-core';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { InworldService } from '../inworld/InworldService';
import { Cursors } from '../types/cursors';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import { useUI } from './UIProvider';

export const STATE_ACTIVE = 'state_active';
export const STATE_ERROR = 'state_error';
export const STATE_INIT = 'state_init';
export const STATE_OPENING = 'state_opening';
export const STATE_OPEN = 'state_open';

interface InworldContextValues {
  close: { (): void } | null;
  character: Character | undefined;
  characters: Character[];
  chatHistory: HistoryItem[];
  chatting: boolean;
  connection: InworldConnectionService | undefined;
  emotionEvent: EmotionEvent | undefined;
  isRecording: boolean;
  name: string | undefined;
  open: { (props: OpenConnectionType): void } | null;
  phonemes: AdditionalPhonemeInfo[];
  prevChatHistory: HistoryItem[];
  sendText: { (text: string): void } | null;
  sendTrigger: {
    (text: string, parameters?: TriggerParameter[] | undefined): void;
  } | null;
  startRecording: { (): void } | null;
  stopRecording: { (): void } | null;
  state: string;
  triggerEvent: TriggerEvent | undefined;
}

type OpenConnectionType = {
  name: string;
  characterId?: string;
  previousState?: string;
};

const InworldContext = createContext<InworldContextValues>({
  close: null,
  character: undefined,
  characters: [],
  chatHistory: [],
  chatting: false,
  connection: undefined,
  emotionEvent: undefined,
  isRecording: false,
  name: '',
  open: null,
  phonemes: [],
  prevChatHistory: [],
  sendText: null,
  sendTrigger: null,
  startRecording: null,
  stopRecording: null,
  state: STATE_INIT,
  triggerEvent: undefined,
});

const useInworld = () => useContext(InworldContext);

function InworldProvider({ children }: PropsWithChildren) {
  log('InworldProvider Init');
  const [connection, setConnection] = useState<
    InworldConnectionService | undefined
  >();
  const [character, setCharacter] = useState<Character | undefined>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [chatting, setChatting] = useState(false);
  const [emotionEvent, setEmotionEvent] = useState<EmotionEvent>();
  const [hasPlayedWorkaroundSound, setHasPlayedWorkaroundSound] =
    useState(false);
  const [name, setName] = useState<string>();
  const [phonemes, setPhonemes] = useState<AdditionalPhonemeInfo[]>([]);
  const [prevChatHistory, setPrevChatHistory] = useState<HistoryItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [state, setState] = useState<string>(STATE_INIT);
  const [triggerEvent, setTriggerEvent] = useState<TriggerEvent>();

  const { setCursor } = useUI();

  useEffect(() => {
    log('InworldProvider: state', state);
    if (setCursor) {
      if (state === STATE_OPENING) {
        setCursor(Cursors.Wait);
      } else {
        setCursor(Cursors.Auto);
      }
    }
  }, [state]);

  const onHistoryChange = useCallback((history: HistoryItem[]) => {
    setChatHistory(history);
  }, []);

  const close = useCallback(async () => {
    // Disable flags
    setChatting(false);

    // Stop audio playing and capturing
    connection?.player?.stop();
    connection?.player?.clear();
    connection?.recorder?.stop();

    // Clear collections
    setChatHistory([]);
    setPrevChatHistory([]);

    // Close connection and clear connection data
    connection?.close();
    setConnection(undefined);
    setCharacter(undefined);
    setCharacters([]);

    setPhonemes([]);

    setName('');
    setState(STATE_INIT);
  }, [connection]);

  const open = useCallback(
    async (props: OpenConnectionType) => {
      log('InworldProvider: open');
      setState(STATE_OPENING);
      setName(props.name);
      setChatHistory([]);
      setChatting(true);

      const service = new InworldService({
        onHistoryChange,
        capabilities: {
          phonemes: true,
          interruptions: true,
          emotions: true,
          narratedActions: true,
        },
        sceneName: Config.INWORLD.sceneId,
        playerName: 'Friend',
        onPhoneme: (phonemes: AdditionalPhonemeInfo[]) => {
          setPhonemes(phonemes);
        },
        onReady: () => {
          log('Active!');
          setState(STATE_ACTIVE);
        },
        onDisconnect: () => {
          log('Disconnect!');
          setState(STATE_OPEN);
        },
        onMessage: (inworldPacket: InworldPacket) => {
          log(inworldPacket);
          if (
            inworldPacket.isEmotion() &&
            inworldPacket.packetId?.interactionId
          ) {
            setEmotionEvent(inworldPacket.emotions);
          } else if (
            inworldPacket.isTrigger() &&
            inworldPacket.packetId?.interactionId
          ) {
            setTriggerEvent(inworldPacket.trigger);
          }
        },
        onError: (err: Error) => {
          log('InworldProvider: onError', err);
        },
      });
      log('InworldProvider - Opening Connection');
      const characters = await service.connection.getCharacters();
      const character = characters.find(
        (c: Character) =>
          c.resourceName ===
          (props.characterId ? props.characterId : Config.INWORLD.characterId),
      );

      log('InworldProvider - Getting Scene Characters');
      if (character) {
        service.connection.setCurrentCharacter(character);
      }

      setConnection(service.connection);
      setCharacter(character);
      setCharacters(characters);
      setState(STATE_OPEN);
      log('InworldProvider - Connected');
    },
    [chatHistory, connection, onHistoryChange, prevChatHistory],
  );

  const playWorkaroundSound = useCallback(() => {
    // Workaround for browsers with restrictive auto-play policies
    if (connection) {
      connection?.player.playWorkaroundSound();
      setHasPlayedWorkaroundSound(true);
    }
  }, [connection, setHasPlayedWorkaroundSound]);

  const sendText = useCallback(
    (text: string) => {
      if (text && connection) {
        !hasPlayedWorkaroundSound && playWorkaroundSound();
        connection.sendText(text);
      } else {
        throw new Error(
          'Innequin - Error sendText before connection was open.',
        );
      }
    },
    [connection, hasPlayedWorkaroundSound, playWorkaroundSound],
  );

  const sendTrigger = useCallback(
    (trigger: string, parameters?: TriggerParameter[] | undefined) => {
      if (trigger && connection) {
        connection.sendTrigger(trigger, parameters);
      } else {
        throw new Error(
          'Innequin - Error sendTrigger before connection was open.',
        );
      }
    },
    [connection, hasPlayedWorkaroundSound, playWorkaroundSound],
  );

  const startRecording = useCallback(async () => {
    try {
      if (connection && !isRecording) {
        setIsRecording(true);
        connection.sendAudioSessionStart();
        await connection.recorder.start();
      }
    } catch (e) {
      console.error(e);
    }
  }, [connection, isRecording]);

  const stopRecording = useCallback(() => {
    if (connection && isRecording) {
      connection.recorder.stop();
      connection.sendAudioSessionEnd();
      setIsRecording(false);
    }
  }, [connection, isRecording]);

  return (
    <InworldContext.Provider
      value={{
        chatting,
        character,
        characters,
        chatHistory,
        close,
        connection,
        emotionEvent,
        isRecording,
        name,
        open,
        phonemes,
        prevChatHistory,
        sendText,
        sendTrigger,
        startRecording,
        stopRecording,
        state,
        triggerEvent,
      }}
    >
      {children}
    </InworldContext.Provider>
  );
}

export { InworldProvider, useInworld };
export type { OpenConnectionType };

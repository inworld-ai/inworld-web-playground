import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { log } from '../utils/log';
import { STATE_ACTIVE, STATE_OPEN } from './InworldProvider';
import { useUI } from './UIProvider';

interface RoomsContextValues {
  loading: boolean;
  loadingPercent: number;
  room: string;
  state: string;
  uiLabel: string;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  setLoadingPercent: Dispatch<SetStateAction<number>> | null;
  setRoom: Dispatch<SetStateAction<string>> | null;
  setState: Dispatch<SetStateAction<string>> | null;
  setUILabel: Dispatch<SetStateAction<string>> | null;
}

const ROOM_LOBBY = 'room_lobby';
const ROOM_ANIMATIONS = 'room_animation';
const ROOM_AVATARS = 'room_avatars';
const ROOM_EMOTIONS = 'room_emotions';
const ROOM_GOALS = 'room_goals';

const STATE_INIT = 'state_init';
const STATE_LOADING = 'state_loading';
const STATE_RUNNING = 'state_running';

const RoomsContext = React.createContext<RoomsContextValues>({
  loading: false,
  loadingPercent: 0,
  room: ROOM_LOBBY,
  state: STATE_INIT,
  uiLabel: '',
  setLoading: null,
  setLoadingPercent: null,
  setRoom: null,
  setState: null,
  setUILabel: null,
});

const useRooms = () => React.useContext(RoomsContext);

function RoomsProvider({ children }: PropsWithChildren) {
  log('RoomsProvider Init');

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [room, setRoom] = useState(ROOM_LOBBY);
  const [state, setState] = useState(STATE_INIT);
  const [uiLabel, setUILabel] = useState('');

  const { setLabel1 } = useUI();

  useEffect(() => {
    log('Room: ', room);
    if (setLabel1) setLabel1('');
  }, [room]);

  useEffect(() => {
    if (state === STATE_OPEN || state === STATE_ACTIVE) {
      close();
    }
  }, [room]);

  return (
    <RoomsContext.Provider
      value={{
        loading,
        loadingPercent,
        room,
        state,
        uiLabel,
        setLoading,
        setLoadingPercent,
        setRoom,
        setState,
        setUILabel,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

export {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  RoomsProvider,
  STATE_INIT,
  STATE_LOADING,
  STATE_RUNNING,
  useRooms,
};

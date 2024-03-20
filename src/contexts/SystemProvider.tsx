import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

import { log } from '../utils/log';

interface SystemContextValues {
  loading: boolean;
  loadingPercent: number;
  microphoneMode: MicrophoneModes;
  stateSystem: string;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  setLoadingPercent: Dispatch<SetStateAction<number>> | null;
  setMicrophoneMode: Dispatch<SetStateAction<MicrophoneModes>> | null;
  setStateSystem: Dispatch<SetStateAction<string>> | null;
}

export enum MicrophoneModes {
  NORMAL,
  PTT,
}

const STATE_ERROR = 'state_error';
const STATE_INIT = 'state_init';
const STATE_PAUSED = 'state_paused';
const STATE_RUNNING = 'state_running';

const SystemContext = React.createContext<SystemContextValues>({
  loading: false,
  loadingPercent: 0,
  microphoneMode: MicrophoneModes.NORMAL,
  stateSystem: STATE_INIT,
  setLoading: null,
  setLoadingPercent: null,
  setMicrophoneMode: null,
  setStateSystem: null,
});

const useSystem = () => React.useContext(SystemContext);

function SystemProvider({ children }: PropsWithChildren) {
  log('SystemProvider Init');

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [microphoneMode, setMicrophoneMode] = useState<MicrophoneModes>(
    MicrophoneModes.NORMAL,
  );
  const [stateSystem, setStateSystem] = useState(STATE_INIT);

  return (
    <SystemContext.Provider
      value={{
        loading,
        loadingPercent,
        microphoneMode,
        stateSystem,
        setLoading,
        setLoadingPercent,
        setMicrophoneMode,
        setStateSystem,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export {
  STATE_ERROR,
  STATE_INIT,
  STATE_PAUSED,
  STATE_RUNNING,
  SystemProvider,
  useSystem,
};

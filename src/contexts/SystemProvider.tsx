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
  stateSystem: string;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  setLoadingPercent: Dispatch<SetStateAction<number>> | null;
  setStateSystem: Dispatch<SetStateAction<string>> | null;
}

const STATE_ERROR = 'state_error';
const STATE_INIT = 'state_init';
const STATE_PAUSED = 'state_paused';
const STATE_RUNNING = 'state_running';

const SystemContext = React.createContext<SystemContextValues>({
  loading: false,
  loadingPercent: 0,
  stateSystem: STATE_INIT,
  setLoading: null,
  setLoadingPercent: null,
  setStateSystem: null,
});

const useSystem = () => React.useContext(SystemContext);

function SystemProvider({ children }: PropsWithChildren) {
  log('SystemProvider Init');

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [stateSystem, setStateSystem] = useState(STATE_INIT);

  return (
    <SystemContext.Provider
      value={{
        loading,
        loadingPercent,
        stateSystem,
        setLoading,
        setLoadingPercent,
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

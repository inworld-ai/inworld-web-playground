import React, { Dispatch, SetStateAction, useState } from 'react';

interface SystemContextValues {
  // inputEnabled: boolean;
  loading: boolean;
  loadingPercent: number;
  stateSystem: string;
  // setInputEnabled: Dispatch<SetStateAction<boolean>> | null;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  setLoadingPercent: Dispatch<SetStateAction<number>> | null;
  setStateSystem: Dispatch<SetStateAction<string>> | null;
}

const STATE_ERROR = 'state_error';
const STATE_INIT = 'state_init';
const STATE_PAUSED = 'state_paused';
const STATE_RUNNING = 'state_running';

const SystemContext = React.createContext<SystemContextValues>({
  // inputEnabled: true,
  loading: false,
  loadingPercent: 0,
  stateSystem: STATE_INIT,
  // setInputEnabled: null,
  setLoading: null,
  setLoadingPercent: null,
  setStateSystem: null,
});

const useSystem = () => React.useContext(SystemContext);

function SystemProvider({ children, ...props }: any) {
  // console.log("SystemProvider Init");

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  // const [inputEnabled, setInputEnabled] = useState<boolean>(true);
  const [stateSystem, setStateSystem] = useState(STATE_INIT);

  return (
    <SystemContext.Provider
      value={{
        // inputEnabled,
        loading,
        loadingPercent,
        stateSystem,
        // setInputEnabled,
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

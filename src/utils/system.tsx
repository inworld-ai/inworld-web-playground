import React, { useState, SetStateAction, Dispatch } from "react";

interface SystemContextValues {
  loading: boolean;
  loadingPercent: number;
  state: string;
  setLoading: Dispatch<SetStateAction<boolean>> | null;
  setLoadingPercent: Dispatch<SetStateAction<number>> | null;
  setState: Dispatch<SetStateAction<string>> | null;
}

const STATE_ERROR: string = "state_error";
const STATE_INIT: string = "state_init";
const STATE_PAUSED: string = "state_paused";
const STATE_RUNNING: string = "state_running";

const SystemContext = React.createContext<SystemContextValues>({
  loading: false,
  loadingPercent: 0,
  state: STATE_INIT,
  setLoading: null,
  setLoadingPercent: null,
  setState: null,
});

const useSystem = () => React.useContext(SystemContext);

function SystemProvider({ children, ...props }: any) {
  // console.log("SystemProvider Init");

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [state, setState] = useState(STATE_INIT);

  return (
    <SystemContext.Provider
      value={{
        loading,
        loadingPercent,
        state,
        setLoading,
        setLoadingPercent,
        setState,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export {
  SystemProvider,
  useSystem,
  STATE_ERROR,
  STATE_INIT,
  STATE_PAUSED,
  STATE_RUNNING,
};

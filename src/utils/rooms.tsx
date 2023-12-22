import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

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

const ROOM_LOBBY: string = "room_lobby";
const ROOM_ANIMATIONS: string = "room_animation";
const ROOM_AVATARS: string = "room_avatars";
const ROOM_EMOTIONS: string = "room_emotions";

const STATE_INIT: string = "state_init";
const STATE_LOADING: string = "state_loading";
const STATE_RUNNING: string = "state_running";

const RoomsContext = React.createContext<RoomsContextValues>({
  loading: false,
  loadingPercent: 0,
  room: ROOM_LOBBY,
  state: STATE_INIT,
  uiLabel: "",
  setLoading: null,
  setLoadingPercent: null,
  setRoom: null,
  setState: null,
  setUILabel: null,
});

const useRooms = () => React.useContext(RoomsContext);

function RoomsProvider({ children, ...props }: any) {
  // console.log("RoomsProvider Init");

  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [room, setRoom] = useState(ROOM_LOBBY);
  const [state, setState] = useState(STATE_INIT);
  const [uiLabel, setUILabel] = useState("");

  useEffect(() => {
    console.log("Room: ", room);
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
  RoomsProvider,
  useRooms,
  ROOM_LOBBY,
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  STATE_INIT,
  STATE_LOADING,
  STATE_RUNNING,
};

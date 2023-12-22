import { useEffect, useState } from "react";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

import { useRooms } from "../utils/rooms";

export type RoomBaseProps = {
  name: string;
};

function RoomBase(props: any) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { room, setRoom, setUILabel } = useRooms();

  useEffect(() => {
    console.log("Room init:", props.name);
    if (setUILabel) setUILabel(props.name);
    return () => {
      console.log("Room destroy:", props.name);
    };
  }, []);

  return <>{props.children}</>;
}

export default RoomBase;

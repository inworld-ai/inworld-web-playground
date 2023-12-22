import { useEffect, useState } from "react";
import { Euler, Vector3 } from "three";

import ModelInnequin from "../models/ModelInnequin";
import { useRooms } from "../utils/rooms";
import RoomBase from "./RoomBase";

export type RoomLobbyProps = {
  name: string;
  isLoaded: boolean;
};

function RoomLobby(props: RoomLobbyProps) {
  const { room, setRoom } = useRooms();

  return (
    <>
      <RoomBase name={props.name}>
        <group
          name="GroupLobby"
          position={new Vector3(0, 0, 0)}
          rotation={new Euler(0, 0, 0)}
        >
          <ModelInnequin
            name="InnequinLobby"
            isLoaded={props.isLoaded}
            position={new Vector3(0, 0, -5)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomLobby;

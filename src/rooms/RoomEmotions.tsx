import { useEffect, useState } from "react";
import { Euler, Vector3 } from "three";

import ModelInnequin from "../models/ModelInnequin";
import ModelRPM from "../models/ModelRPM";
import { useRooms } from "../utils/rooms";
import RoomBase from "./RoomBase";

export type RoomEmotionsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomEmotions(props: RoomEmotionsProps) {
  const { room, setRoom } = useRooms();

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupEmotions">
          <ModelInnequin
            name="InnequinEmotions"
            skinName="DOTS"
            isLoaded={props.isLoaded}
            position={new Vector3(-2, 0, -5)}
            rotation={new Euler(0, Math.PI / 8, 0)}
          />
          <ModelRPM
            name="RPMEmotions"
            isLoaded={props.isLoaded}
            position={new Vector3(2, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomEmotions;

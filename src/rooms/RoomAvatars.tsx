import { useEffect, useState } from "react";
import { Euler, Vector3 } from "three";

import ModelInnequin from "../models/ModelInnequin";
import ModelRPM from "../models/ModelRPM";
import { useRooms } from "../utils/rooms";
import RoomBase from "./RoomBase";

export type RoomAvatarsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomAvatars(props: RoomAvatarsProps) {
  const { room, setRoom } = useRooms();

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupAvatars">
          <ModelInnequin
            name="InnequinAvatars"
            skinName="SCIFI"
            isLoaded={props.isLoaded}
            position={new Vector3(2, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
          />
          <ModelInnequin
            name="InnequinAvatars"
            skinName="CAMO"
            isLoaded={props.isLoaded}
            position={new Vector3(0, 0, -6)}
            rotation={new Euler(0, 0, 0)}
          />
          <ModelRPM
            name="RPMAvatars"
            isLoaded={props.isLoaded}
            position={new Vector3(-2, 0, -5)}
            rotation={new Euler(0, Math.PI / 8, 0)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomAvatars;

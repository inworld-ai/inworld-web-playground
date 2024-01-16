import { useEffect } from 'react';
import { Euler, Vector3 } from 'three';

import { STATE_OPEN, useInworld } from '../contexts/InworldProvider';
import ModelInnequin from '../models/ModelInnequin';
import ModelRPM from '../models/ModelRPM';
import ModelSphere from '../models/ModelSphere';
import RoomBase from './RoomBase';

export type RoomAvatarsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomAvatars(props: RoomAvatarsProps) {
  const CHARACTER_ID =
    "workspaces/inworld-playground/characters/avatar_bot_-_innequin";
  const NAME_INNEQUIN = "InnequinAvatars1";
  const NAME_SPHERE = "SphereAvatars";
  const NAME_RPM = "RPMAvatars";
  const SKIN_INNEQUIN = "SCIFI";
  const TRIGGER_WELCOME = "greet_player";

  const { sendTrigger, state } = useInworld();

  useEffect(() => {
    if (state === STATE_OPEN) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state]);

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupAvatars">
          <ModelInnequin
            name={NAME_INNEQUIN}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN}
            isLoaded={props.isLoaded}
            position={new Vector3(2, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
          />
          <ModelSphere
            name={NAME_SPHERE}
            characterId={CHARACTER_ID}
            isLoaded={props.isLoaded}
            position={new Vector3(0, 1, -6)}
            rotation={new Euler(0, 0, 0)}
          />
          <ModelRPM
            name={NAME_RPM}
            characterId={CHARACTER_ID}
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

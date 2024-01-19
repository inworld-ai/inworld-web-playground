import { useEffect } from 'react';
import { Euler, Vector3 } from 'three';

import { STATE_OPEN, useInworld } from '../contexts/InworldProvider';
import ModelInnequin from '../models/ModelInnequin';
import RoomBase from './RoomBase';

export type RoomLobbyProps = {
  name: string;
  isLoaded: boolean;
};

function RoomLobby(props: RoomLobbyProps) {
  const CHARACTER_ID =
    'workspaces/inworld-playground/characters/lobby_bot_-_innequin';
  const NAME_INNEQUIN = 'InnequinLobby';
  const TRIGGER_WELCOME = 'greet_player';

  const { sendTrigger, state } = useInworld();

  useEffect(() => {
    if (state === STATE_OPEN && sendTrigger) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state, sendTrigger]);

  return (
    <>
      <RoomBase name={props.name}>
        <group
          name="GroupLobby"
          position={new Vector3(0, 0, 0)}
          rotation={new Euler(0, 0, 0)}
        >
          <ModelInnequin
            name={NAME_INNEQUIN}
            characterId={CHARACTER_ID}
            isLoaded={props.isLoaded}
            position={new Vector3(0, 0, -5)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomLobby;

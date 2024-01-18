import { useCallback, useEffect } from 'react';
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

  const onClick = useCallback((name: string) => {}, []);

  useEffect(() => {
    if (state === STATE_OPEN) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state]);

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
            onClick={onClick}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomLobby;

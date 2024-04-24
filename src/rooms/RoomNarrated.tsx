import { useEffect } from 'react';
import { Euler, Vector3 } from 'three';

import { GENDER_TYPES } from '@inworld/web-threejs/build/src/types/types';

import { STATE_OPEN, useInworld } from '../contexts/InworldProvider';
import ModelInnequin from '../models/ModelInnequin';
import RoomBase from './RoomBase';

export type RoomNarratedProps = {
  name: string;
  isLoaded: boolean;
};

function RoomNarrated(props: RoomNarratedProps) {
  const CHARACTER_ID =
    'workspaces/inworld-playground/characters/narrated_bot_-_innequin_female';
  const NAME_INNEQUIN = 'InnequinNarrated';
  const SKIN_INNEQUIN_FEMALE = 'DOTS';
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
          name="GroupNarrated"
          position={new Vector3(0, 0, 0)}
          rotation={new Euler(0, 0, 0)}
        >
          <ModelInnequin
            name={NAME_INNEQUIN}
            gender={GENDER_TYPES.FEMALE}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN_FEMALE}
            isLoaded={props.isLoaded}
            position={new Vector3(0, 0, -5)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomNarrated;

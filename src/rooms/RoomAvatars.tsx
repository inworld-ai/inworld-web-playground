import { useEffect } from 'react';
import { Euler, Vector3 } from 'three';

import { GENDER_TYPES } from '@inworld/web-threejs/build/src/types/types';

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
    'workspaces/inworld-playground/characters/avatar_bot_-_innequin';
  const CHARACTER_FEMALE_ID =
    'workspaces/inworld-playground/characters/avatar_bot_-_innequin_female';
  const NAME_INNEQUIN_MALE = 'InnequinAvatarsMale';
  const NAME_INNEQUIN_FEMALE = 'InnequinAvatarsFemale';
  const NAME_SPHERE = 'SphereAvatars';
  const NAME_RPM = 'RPMAvatars';
  const SKIN_INNEQUIN_MALE = 'SCIFI';
  const SKIN_INNEQUIN_FEMALE = 'DOTS';
  const TRIGGER_WELCOME = 'greet_player';

  const { sendTrigger, state } = useInworld();

  useEffect(() => {
    if (state === STATE_OPEN && sendTrigger) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state]);

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupAvatars">
          <ModelInnequin
            name={NAME_INNEQUIN_FEMALE}
            gender={GENDER_TYPES.FEMALE}
            characterId={CHARACTER_FEMALE_ID}
            skinName={SKIN_INNEQUIN_FEMALE}
            isLoaded={props.isLoaded}
            position={new Vector3(-3, 0, -5)}
            rotation={new Euler(0, Math.PI / 8, 0)}
          />
          <ModelRPM
            name={NAME_RPM}
            characterId={CHARACTER_ID}
            isLoaded={props.isLoaded}
            position={new Vector3(-1.5, 0, -6)}
            rotation={new Euler(0, 0, 0)}
          />
          <ModelSphere
            name={NAME_SPHERE}
            characterId={CHARACTER_ID}
            isLoaded={props.isLoaded}
            position={new Vector3(1.5, 1, -6)}
            rotation={new Euler(0, 0, 0)}
          />
          <ModelInnequin
            name={NAME_INNEQUIN_MALE}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN_MALE}
            isLoaded={props.isLoaded}
            position={new Vector3(3, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomAvatars;

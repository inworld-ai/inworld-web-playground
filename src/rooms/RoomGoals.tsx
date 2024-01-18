import { JSONFileLoader } from '@inworld/web-threejs/build/src/loaders/JSONFileLoader';
import { button, useControls } from 'leva';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

import {
  STATE_ACTIVE,
  STATE_OPEN,
  useInworld,
} from '../contexts/InworldProvider';
import ModelInnequin from '../models/ModelInnequin';
import RoomBase from './RoomBase';

export type RoomGoalsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomGoals(props: RoomGoalsProps) {
  const CHARACTER_ID =
    'workspaces/inworld-playground/characters/goals_bot_-_innequin';
  const DATA_URI = './assets/v1.0/data/cities.json';
  const NAME_INNEQUIN = 'InnequinGoals';
  const SKIN_INNEQUIN = 'CAMO';
  const TRIGGER_DEMO_PARAMETERS = 'demo_parameters';
  const TRIGGER_EXPLAIN_DYNAMIC_DATA_RETRIEVAL =
    'explain_dynamic_data_retrieval';
  const TRIGGER_EXPLAIN_ENABLE_DISABLE = 'explain_enable_disable';
  const TRIGGER_EXPLAIN_INTENTS = 'explain_intents';
  const TRIGGER_EXPLAIN_PARAMETERS = 'explain_parameters';
  const TRIGGER_EXPLAIN_MUTATIONS = 'explain_mutations';
  const TRIGGER_EXPLAIN_VERBATIM = 'explain_verbatim';
  const TRIGGER_GET_POPULATION = 'get_population';
  const TRIGGER_PROVIDE_POPULATION = 'provide_population';
  const TRIGGER_SET_CHARACTER_NAME = 'set_character_name';
  const TRIGGER_WELCOME = 'greet_player';

  const dataRef = useRef<JSONFileLoader>();

  const [currentGoal, setCurrentGoal] = useState('');
  const [goalsOptions, setGoalsOptions] = useState({});
  const [mutationOptions, setMutationOptions] = useState({});
  const [triggersOptions, setTriggersOptions] = useState({});

  const { sendTrigger, state, triggerEvent } = useInworld();

  const onClick = useCallback((name: string) => {}, []);

  const goalsCtl = useControls(
    'Goals and Actions',
    goalsOptions,
    {
      collapsed: false,
    },
    [goalsOptions],
  );

  const mutationCtl = useControls(
    'Mutation',
    mutationOptions,
    {
      collapsed: false,
    },
    [mutationOptions],
  );

  const triggerCtl = useControls(
    'Triggers with Parameters',
    triggersOptions,
    {
      collapsed: false,
    },
    [triggersOptions],
  );

  const roomMenu = {
    'Intent Recognition': button(() => {
      if (state === STATE_OPEN || state === STATE_ACTIVE) {
        setCurrentGoal(TRIGGER_EXPLAIN_INTENTS);
      }
    }),
    'Verbatim Responses': button(() => {
      if (state === STATE_OPEN || state === STATE_ACTIVE) {
        setCurrentGoal(TRIGGER_EXPLAIN_VERBATIM);
      }
    }),
    'Triggers with Parameters': button(() => {
      if (state === STATE_OPEN || state === STATE_ACTIVE) {
        setCurrentGoal(TRIGGER_EXPLAIN_PARAMETERS);
      }
    }),
    'Dynamic Data Retrieval': button(() => {
      if (state === STATE_OPEN || state === STATE_ACTIVE) {
        setCurrentGoal(TRIGGER_EXPLAIN_DYNAMIC_DATA_RETRIEVAL);
      }
    }),
    'Character Mutations': button(() => {
      if (state === STATE_OPEN || state === STATE_ACTIVE) {
        setCurrentGoal(TRIGGER_EXPLAIN_MUTATIONS);
      }
    }),
    // "Enabling/Disabling Goals": button(() => {
    //   if (state === STATE_OPEN || state === STATE_ACTIVE) {
    //     setCurrentGoal(TRIGGER_EXPLAIN_ENABLE_DISABLE);
    //   }
    // }),
  };

  const mutationMenu = {
    Name: {
      options: ['Bob', 'Gene', 'Ringo', 'James'],
      value: '',
      onChange: (characterName: string) => {
        if (!characterName) return;
        sendTrigger(TRIGGER_SET_CHARACTER_NAME, [
          { name: 'character_name', value: characterName },
        ]);
      },
    },
  };

  const triggersMenu = {
    Animal: {
      options: ['Dogs', 'Cats', 'Horses', 'Birds'],
      value: '',
      onChange: (animalName: string) => {
        if (!animalName) return;
        sendTrigger(TRIGGER_DEMO_PARAMETERS, [
          { name: 'animal', value: animalName },
        ]);
      },
    },
  };

  useEffect(() => {
    if (!dataRef.current) {
      dataRef.current = new JSONFileLoader({ fileURI: DATA_URI });
      dataRef.current.load(onLoadData);
    }
  }, [dataRef.current]);

  useEffect(() => {
    if (state === STATE_OPEN) {
      sendTrigger(TRIGGER_WELCOME);
    }
    if (state === STATE_ACTIVE) {
      setGoalsOptions(roomMenu);
    } else {
      setGoalsOptions({});
      setMutationOptions({});
      setTriggersOptions({});
    }
  }, [state]);

  useEffect(() => {
    if (!currentGoal) return;
    sendTrigger(currentGoal);
    if (currentGoal === TRIGGER_EXPLAIN_PARAMETERS) {
      setTriggersOptions(triggersMenu);
    } else {
      setTriggersOptions({});
    }
    if (currentGoal === TRIGGER_EXPLAIN_MUTATIONS) {
      setMutationOptions(mutationMenu);
    } else {
      setMutationOptions({});
    }
  }, [currentGoal]);

  useEffect(() => {
    if (!triggerEvent) return;
    if (
      triggerEvent.name === TRIGGER_GET_POPULATION &&
      triggerEvent.parameters
    ) {
      const cityName = triggerEvent.parameters[0].value;
      const cityPopulation = dataRef.current?.data[cityName].population;
      console.log('Get Population', cityName, cityPopulation);
      setTimeout(() => {
        sendTrigger(TRIGGER_PROVIDE_POPULATION, [
          { name: 'city', value: cityName },
          {
            name: 'population',
            value: cityPopulation,
          },
        ]);
      }, 2000);
    }
  }, [triggerEvent]);

  const onLoadData = useCallback((data: any) => {
    // Fill here for handling loading of the data JSON file.
    data;
  }, []);

  return (
    <>
      <RoomBase name={props.name}>
        <group
          name="GroupGoals"
          position={new Vector3(0, 0, 0)}
          rotation={new Euler(0, 0, 0)}
        >
          <ModelInnequin
            name={NAME_INNEQUIN}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN}
            isLoaded={props.isLoaded}
            position={new Vector3(0, 0, -5)}
            onClick={onClick}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomGoals;

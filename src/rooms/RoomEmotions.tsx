import { button, useControls } from 'leva';
import { ButtonInput } from 'leva/dist/declarations/src/types';
import { useCallback, useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';

import {
  STATE_ACTIVE,
  STATE_OPEN,
  useInworld,
} from '../contexts/InworldProvider';
import ModelInnequin from '../models/ModelInnequin';
import ModelRPM from '../models/ModelRPM';
import { log } from '../utils/log';
import { camelize } from '../utils/strings';
import RoomBase from './RoomBase';

export type RoomEmotionsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomEmotions(props: RoomEmotionsProps) {
  const CHARACTER_ID = 'workspaces/inworld-playground/characters/emotion_bot';
  const EMOTIONS_SUPPORTED = {
    ANGER: 'emotion_anger',
    DISGUST: 'emotion_disgust',
    JOY: 'emotion_anger',
    NEUTRAL: 'emotion_neutral',
    SADNESS: 'emotion_sadness',
    SURPRISE: 'emotion_surprise',
  };
  const NAME_INNEQUIN = 'InnequinEmotions';
  const NAME_RPM = 'RPMEmotions';
  const SKIN_INNEQUIN = 'DOTS';
  const TRIGGER_WELCOME = 'greet_player';

  const [activeCharacter, setActiveCharacter] = useState<string>();
  const [emotionOptions, setEmotionOptions] = useState({});

  const { sendTrigger, state } = useInworld();
  useControls('Emotions', emotionOptions, { collapsed: false }, [
    emotionOptions,
  ]);

  useEffect(() => {
    if (!activeCharacter) return;
    onUpdateMenus();
  }, [activeCharacter]);

  useEffect(() => {
    if (state !== STATE_OPEN && state !== STATE_ACTIVE) {
      setActiveCharacter('');
      setEmotionOptions({});
    }
  }, [state]);

  useEffect(() => {
    onUpdateMenus();
  }, [state]);

  const onChangeEmotion = useCallback(
    (emotion: string) => {
      if (!activeCharacter) {
        log('onChangeEmotion:', emotion);
      }
    },
    [activeCharacter, state],
  );

  useEffect(() => {
    if (state === STATE_OPEN && sendTrigger) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state]);

  const onClick = useCallback(
    (name: string) => {
      switch (name) {
        case NAME_INNEQUIN:
        case NAME_RPM:
          if (name !== activeCharacter) {
            setActiveCharacter(name);
          }
          break;
        default:
          throw new Error(
            'RoomEmotions: onClick character name not found: ' + name,
          );
      }
    },
    [activeCharacter],
  );

  const onClickEmotion = useCallback(
    (emotion: string) => {
      log('onClickEmotion:', emotion, state);
      if (state !== STATE_OPEN && state !== STATE_ACTIVE) return;
      if (sendTrigger) {
        sendTrigger(
          EMOTIONS_SUPPORTED[
            emotion.toUpperCase() as keyof typeof EMOTIONS_SUPPORTED
          ].toLowerCase(),
        );
      }
    },
    [state],
  );

  const onUpdateMenus = useCallback(() => {
    if (state !== STATE_OPEN && state !== STATE_ACTIVE) return;
    const emotionOptionsData: { [key: string]: ButtonInput } = {};
    Object.keys(EMOTIONS_SUPPORTED).forEach((emotion) => {
      emotionOptionsData[camelize(emotion)] = button(() => {
        onClickEmotion(emotion);
      });
    });
    setEmotionOptions(emotionOptionsData);
  }, [activeCharacter, state]);

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupEmotions">
          <ModelInnequin
            isLoaded={props.isLoaded}
            name={NAME_INNEQUIN}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN}
            position={new Vector3(2, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
            onClick={onClick}
            onChangeEmotion={onChangeEmotion}
          />
          <ModelRPM
            isLoaded={props.isLoaded}
            name={NAME_RPM}
            characterId={CHARACTER_ID}
            position={new Vector3(-2, 0, -5)}
            rotation={new Euler(0, Math.PI / 8, 0)}
            onClick={onClick}
            onChangeEmotion={onChangeEmotion}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomEmotions;

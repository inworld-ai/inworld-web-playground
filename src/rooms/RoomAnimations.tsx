import { EmotionBehaviorCode } from '@inworld/web-core';
import { InnequinConfiguration, RPMConfiguration } from '@inworld/web-threejs';
import { button, useControls } from 'leva';
import { useCallback, useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';

import { STATE_OPEN, useInworld } from '../contexts/InworldProvider';
import { useUI } from '../contexts/UIProvider';
import ModelInnequin from '../models/ModelInnequin';
import ModelRPM from '../models/ModelRPM';
import { camelize } from '../utils/strings';
import RoomBase from './RoomBase';

export type RoomAnimationsProps = {
  name: string;
  isLoaded: boolean;
};

function RoomAnimations(props: RoomAnimationsProps) {
  const CHARACTER_ID =
    'workspaces/inworld-playground/characters/animation_bot_-_innequin';
  const NAME_INNEQUIN = 'InnequinAnimations';
  const NAME_RPM = 'RPMAnimations';
  const SKIN_INNEQUIN = 'WOOD2';
  const TRIGGER_WELCOME = 'greet_player';

  const [activeCharacter, setActiveCharacter] = useState<string>();
  const [animationOptions, setAnimationOptions] = useState({});
  const [animationCurrent, setAnimationCurrent] = useState<string>();
  const [emotionCurrent, setEmotionCurrent] = useState<string>(
    camelize(EmotionBehaviorCode.NEUTRAL),
  );
  const [emotionOptions, setEmotionOptions] = useState({});
  const [innequinConfig, setInnequinConfig] = useState<InnequinConfiguration>();
  const [rpmConfig, setRPMConfig] = useState<RPMConfiguration>();

  const { name, sendTrigger, state } = useInworld();
  const { setLabel1 } = useUI();

  const emotionsCtl = useControls(
    'Emotions',
    emotionOptions,
    { collapsed: false },
    [emotionOptions],
  );

  const animationsCtl = useControls(
    'Animations',
    animationOptions,
    { collapsed: false },
    [animationOptions],
  );

  useEffect(() => {
    if (!activeCharacter) return;
    onUpdateMenus();
  }, [activeCharacter]);

  useEffect(() => {
    onUpdateMenus();
  }, [emotionCurrent]);

  useEffect(() => {
    if (!name || name === '') {
      setActiveCharacter('');
      setAnimationOptions({});
      setEmotionOptions({});
    }
  }, [name]);

  useEffect(() => {
    if (setLabel1) {
      let label = 'Emotion: ' + emotionCurrent;
      if (animationCurrent) label += '\n' + 'Animation: ' + animationCurrent;
      setLabel1(label);
    }
  }, [animationCurrent, emotionCurrent]);

  useEffect(() => {
    if (state === STATE_OPEN) {
      sendTrigger(TRIGGER_WELCOME);
    }
  }, [state]);

  const onUpdateMenus = useCallback(() => {
    let animations: any;
    if (!activeCharacter) return;
    switch (activeCharacter) {
      case NAME_INNEQUIN:
        animations = innequinConfig?.innequin.animations;
        break;
      case NAME_RPM:
        animations = rpmConfig?.rpm.animations;
        break;
      default:
        throw new Error(
          'RoomAnimations: onUpdateMenus character name not found: ' +
            activeCharacter,
        );
    }
    if (animations) {
      // console.log("onUpdateMenus:", emotionCurrent);
      const keys = Object.keys(animations);
      const emotions = keys
        .map((key) => animations[key].emotion)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        .map((emotion) => camelize(emotion));
      const emotionOptionsData = {};
      emotions.forEach((emotion) => {
        (emotionOptionsData as any)[emotion] = button(() => {
          onChangeEmotion(emotion);
        });
      });
      setEmotionOptions(emotionOptionsData);
      const emotionAnimations = keys.filter(
        (key) =>
          animations[key].emotion.toLowerCase() ===
          emotionCurrent.toLowerCase(),
      );
      const emotionAnimationData = {};
      emotionAnimations.forEach((animation) => {
        (emotionAnimationData as any)[animation] = button(() => {
          onChangeAnimation(animation);
        });
      });
      setAnimationOptions(emotionAnimationData);
    }
  }, [activeCharacter, emotionCurrent, innequinConfig, rpmConfig]);

  const onChangeAnimation = useCallback((animation: string) => {
    if (!animation) return;
    setAnimationCurrent(animation);
  }, []);

  const onChangeEmotion = useCallback((emotion: string) => {
    // console.log("onChangeEmotion:", emotion);
    if (!emotion) return;
    setEmotionCurrent(emotion);
  }, []);

  const onClick = useCallback(
    (name: string) => {
      // console.log("RoomAnimations: onClick", name);
      switch (name) {
        case NAME_INNEQUIN:
        case NAME_RPM:
          if (name !== activeCharacter) {
            setActiveCharacter(name);
          }
          break;
        default:
          throw new Error(
            'RoomAnimations: onClick character name not found: ' + name,
          );
      }
    },
    [activeCharacter],
  );

  return (
    <>
      <RoomBase name={props.name}>
        <group name="GroupAnimations">
          <ModelInnequin
            isLoaded={props.isLoaded}
            name={NAME_INNEQUIN}
            characterId={CHARACTER_ID}
            skinName={SKIN_INNEQUIN}
            animationCurrent={animationCurrent}
            emotionCurrent={emotionCurrent}
            position={new Vector3(-2, 0, -5)}
            rotation={new Euler(0, Math.PI / 8, 0)}
            setConfig={(config: InnequinConfiguration) => {
              setInnequinConfig(config);
            }}
            onClick={onClick}
            onChangeEmotion={onChangeEmotion}
          />
          <ModelRPM
            isLoaded={props.isLoaded}
            name={NAME_RPM}
            characterId={CHARACTER_ID}
            animationCurrent={animationCurrent}
            emotionCurrent={emotionCurrent}
            position={new Vector3(2, 0, -5)}
            rotation={new Euler(0, -Math.PI / 8, 0)}
            setConfig={(config: RPMConfiguration) => {
              setRPMConfig(config);
            }}
            onClick={onClick}
            onChangeEmotion={onChangeEmotion}
          />
        </group>
      </RoomBase>
    </>
  );
}

export default RoomAnimations;

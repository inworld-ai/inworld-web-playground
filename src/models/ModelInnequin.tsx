import { EmotionBehaviorCode } from '@inworld/web-core';
import {
  Innequin,
  InnequinBodyEmotionToBehavior,
  InnequinConfiguration,
} from '@inworld/web-threejs';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

import {
  OpenConnectionType,
  STATE_INIT,
  useInworld,
} from '../contexts/InworldProvider';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import ClickableCube from './clickables/ClickableCube';

interface ModelInnequinProps {
  isLoaded: boolean;
  animationCurrent?: string | undefined;
  emotionCurrent?: string | undefined;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  skinName?: string;
  setConfig?: (config: InnequinConfiguration) => void;
  onClick?: (name: string) => void;
  onChangeEmotion?: (emotion: EmotionBehaviorCode) => void;
}

function ModelInnequin(props: ModelInnequinProps) {
  const DEFAULT_NAME = 'Innequin';

  const configRef = useRef<InnequinConfiguration>();
  const innequinRef = useRef<Innequin>();
  const skinNameInitialRef = useRef<string>(props.skinName || 'WOOD1');

  const [emotion, setEmotion] = useState<EmotionBehaviorCode>();
  const [isLoaded, setIsLoaded] = useState(false);

  const { emotionEvent, name, open, phonemes, state } = useInworld();

  useEffect(() => {
    if (props.emotionCurrent && innequinRef.current && name === props.name) {
      innequinRef.current.setEmotion(
        EmotionBehaviorCode[
          InnequinBodyEmotionToBehavior[
            props.emotionCurrent.toUpperCase() as keyof typeof InnequinBodyEmotionToBehavior
          ] as keyof typeof EmotionBehaviorCode
        ],
      );
    }
  }, [props.emotionCurrent]);

  useEffect(() => {
    if (props.animationCurrent && innequinRef.current && name === props.name) {
      innequinRef.current.playAnimation(props.animationCurrent);
    }
  }, [props.animationCurrent]);

  useEffect(() => {
    if (props.isLoaded) {
      innequinRef.current = new Innequin({
        ...Config.INNEQUIN,
        skinName: skinNameInitialRef.current,
        onLoad: onLoadInnequin,
        onProgress: onProgressInnequin,
      });
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (
      isLoaded &&
      emotionEvent &&
      name === props.name &&
      innequinRef.current
    ) {
      setEmotion(emotionEvent.behavior.code);
      innequinRef.current.setEmotion(emotionEvent.behavior.code);
      if (props.onChangeEmotion)
        props.onChangeEmotion(emotionEvent.behavior.code);
    }
  }, [name, isLoaded, emotionEvent]);

  useEffect(() => {
    if (isLoaded && phonemes && name === props.name && innequinRef.current) {
      innequinRef.current.setPhonemes(phonemes);
    }
  }, [name, isLoaded, phonemes]);

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!open) return;
    if (state !== STATE_INIT) return;
    log('ModelInnequin: onClick');
    const options: OpenConnectionType = { name: props.name || DEFAULT_NAME };
    if (props.characterId) options.characterId = props.characterId;
    open(options);
    if (props.onClick && props.name) {
      props.onClick(props.name);
    }
    if (props.onChangeEmotion && emotion) props.onChangeEmotion(emotion);
  }, []);

  const onLoadInnequin = useCallback(
    (config: InnequinConfiguration) => {
      configRef.current = config;
      if (props.setConfig) {
        props.setConfig(config);
      }
      if (innequinRef.current && innequinRef.current.getModel()) {
        setEmotion(config.innequin.defaults.EMOTION);
        if (props.onChangeEmotion)
          props.onChangeEmotion(config.innequin.defaults.EMOTION);
        setIsLoaded(true);
      }
    },
    [innequinRef.current],
  );

  const onProgressInnequin = useCallback((progress: number) => {
    log('ModelInnequin onProgressInnequin', progress);
  }, []);

  useFrame((_, delta) => {
    if (innequinRef.current) {
      innequinRef.current.updateFrame(delta);
    }
  });

  return (
    <>
      {isLoaded && innequinRef.current && (
        <>
          <group
            name={props.name + 'Group' || DEFAULT_NAME + 'Group'}
            position={props.position || new Vector3(0, 0, 0)}
            rotation={props.rotation || new Euler(0, 0, 0)}
          >
            <primitive
              name={props.name || DEFAULT_NAME}
              object={innequinRef.current.getModel()}
              castShadow
              receiveShadow
            />
            <ClickableCube
              length={0.5}
              width={1.7}
              height={0.5}
              position={new Vector3(0, 0.85, 0)}
              onClick={onClick}
            />
          </group>
        </>
      )}
    </>
  );
}
export default ModelInnequin;

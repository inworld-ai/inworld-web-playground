import { EmotionBehaviorCode } from '@inworld/web-core';
import {
  RPM,
  RPMBodyEmotionToBehavior,
  RPMConfiguration,
} from '@inworld/web-threejs';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

import { STATE_INIT, useInworld } from '../contexts/InworldProvider';
import { useUI } from '../contexts/UIProvider';
import { Cursors } from '../types/cursors';
import { Config } from '../utils/config';
import { log } from '../utils/log';

interface ModelRPMProps {
  isLoaded: boolean;
  animationCurrent?: string | undefined;
  emotionCurrent?: string | undefined;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  setConfig?: (config: RPMConfiguration) => void;
  onClick?: (name: string) => void;
  onChangeEmotion?: (emotion: EmotionBehaviorCode) => void;
}

function ModelRPM(props: ModelRPMProps) {
  const configRef = useRef<RPMConfiguration>();
  const rpmRef = useRef<RPM>();

  const [emotion, setEmotion] = useState<EmotionBehaviorCode>();
  const [isLoaded, setIsLoaded] = useState(false);

  const { emotionEvent, name, open, phonemes, state } = useInworld();
  const { setCursor } = useUI();

  useEffect(() => {
    if (props.emotionCurrent && rpmRef.current && name === props.name) {
      rpmRef.current.setEmotion(
        EmotionBehaviorCode[
          RPMBodyEmotionToBehavior[
            props.emotionCurrent.toUpperCase() as keyof typeof RPMBodyEmotionToBehavior
          ] as keyof typeof EmotionBehaviorCode
        ],
      );
    }
  }, [props.emotionCurrent]);

  useEffect(() => {
    if (props.animationCurrent && rpmRef.current && name === props.name) {
      rpmRef.current.playAnimation(props.animationCurrent);
    }
  }, [props.animationCurrent]);

  useEffect(() => {
    if (props.isLoaded) {
      rpmRef.current = new RPM({
        ...Config.RPM,
        onLoad: onLoadRPM,
        onProgress: onProgressRPM,
      });
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (isLoaded && emotionEvent && name === props.name && rpmRef.current) {
      setEmotion(emotionEvent.behavior.code);
      rpmRef.current.setEmotion(emotionEvent.behavior.code);
      if (props.onChangeEmotion)
        props.onChangeEmotion(emotionEvent.behavior.code);
    }
  }, [isLoaded, emotionEvent]);

  useEffect(() => {
    if (isLoaded && phonemes && name === props.name && rpmRef.current) {
      rpmRef.current.setPhonemes(phonemes);
    }
  }, [isLoaded, phonemes]);

  const onClick = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (state !== STATE_INIT) return;
      const options: any = { name: props.name! };
      if (props.characterId) options.characterId = props.characterId;
      if (open) open(options);
      if (props.onClick && props.name) {
        props.onClick(props.name);
      }
      if (props.onChangeEmotion && emotion) props.onChangeEmotion(emotion);
    },
    [emotion, state],
  );

  const onLoadRPM = useCallback(
    (config: RPMConfiguration) => {
      configRef.current = config;
      if (props.setConfig) {
        props.setConfig(config);
      }
      if (rpmRef.current && rpmRef.current.getModel()) {
        setEmotion(config.rpm.defaults.EMOTION);
        if (props.onChangeEmotion)
          props.onChangeEmotion(config.rpm.defaults.EMOTION);
        setIsLoaded(true);
      }
    },
    [rpmRef.current],
  );

  const onOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (setCursor) setCursor(Cursors.Auto);
  }, []);

  const onOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (setCursor) setCursor(Cursors.Pointer);
  }, []);

  const onProgressRPM = useCallback((progress: number) => {
    log('ModelRPM onProgressRPM', progress);
  }, []);

  useFrame((state, delta) => {
    if (rpmRef.current) {
      rpmRef.current.updateFrame(delta);
    }
  });

  return (
    <>
      {isLoaded && rpmRef.current && (
        <>
          <group
            position={props.position || new Vector3(0, 0, 0)}
            rotation={props.rotation || new Euler(0, 0, 0)}
            onPointerDown={onClick}
            onPointerOut={onOut}
            onPointerOver={onOver}
          >
            <primitive
              name={props.name || 'RPM'}
              object={rpmRef.current.getModel()}
              castShadow
              receiveShadow
            />
          </group>
        </>
      )}
    </>
  );
}
export default ModelRPM;
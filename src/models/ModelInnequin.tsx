import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Vector3 } from "three";

import { EmotionBehaviorCode } from "@inworld/web-core";
import {
  Innequin,
  InnequinConfiguration,
  SkinType,
} from "@inworld/web-threejs";
import { useFrame } from "@react-three/fiber";

import ClickableCube from "../clickables/ClickableCube";
import { STATE_OPEN, useInworld } from "../contexts/InworldProvider";
import { Config } from "../utils/config";

interface ModelInnequinProps {
  isLoaded: boolean;
  name?: string;
  position?: Vector3;
  rotation?: Euler;
  skinName?: string;
}

function ModelInnequin(props: ModelInnequinProps) {
  const innequinRef = useRef<Innequin>(null!);

  const [defaultEmotion, setDefaultEmotion] = useState<EmotionBehaviorCode>(
    null!
  );
  const [skinNameInitial, setSkinNameInitial] = useState(
    props.skinName || "WOOD1"
  );
  const [emotion, setEmotion] = useState<EmotionBehaviorCode>(null!);
  const [isLoaded, setIsLoaded] = useState(false);
  const [skins, setSkins] = useState<{ [key: string]: SkinType }>(null!);

  const { emotionEvent, name, open, phonemes, state } = useInworld();

  useEffect(() => {
    if (props.isLoaded) {
      console.log("ModelInnequin Init");
      innequinRef.current = new Innequin({
        ...Config.INNEQUIN,
        skinName: skinNameInitial,
        onLoad: onLoadInnequin,
        onProgress: onProgressInnequin,
      });
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (isLoaded && emotionEvent && name === props.name) {
      setEmotion(emotionEvent.behavior.code);
      innequinRef.current.setEmotion(emotionEvent.behavior.code);
    }
  }, [name, isLoaded, emotionEvent]);

  useEffect(() => {
    if (isLoaded && phonemes && name === props.name) {
      innequinRef.current.setPhonemes(phonemes);
    }
  }, [name, isLoaded, phonemes]);

  const onClick = useCallback(() => {
    console.log("ModelInnequin: onClick");
    if (state !== STATE_OPEN) open({ name: props.name! });
  }, []);

  const onLoadInnequin = useCallback(
    (config: InnequinConfiguration) => {
      if (innequinRef.current && innequinRef.current.getModel()) {
        setSkins(config.innequin.skins);
        setDefaultEmotion(config.innequin.defaults.EMOTION);
        setIsLoaded(true);
      }
    },
    [innequinRef.current]
  );

  const onProgressInnequin = useCallback((progress: number) => {
    // console.log("ModelInnequin onProgressInnequin", progress);
    //   if (setLoadingPercent) setLoadingPercent(progress);
  }, []);

  useFrame((state, delta) => {
    if (innequinRef.current) {
      innequinRef.current.updateFrame(delta);
    }
  });

  return (
    <>
      {isLoaded && (
        <>
          <group
            position={props.position || new Vector3(0, 0, 0)}
            rotation={props.rotation || new Euler(0, 0, 0)}
            onClick={onClick}
          >
            <primitive
              name={props.name || "Innequin"}
              object={innequinRef.current.getModel()}
              castShadow
              receiveShadow
            />
            {/* <ClickableCube
              length={0.5}
              width={1.7}
              height={0.5}
              position={new Vector3(0, 0.85, 0)}
              onClick={onClick}
            /> */}
          </group>
        </>
      )}
    </>
  );
}
export default ModelInnequin;

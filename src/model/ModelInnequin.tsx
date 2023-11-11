import { useCallback, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

import { EmotionBehaviorCode } from "@inworld/web-sdk";
import {
  Innequin,
  InnequinConfiguration,
  SkinType,
} from "@inworld/web-threejs";
import { useFrame } from "@react-three/fiber";

import { Config } from "../utils/config";

interface ModelInnequinProps {
  isLoaded: boolean;
  position: Vector3;
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

  useEffect(() => {
    if (props.isLoaded) {
      // console.log("ModelInnequin Init");
      innequinRef.current = new Innequin({
        ...Config.INNEQUIN,
        skinName: skinNameInitial,
        onLoad: onLoadInnequin,
        onProgress: onProgressInnequin,
      });
    }
  }, [props.isLoaded]);

  const onLoadInnequin = useCallback(
    (config: InnequinConfiguration) => {
      if (innequinRef.current && innequinRef.current.getModel()) {
        setSkins(config.innequin.skins);
        setDefaultEmotion(config.innequin.defaults.EMOTION);
        innequinRef.current
          .getModel()!
          .position.set(props.position.x, props.position.y, props.position.z);
        setIsLoaded(true);
      }
    },
    [innequinRef.current]
  );

  const onProgressInnequin = useCallback((progress: number) => {
    console.log("ModelInnequin onProgressInnequin", progress);
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
        <primitive
          object={innequinRef.current!.getModel()!}
          castShadow
          receiveShadow
        />
      )}
    </>
  );
}
export default ModelInnequin;

import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Vector3 } from "three";

import { EmotionBehaviorCode } from "@inworld/web-core";
import { RPM, RPMConfiguration, SkinType } from "@inworld/web-threejs";
import { useFrame } from "@react-three/fiber";

import ClickableCube from "../clickables/ClickableCube";
import { STATE_OPEN, useInworld } from "../contexts/InworldProvider";
import { Config } from "../utils/config";
import { useRays } from "../utils/rays";

interface ModelRPMProps {
  isLoaded: boolean;
  name?: string;
  position?: Vector3;
  rotation?: Euler;
}

function ModelRPM(props: ModelRPMProps) {
  const rpmRef = useRef<RPM>(null!);

  const [defaultEmotion, setDefaultEmotion] = useState<EmotionBehaviorCode>(
    null!
  );
  const [emotion, setEmotion] = useState<EmotionBehaviorCode>(null!);
  const [isLoaded, setIsLoaded] = useState(false);

  const { emotionEvent, name, open, phonemes, state } = useInworld();

  useEffect(() => {
    if (props.isLoaded) {
      // console.log("ModelRPM Init");
      rpmRef.current = new RPM({
        ...Config.RPM,
        onLoad: onLoadRPM,
        onProgress: onProgressRPM,
      });
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (isLoaded && emotionEvent && name === props.name) {
      setEmotion(emotionEvent.behavior.code);
      rpmRef.current.setEmotion(emotionEvent.behavior.code);
    }
  }, [isLoaded, emotionEvent]);

  useEffect(() => {
    if (isLoaded && phonemes && name === props.name) {
      rpmRef.current.setPhonemes(phonemes);
    }
  }, [isLoaded, phonemes]);

  const onClick = useCallback(() => {
    console.log("ModelRPM: onClick");
    if (state !== STATE_OPEN) open({ name: props.name! });
  }, [rpmRef.current]);

  const onLoadRPM = useCallback(
    (config: RPMConfiguration) => {
      if (rpmRef.current && rpmRef.current.getModel()) {
        setDefaultEmotion(config.rpm.defaults.EMOTION);
        setIsLoaded(true);
      }
    },
    [rpmRef.current]
  );

  const onProgressRPM = useCallback((progress: number) => {
    // console.log("ModelRPM onProgressRPM", progress);
    //   if (setLoadingPercent) setLoadingPercent(progress);
  }, []);

  useFrame((state, delta) => {
    if (rpmRef.current) {
      rpmRef.current.updateFrame(delta);
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
              name={props.name || "RPM"}
              object={rpmRef.current.getModel()}
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
export default ModelRPM;

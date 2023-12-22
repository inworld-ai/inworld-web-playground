import { useEffect, useRef, useState } from "react";
import { Clock } from "three";

import { useFrame } from "@react-three/fiber";

import { CameraCore } from "../camera/CameraCore";
import { FirstPersonCamera } from "../camera/FirstPersonCamera";
import { InputController } from "../input/InputController";
import { SoundController } from "../sound/SoundController";
import { SOUND_FOOTSTEPS } from "../sound/SoundIDs";
import { useRays } from "../utils/rays";
import { STATE_PAUSED, STATE_RUNNING, useSystem } from "../utils/system";

interface PlayerControllerProps {
  cameraCore: CameraCore;
  inputController: InputController;
  isLoaded: boolean;
}

function PlayerController(props: PlayerControllerProps) {
  const [fpsCamera, setFPSCamera] = useState<FirstPersonCamera>();
  const [soundController, setSoundController] = useState<SoundController>();

  const clockRef = useRef(new Clock());

  const { state, setState } = useSystem();
  const { setCamera } = useRays();

  useEffect(() => {
    if (props.isLoaded) {
      // console.log("PlayerController Init");
      setSoundController(new SoundController({ camera: props.cameraCore }));
    }
  }, [props.isLoaded]);

  useEffect(() => {
    setFPSCamera(
      new FirstPersonCamera(props.cameraCore, props.inputController)
    );
    if (setCamera) setCamera(props.cameraCore.camera);
  }, []);

  useEffect(() => {
    if (soundController) {
      if (state === STATE_RUNNING) {
        soundController.enable();
      } else {
        soundController.disable();
      }
    }
  }, [soundController, state]);

  useFrame((fstate, delta) => {
    props.inputController.update();
    // Check if the user pressed the escape key. If so pause the game.
    if (props.inputController.keys["Escape"]) {
      if (setState && state === STATE_RUNNING) {
        setState(STATE_PAUSED);
      }
    }

    if (state === STATE_RUNNING) {
      // Check if the character is running. If so play sound effect.
      const forwardVelocity =
        (props.inputController.keys["w"] ? 1 : 0) +
        (props.inputController.keys["s"] ? -1 : 0);
      const strafeVelocity =
        (props.inputController.keys["a"] ? 1 : 0) +
        (props.inputController.keys["d"] ? -1 : 0);
      if ((soundController && forwardVelocity !== 0) || strafeVelocity !== 0) {
        soundController?.play(SOUND_FOOTSTEPS);
      } else {
        soundController?.pause(SOUND_FOOTSTEPS);
      }
      // Check if the game is running. If so then update the fps camera.
      if (fpsCamera && state === STATE_RUNNING) {
        fpsCamera.update(clockRef.current.getDelta());
      }
    }
  });

  return <></>;
}

export default PlayerController;

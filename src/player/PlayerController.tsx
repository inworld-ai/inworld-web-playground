import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Clock } from "three";

import { FirstPersonCamera } from "../camera/FirstPersonCamera";
import { CameraCore } from "../camera/CameraCore";
import { InputController } from "../input/InputController";
import { SoundController } from "../sound/SoundController";

import { useSystem, STATE_PAUSED, STATE_RUNNING } from "../utils/system";
import { SOUND_FOOTSTEPS } from "../sound/SoundIDs";

interface PlayerControllerProps {
  cameraCore: CameraCore;
  isLoaded: boolean;
}

function PlayerController(props: PlayerControllerProps) {
  const [fpsCamera, setFPSCamera] = useState<FirstPersonCamera>();
  const [inputController, setInputController] = useState<InputController>();
  const [soundController, setSoundController] = useState<SoundController>();

  const clockRef = useRef(new Clock());

  const { state, setState } = useSystem();

  useEffect(() => {
    if (props.isLoaded) {
      // console.log("PlayerController Init");
      setInputController(new InputController());
      setSoundController(new SoundController({ camera: props.cameraCore }));
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (inputController) {
      setFPSCamera(new FirstPersonCamera(props.cameraCore, inputController));
    }
  }, [inputController]);

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
    if (inputController) {
      inputController.update();
      // Check if the user pressed the escape key. If so pause the game.
      if (inputController.keys["Escape"]) {
        if (setState && state === STATE_RUNNING) {
          setState(STATE_PAUSED);
        }
      }
      // Check if the character is running. If so play sound effect.
      const forwardVelocity =
        (inputController.keys["w"] ? 1 : 0) +
        (inputController.keys["s"] ? -1 : 0);
      const strafeVelocity =
        (inputController.keys["a"] ? 1 : 0) +
        (inputController.keys["d"] ? -1 : 0);
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

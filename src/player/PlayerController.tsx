import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Clock } from 'three';

import { CameraCore } from '../camera/CameraCore';
import { FirstPersonCamera } from '../camera/FirstPersonCamera';
import { STATE_INIT, useInworld } from '../contexts/InworldProvider';
import { useRays } from '../contexts/RaysProvider';
import {
  STATE_PAUSED,
  STATE_RUNNING,
  useSystem,
} from '../contexts/SystemProvider';
import { InputController } from '../input/InputController';
import { SoundController } from '../sound/SoundController';
import { SOUND_FOOTSTEPS } from '../sound/SoundIDs';
import { log } from '../utils/log';

interface PlayerControllerProps {
  cameraCore: CameraCore;
  inputController: InputController;
  isLoaded: boolean;
}

function PlayerController(props: PlayerControllerProps) {
  const [escClick, setESCClick] = useState<boolean>(false);
  const [fpsCamera, setFPSCamera] = useState<FirstPersonCamera>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [soundController, setSoundController] = useState<SoundController>();

  const clockRef = useRef(new Clock());

  const { state: inworldState } = useInworld();
  const { stateSystem, setStateSystem } = useSystem();
  const { setCamera } = useRays();

  useEffect(() => {
    if (props.isLoaded && !loaded) {
      log('PlayerController Init');
      setFPSCamera(
        new FirstPersonCamera(props.cameraCore, props.inputController),
      );
      if (setCamera) setCamera(props.cameraCore.camera);
      setSoundController(new SoundController({ camera: props.cameraCore }));
      setLoaded(true);
    }
  }, [props.isLoaded, loaded]);

  useEffect(() => {
    if (soundController) {
      if (stateSystem === STATE_RUNNING) {
        soundController.enable();
      } else {
        soundController.disable();
      }
    }
  }, [soundController, stateSystem]);

  useFrame(() => {
    // fstate, delta
    props.inputController.update();
    // Check if the user pressed the escape key. If so pause the game.
    if (props.inputController.keys['Escape'] && !escClick) {
      if (setStateSystem && stateSystem === STATE_RUNNING) {
        setStateSystem(STATE_PAUSED);
      } else if (setStateSystem && stateSystem === STATE_PAUSED) {
        setStateSystem(STATE_RUNNING);
      }
      setESCClick(true);
    }

    if (!props.inputController.keys['Escape'] && escClick) {
      setESCClick(false);
    }

    if (stateSystem === STATE_RUNNING && inworldState === STATE_INIT) {
      // Check if the character is running. If so play sound effect.
      const forwardVelocity =
        (props.inputController.keys['w'] ? 1 : 0) +
        (props.inputController.keys['s'] ? -1 : 0);
      const strafeVelocity =
        (props.inputController.keys['a'] ? 1 : 0) +
        (props.inputController.keys['d'] ? -1 : 0);
      if ((soundController && forwardVelocity !== 0) || strafeVelocity !== 0) {
        soundController?.play(SOUND_FOOTSTEPS);
      } else {
        soundController?.pause(SOUND_FOOTSTEPS);
      }
      // Check if the game is running. If so then update the fps camera.
      if (fpsCamera) {
        fpsCamera.update(clockRef.current.getDelta());
      }
    }
  });

  return <></>;
}

export default PlayerController;

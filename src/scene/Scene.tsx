import './Scene.css';

import { useEffect, useRef, useState } from 'react';

import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { CameraCore } from '../camera/CameraCore';
import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  ROOM_NARRATED,
  useRooms,
} from '../contexts/RoomsProvider';
import { useUI } from '../contexts/UIProvider';
import Background from '../environment/Background';
import Ground from '../environment/Ground';
import Lighting from '../environment/Lighting';
import ClickableController from '../input/ClickableController';
import { InputController } from '../input/InputController';
import PlayerController from '../player/PlayerController';
import RoomAnimations from '../rooms/RoomAnimations';
import RoomAvatars from '../rooms/RoomAvatars';
import RoomEmotions from '../rooms/RoomEmotions';
import RoomGoals from '../rooms/RoomGoals';
import RoomLobby from '../rooms/RoomLobby';
import RoomNarrated from '../rooms/RoomNarrated';
import { log } from '../utils/log';

function Scene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputController, setInputController] = useState<InputController>();
  const [cameraCore, setCameraCore] = useState<CameraCore>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { room } = useRooms();
  const { cursor } = useUI();

  useEffect(() => {
    if (!inputController && !cameraCore) {
      log('Scene init');
      setInputController(new InputController());
      setCameraCore(new CameraCore());
    }
  }, [inputController, cameraCore]);

  useEffect(() => {
    if (!isLoaded && cameraCore && inputController && canvasRef.current) {
      setIsLoaded(true);
    }
  }, [isLoaded, cameraCore, inputController, canvasRef.current]);

  return (
    cameraCore &&
    inputController && (
      <Canvas
        ref={canvasRef}
        className="mainCanvas"
        style={{ cursor: `${cursor}` }}
        camera={cameraCore.camera}
        shadows
      >
        <ClickableController
          cameraCore={cameraCore}
          canvasRef={canvasRef}
          inputController={inputController}
          isLoaded={isLoaded}
        />
        <Background />
        <Lighting />
        <Ground />
        <Stats />
        {room === ROOM_LOBBY && <RoomLobby name="LOBBY" isLoaded={isLoaded} />}
        {room === ROOM_ANIMATIONS && (
          <RoomAnimations name="ANIMATIONS" isLoaded={isLoaded} />
        )}
        {room === ROOM_AVATARS && (
          <RoomAvatars name="AVATARS" isLoaded={isLoaded} />
        )}
        {room === ROOM_EMOTIONS && (
          <RoomEmotions name="EMOTIONS" isLoaded={isLoaded} />
        )}
        {room === ROOM_GOALS && <RoomGoals name="GOALS" isLoaded={isLoaded} />}
        {room === ROOM_NARRATED && <RoomNarrated name="NARRATED" isLoaded={isLoaded} />}
        <PlayerController
          cameraCore={cameraCore}
          inputController={inputController}
          isLoaded={isLoaded}
        />
        <Stats />
      </Canvas>
    )
  );
}

export default Scene;

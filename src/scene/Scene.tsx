import './Scene.css';

import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';

import { CameraCore } from '../camera/CameraCore';
import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  useRooms,
} from '../contexts/RoomsProvider';
import { useUI } from '../contexts/UIProvider';
import Background from '../environment/Background';
import Ground from '../environment/Ground';
import Lighting from '../environment/Lighting';
import { InputController } from '../input/InputController';
import PlayerController from '../player/PlayerController';
import RoomAnimations from '../rooms/RoomAnimations';
import RoomAvatars from '../rooms/RoomAvatars';
import RoomEmotions from '../rooms/RoomEmotions';
import RoomGoals from '../rooms/RoomGoals';
import RoomLobby from '../rooms/RoomLobby';
import { log } from '../utils/log';

function Scene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputController, setInputController] = useState<InputController>();
  const [cameraCore, setCameraCore] = useState<CameraCore>();

  const { room } = useRooms();
  const { cursor } = useUI();

  useEffect(() => {
    log('Scene init');
    setIsLoaded(true);
  });

  useEffect(() => {
    if (isLoaded) {
      log('Scene Loading');
      setInputController(new InputController());
      setCameraCore(new CameraCore());
    }
  }, [isLoaded]);

  return (
    cameraCore &&
    inputController && (
      <Canvas
        className="mainCanvas"
        style={{ cursor: `${cursor}` }}
        camera={cameraCore.camera}
        shadows
      >
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

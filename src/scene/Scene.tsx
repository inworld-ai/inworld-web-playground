import "./Scene.css";

import { useEffect, useState } from "react";

import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { CameraCore } from "../camera/CameraCore";
import Background from "../environment/Background";
import Ground from "../environment/Ground";
import Lighting from "../environment/Lighting";
import Shadows from "../environment/Shadows";
import { InputController } from "../input/InputController";
import LightingController from "../lighting/Lighting";
import ModelWorld from "../models/ModelWorld";
import PlayerController from "../player/PlayerController";
import RoomAnimations from "../rooms/RoomAnimations";
import RoomAvatars from "../rooms/RoomAvatars";
import RoomBase from "../rooms/RoomBase";
import RoomEmotions from "../rooms/RoomEmotions";
import RoomLobby from "../rooms/RoomLobby";
import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_LOBBY,
  useRooms,
} from "../utils/rooms";

function Scene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputController, setInputController] = useState<InputController>();
  const [cameraCore, setCameraCore] = useState<CameraCore>();

  const { room } = useRooms();

  useEffect(() => {
    // console.log("Scene init");
    setIsLoaded(true);
  });

  useEffect(() => {
    if (isLoaded) {
      // console.log("Scene Loading");
      setInputController(new InputController());
      setCameraCore(new CameraCore());
    }
  }, [isLoaded]);

  return (
    cameraCore &&
    inputController && (
      <Canvas
        className="mainCanvas"
        style={{ height: "100%", width: "100%" }}
        camera={cameraCore.camera}
        shadows
      >
        <Background />
        <Lighting />
        {/* <Shadows /> */}
        <Ground />
        <Stats />
        {room === ROOM_ANIMATIONS && (
          <RoomAnimations name="ANIMATIONS" isLoaded={isLoaded} />
        )}
        {room === ROOM_AVATARS && (
          <RoomAvatars name="AVATARS" isLoaded={isLoaded} />
        )}
        {room === ROOM_EMOTIONS && (
          <RoomEmotions name="EMOTIONS" isLoaded={isLoaded} />
        )}
        {room === ROOM_LOBBY && <RoomLobby name="LOBBY" isLoaded={isLoaded} />}

        {/* <ModelWorld inputController={inputController} isLoaded={isLoaded} /> */}
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

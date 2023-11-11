import "./Scene.css";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Stats } from "@react-three/drei";

import PlayerController from "../player/PlayerController";
import { CameraCore } from "../camera/CameraCore";
import ModelWorld from "../model/ModelWorld";
import LightingController from "../lighting/Lighting";

function Scene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraCore, setCameraCore] = useState<CameraCore>();

  useEffect(() => {
    // console.log("Scene init");
    setIsLoaded(true);
  });

  useEffect(() => {
    if (isLoaded) {
      // console.log("Scene Loading");
      setCameraCore(new CameraCore());
    }
  }, [isLoaded]);

  return (
    cameraCore && (
      <Canvas
        className="mainCanvas"
        style={{ height: "100%", width: "100%" }}
        camera={cameraCore.camera}
        shadows
      >
        <LightingController />
        <ModelWorld isLoaded={isLoaded} />
        <PlayerController cameraCore={cameraCore} isLoaded={isLoaded} />
        <Stats />
      </Canvas>
    )
  );
}

export default Scene;

import { useControls } from "leva";
import { useRef } from "react";
import {
  DirectionalLight,
  DirectionalLightHelper,
  DirectionalLightShadow,
} from "three";

import { Sky, useHelper } from "@react-three/drei";

function LightingController() {
  const refDirLight = useRef<DirectionalLight>(null!);
  useHelper(refDirLight, DirectionalLightHelper, 1, "red");

  const ambCtl = useControls("Ambient Light", {
    visible: true,
    intensity: { value: 1, min: 0, max: 5 },
  });

  // const spotCtl = useControls("Spot Light", {
  //   visible: true,
  //   position: {
  //     x: 10,
  //     y: 40,
  //     z: 10,
  //   },
  //   angle: Math.PI / 3,
  //   penumbra: 0,
  //   castShadow: true,
  // });

  const directionalCtl = useControls("Directional Light", {
    visible: true,
    position: {
      x: 0,
      y: 40,
      z: 20,
    },
    intensity: { value: 1, min: 0, max: 5 },
    castShadow: true,
  });

  // const pointCtl = useControls("Point Light", {
  //   visible: false,
  //   position: {
  //     x: 2,
  //     y: 0,
  //     z: 0,
  //   },
  //   castShadow: true,
  // });

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[5, 1, 8]}
        inclination={0}
        azimuth={0.25}
      />
      <ambientLight
        name="Light 1"
        visible={ambCtl.visible}
        intensity={ambCtl.intensity}
      />
      <hemisphereLight
        name="Light 2"
        args={["#fff", "#333"]}
        intensity={ambCtl.intensity}
      />
      <directionalLight
        name="Light 3"
        visible={directionalCtl.visible}
        intensity={directionalCtl.intensity}
        position={[
          directionalCtl.position.x,
          directionalCtl.position.y,
          directionalCtl.position.z,
        ]}
        castShadow={directionalCtl.castShadow}
        ref={refDirLight}
      />
      {/* <directionalLightHelper light={dirLight} /> */}
      {/* <pointLight
        visible={pointCtl.visible}
        position={[
          pointCtl.position.x,
          pointCtl.position.y,
          pointCtl.position.z,
        ]}
        castShadow={pointCtl.castShadow}
      />*/}
      {/*<spotLight
        visible={spotCtl.visible}
        position={[spotCtl.position.x, spotCtl.position.y, spotCtl.position.z]}
        angle={spotCtl.angle}
        penumbra={spotCtl.penumbra}
        castShadow={spotCtl.castShadow}
      /> */}
    </>
  );
}

export default LightingController;

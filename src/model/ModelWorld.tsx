import { useCallback, useEffect, useRef, useState } from "react";
import { DoubleSide, Euler, Mesh, RepeatWrapping, Vector3 } from "three";
import { Sky } from "three-stdlib";

import { Plane } from "@react-three/drei";

import { TextureFileLoader } from "../loaders/TextureFileLoader";
import ModelBox from "./ModelBox";
import ModelInnequin from "./ModelInnequin";

interface ModelWorldProps {
  isLoaded: boolean;
}

const WORLD_DIM = 50;
const WALL_HEIGHT = 5;
const TEXTURE_DIM = WORLD_DIM / 4;

function ModelWorld(props: ModelWorldProps) {
  const [texture, setTexture] = useState<TextureFileLoader>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sky, setSky] = useState<Sky>();

  const floorRef = useRef<Mesh>(null);

  useEffect(() => {
    if (props.isLoaded) {
      // console.log("ModelWorld Init");
      setTexture(new TextureFileLoader("/assets/textures/floor/texture-1.jpg"));
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (texture) {
      texture.load(onLoad);
    }
  }, [texture]);

  const onLoad = useCallback(() => {
    // console.log("Loaded Texture");
    if (texture && texture.getTexture()) {
      texture.getTexture()!.wrapS = RepeatWrapping;
      texture.getTexture()!.wrapT = RepeatWrapping;
      texture.getTexture()!.repeat.set(TEXTURE_DIM, TEXTURE_DIM);
      setIsLoaded(true);
    }
  }, [texture]);

  const locs = [
    {
      pos: new Vector3(WORLD_DIM / 2, WALL_HEIGHT / 2, 0),
      rot: new Euler(0, Math.PI / 2, 0),
    },
    {
      pos: new Vector3(-WORLD_DIM / 2, WALL_HEIGHT / 2, 0),
      rot: new Euler(0, Math.PI / 2, 0),
    },
    {
      pos: new Vector3(0, WALL_HEIGHT / 2, WORLD_DIM / 2),
      rot: new Euler(0, 0, 0),
    },
    {
      pos: new Vector3(0, WALL_HEIGHT / 2, -WORLD_DIM / 2),
      rot: new Euler(0, 0, 0),
    },
  ];

  const walls = locs.map((loc, i) => {
    return (
      <mesh
        key={`wall${i}`}
        position={loc.pos}
        rotation={loc.rot}
        scale={[WORLD_DIM, WALL_HEIGHT, 1]}
        castShadow
        receiveShadow
      >
        <planeGeometry />
        {texture && isLoaded && (
          <meshStandardMaterial
            color="grey"
            side={DoubleSide}
            shadowSide={DoubleSide}
          />
        )}
      </mesh>
    );
  });

  return (
    <>
      {isLoaded && (
        <>
          {/* <mesh
            ref={floorRef}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[WORLD_DIM, WORLD_DIM, 1]}
            castShadow
            receiveShadow
          >
            <planeGeometry />
            {texture && isLoaded && (
              <meshStandardMaterial
                map={texture.getTexture()}
                attach="material"
                side={DoubleSide}
              />
            )}
          </mesh> */}
          <Plane scale={50} rotation-x={-Math.PI / 2} receiveShadow>
            <meshStandardMaterial color="grey" shadowSide={DoubleSide} />
          </Plane>
          {walls}
          <ModelBox
            isLoaded={isLoaded}
            position={new Vector3(0, 0.5, -10)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            isLoaded={isLoaded}
            position={new Vector3(5, 0.5, -10)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            isLoaded={isLoaded}
            position={new Vector3(-5, 0.5, -10)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            isLoaded={isLoaded}
            position={new Vector3(-10, 1, -15)}
            scale={new Vector3(1, 1, 1)}
          />
          <ModelBox
            isLoaded={isLoaded}
            position={new Vector3(15, 1, -20)}
            scale={new Vector3(1, 1, 1)}
          />
          <ModelInnequin isLoaded={isLoaded} position={new Vector3(0, 0, -5)} />
          <ModelInnequin
            isLoaded={isLoaded}
            position={new Vector3(5, 0, -5)}
            skinName="SCIFI"
          />
          <ModelInnequin
            isLoaded={isLoaded}
            position={new Vector3(-5, 0, -5)}
            skinName="WOOD2"
          />
        </>
      )}
    </>
  );
}
export default ModelWorld;

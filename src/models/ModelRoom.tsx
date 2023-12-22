import { useCallback } from "react";
import { DoubleSide, Euler, Vector3 } from "three";

import ModelLabel from "./ModelLabel";

interface ModelRoomProps {
  color?: string;
  position?: Vector3;
  rotation?: Euler;
  isLoaded: boolean;
  name?: string;
  labelURI?: string;
}

export const ROOM_DIM = 15;
export const WALL_HEIGHT = 8;

function ModelRoom(props: ModelRoomProps) {
  const wallsData = [
    {
      pos: new Vector3(ROOM_DIM / 2, WALL_HEIGHT / 2, 0),
      rot: new Euler(0, Math.PI / 2, 0),
    },
    {
      pos: new Vector3(-ROOM_DIM / 2, WALL_HEIGHT / 2, 0),
      rot: new Euler(0, Math.PI / 2, 0),
    },
    // {
    //   pos: new Vector3(0, WALL_HEIGHT / 2, ROOM_DIM / 2),
    //   rot: new Euler(0, 0, 0),
    // },
    {
      pos: new Vector3(0, WALL_HEIGHT / 2, -ROOM_DIM / 2),
      rot: new Euler(0, 0, 0),
    },
  ];

  const generateWall = useCallback(
    (position: Vector3, rotation: Euler, scale: Vector3, name: string) => {
      return (
        <mesh
          name={name}
          key={name}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <planeGeometry />
          <meshStandardMaterial
            color={props.color || "#7F7D9C"}
            side={DoubleSide}
            shadowSide={DoubleSide}
          />
        </mesh>
      );
    },
    []
  );

  const walls = wallsData.map((wall, i) => {
    return generateWall(
      wall.pos,
      wall.rot,
      new Vector3(ROOM_DIM, WALL_HEIGHT, 1),
      `ModelRoomWall${i}`
    );
  });

  return (
    <group
      name={props.name || "ModelRoom"}
      position={props.position || new Vector3(0, 0, 0)}
      rotation={props.rotation || new Euler(0, 0, 0)}
    >
      {walls}{" "}
      {generateWall(
        new Vector3(-5, WALL_HEIGHT / 2, ROOM_DIM / 2),
        new Euler(0, 0, 0),
        new Vector3(5, WALL_HEIGHT, 1),
        "ModelRoomWallLeft"
      )}
      {generateWall(
        new Vector3(5, WALL_HEIGHT / 2, ROOM_DIM / 2),
        new Euler(0, 0, 0),
        new Vector3(5, WALL_HEIGHT, 1),
        "ModelRoomWallRight"
      )}
      {props.labelURI && (
        <ModelLabel
          uri={props.labelURI}
          isLoaded={props.isLoaded}
          position={new Vector3(5, 7, 7.6)}
          rotation={new Euler(0, 0, 0)}
          scale={new Vector3(3, 0.69, 1)}
        />
      )}
    </group>
  );
}

export default ModelRoom;

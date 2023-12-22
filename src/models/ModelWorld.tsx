import { useCallback, useEffect, useRef, useState } from "react";
import {
  DoubleSide,
  Euler,
  Mesh,
  RepeatWrapping,
  Vector2,
  Vector3,
} from "three";
import { Sky, TextGeometry } from "three-stdlib";

import { Plane } from "@react-three/drei";
import { extend, RootState, useFrame, useThree } from "@react-three/fiber";

import { InputController } from "../input/InputController";
import { TextureFileLoader } from "../loaders/TextureFileLoader";
import { useClickable } from "../utils/clickable";
import { useRays } from "../utils/rays";
import { Clickable } from "../utils/types";
import ModelBox from "./ModelBox";
import ModelInnequin from "./ModelInnequin";
import ModelRoom from "./ModelRoom";
import ModelRPM from "./ModelRPM";

extend({ TextGeometry });

interface ModelWorldProps {
  inputController: InputController;
  isLoaded: boolean;
}

const WORLD_DIM = 100;
const WALL_HEIGHT = 5;
const TEXTURE_DIM = WORLD_DIM / 4;

function ModelWorld(props: ModelWorldProps) {
  const [clicked, setClicked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sky, setSky] = useState<Sky>();
  const [texture, setTexture] = useState<TextureFileLoader>();

  const floorRef = useRef<Mesh>(null);

  const { intersectObjects } = useRays();
  const { checkClickable } = useClickable();

  const scene = useThree((state: RootState) => state.scene);

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
        name={`ModelWorldWall${i}`}
        key={`ModelWorldWall${i}`}
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

  useFrame((fstate, delta) => {
    if (props.inputController.current.leftButton && !clicked) {
      // if (setPoint) {
      //   setPoint(
      //     new Vector2(
      //       props.inputController.current.pointX,
      //       props.inputController.current.pointY
      //     )
      //   );
      // }
      console.log("Run");
      setClicked(true);
      if (intersectObjects) {
        const secs = intersectObjects(
          scene.children,
          new Vector2(
            props.inputController.current.pointX,
            props.inputController.current.pointY
          )
        );
        for (var i = 0; i < secs.length; i++) {
          if (Object.values(Clickable).includes(secs[i].object.name)) {
            if (checkClickable) checkClickable(secs[i].object.uuid);
          }
        }
      }
    }
    if (!props.inputController.current.leftButton && clicked) {
      setClicked(false);
    }
    // if (props.inputController.current.leftButton) {
    //   console.log("ModelWorld: Left Button");
    //   // if (intersectObjects) {
    //   //   const secs = intersectObjects();
    //   // }
    // }
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
          {/* <Plane
            name="Ground"
            scale={WORLD_DIM}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <meshStandardMaterial color="grey" shadowSide={DoubleSide} />
          </Plane> */}
          {walls}
          <group
            name="GroupAnimations"
            position={new Vector3(-30, 0, -40)}
            rotation={new Euler(0, 0, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomAnimations"
              labelURI="/assets/textures/labels/animations.png"
              color="#65B741"
            />
            <ModelInnequin
              name="InnequinAnimations"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, -5)}
            />
            <ModelRPM
              name="RPMAnimations"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, -5)}
            />
          </group>
          <group
            name="GroupAvatars"
            position={new Vector3(0, 0, -40)}
            rotation={new Euler(0, 0, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomAvatars"
              labelURI="/assets/textures/labels/avatars.png"
              color="#304D30"
            />
            <ModelInnequin
              name="InnequinAvatars"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, -5)}
            />
            <ModelRPM
              name="RPMAvatars"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, -5)}
            />
          </group>
          <group
            name="GroupDynamicScenes"
            position={new Vector3(30, 0, -40)}
            rotation={new Euler(0, 0, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomDynamicScenes"
              labelURI="/assets/textures/labels/dynamic_scenes.png"
              color="#637E76"
            />
            <ModelInnequin
              name="InnequinDynamicScenes"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, -5)}
            />
            <ModelRPM
              name="RPMDynamicScenes"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, -5)}
            />
          </group>
          <group
            name="GroupGoals"
            position={new Vector3(40, 0, -15)}
            rotation={new Euler(0, Math.PI * 1.5, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomGoals"
              labelURI="/assets/textures/labels/goals.png"
              color="#EC8F5E"
            />
            <ModelInnequin
              name="InnequinGoalsIntent"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, 5)}
              rotation={new Euler(0, Math.PI / 2, 0)}
            />
            <ModelRPM
              name="RPMGoalsVerbatim"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, 0)}
              rotation={new Euler(0, Math.PI / 2, 0)}
            />
            <ModelInnequin
              name="InnequinGoalsParameters"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, -5)}
              rotation={new Euler(0, -Math.PI / 2, 0)}
            />
            <ModelRPM
              name="RPMGoalsDynamicData"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, 0)}
              rotation={new Euler(0, -Math.PI / 2, 0)}
            />
            <ModelInnequin
              name="InnequinGoalsEnableDisable"
              isLoaded={isLoaded}
              position={new Vector3(-5, 0, -5)}
              rotation={new Euler(0, Math.PI / 2, 0)}
            />
            <ModelRPM
              name="RPMGoalsMutations"
              isLoaded={isLoaded}
              position={new Vector3(5, 0, 5)}
              rotation={new Euler(0, -Math.PI / 2, 0)}
            />
          </group>
          <group
            name="GroupNarratedActions"
            position={new Vector3(40, 0, 15)}
            rotation={new Euler(0, Math.PI * 1.5, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomNarratedActions"
              labelURI="/assets/textures/labels/narrated_actions.png"
              color="#2B3499"
            />
          </group>
          <group
            name="GroupRelations"
            position={new Vector3(30, 0, 40)}
            rotation={new Euler(0, Math.PI, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomRelations"
              labelURI="/assets/textures/labels/relations.png"
              color="#4F4A45"
            />
          </group>
          <group
            name="GroupSaveRestore"
            position={new Vector3(0, 0, 40)}
            rotation={new Euler(0, Math.PI, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomSaveRestore"
              labelURI="/assets/textures/labels/save_restore.png"
              color="#2D9596"
            />
          </group>
          <group
            name="GroupSkipPause"
            position={new Vector3(-30, 0, 40)}
            rotation={new Euler(0, Math.PI, 0)}
          >
            <ModelRoom
              isLoaded={props.isLoaded}
              name="RoomSkipPause"
              labelURI="/assets/textures/labels/skip_pause.png"
              color="#860A35"
            />
          </group>
          <ModelBox
            name="Box1"
            isLoaded={isLoaded}
            position={new Vector3(-40, 0.5, -10)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            name="Box2"
            isLoaded={isLoaded}
            position={new Vector3(-40, 0.5, 0)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            name="Box3"
            isLoaded={isLoaded}
            position={new Vector3(-40, 0.5, 10)}
            scale={new Vector3(0.5, 0.5, 0.5)}
          />
          <ModelBox
            name="Box4"
            isLoaded={isLoaded}
            position={new Vector3(-40, 1, 15)}
            scale={new Vector3(1, 1, 1)}
          />
          <ModelBox
            name="Box5"
            isLoaded={isLoaded}
            position={new Vector3(-50, 1, -20)}
            scale={new Vector3(1, 1, 1)}
          />
          {/*
          <ModelInnequin
            name="Innequin1"
            // inputController={props.inputController}
            isLoaded={isLoaded}
            position={new Vector3(0, 0, -5)}
          />
          <ModelInnequin
            name="Innequin2"
            // inputController={props.inputController}
            isLoaded={isLoaded}
            position={new Vector3(5, 0, -5)}
            skinName="SCIFI"
          />
          <ModelInnequin
            name="Innequin3"
            // inputController={props.inputController}
            isLoaded={isLoaded}
            position={new Vector3(-5, 0, -5)}
            skinName="WOOD2"
          /> */}
        </>
      )}
    </>
  );
}
export default ModelWorld;

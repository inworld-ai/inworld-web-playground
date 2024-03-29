import { ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { BufferGeometry, Mesh, Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';

import { useClickable } from '../../contexts/ClickableProvider';
import { useUI } from '../../contexts/UIProvider';
import { Clickable } from '../../types/clickable';
import { Cursors } from '../../types/cursors';
import { log } from '../../utils/log';

interface ClickableCubeProps {
  length: number;
  width: number;
  height: number;
  position: Vector3;
  onClick?: { (event: ThreeEvent<MouseEvent>): void } | undefined;
}

function ClickableCube(props: ClickableCubeProps) {
  const refCube = useRef<Mesh>();
  const refUUID = useRef<string>(uuidv4());

  const { addClickable, removeClickable } = useClickable();
  const { cursor, setCursor } = useUI();

  useEffect(() => {
    if (addClickable) addClickable(refUUID.current, onClick);
    return () => {
      if (removeClickable) removeClickable(refUUID.current);
    };
  }, [addClickable, removeClickable]);

  const onClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      console.log('ClickableCube: onClick');
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [props.onClick],
  );

  const onOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      log('CliackableCube: onOut');
      if (setCursor && cursor === Cursors.Pointer) setCursor(Cursors.Auto);
    },
    [cursor],
  );

  const onOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      log('CliackableCube: onOver');
      if (setCursor) setCursor(Cursors.Pointer);
    },
    [cursor],
  );

  return (
    <mesh
      name={Clickable.Cube + '_' + refUUID.current}
      position={props.position}
      ref={refCube as React.RefObject<Mesh<BufferGeometry>>}
      onPointerDown={onClick}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      <boxGeometry
        args={[props.length, props.width, props.height]}
        attach="geometry"
      />
      <meshPhongMaterial
        depthWrite={false}
        color={'#ffffff'}
        opacity={0}
        transparent
        attach="material"
      />
    </mesh>
  );
}

export default ClickableCube;

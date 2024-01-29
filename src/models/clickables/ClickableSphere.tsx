import { ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { BufferGeometry, Mesh, Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';

import { useClickable } from '../../contexts/ClickableProvider';
import { useUI } from '../../contexts/UIProvider';
import { Clickable } from '../../types/clickable';
import { Cursors } from '../../types/cursors';
import { log } from '../../utils/log';

interface ClickableSphereProps {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  position: Vector3;
  onClick?: { (event: ThreeEvent<MouseEvent>): void } | undefined;
}

function ClickableSphere(props: ClickableSphereProps) {
  const refSphere = useRef<Mesh>();
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
      console.log('ClickableSphere: onClick');
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [props.onClick],
  );

  const onOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      log('ClickableSphere: onOut');
      if (setCursor && cursor === Cursors.Pointer) setCursor(Cursors.Auto);
    },
    [cursor],
  );

  const onOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      log('ClickableSphere: onOver');
      if (setCursor) setCursor(Cursors.Pointer);
    },
    [cursor],
  );

  return (
    <mesh
      name={Clickable.Sphere + '_' + refUUID.current}
      position={props.position}
      ref={refSphere as React.RefObject<Mesh<BufferGeometry>>}
      onPointerDown={onClick}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      <boxGeometry
        args={[props.radius, props.widthSegments, props.heightSegments]}
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

export default ClickableSphere;

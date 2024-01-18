import { useCallback, useEffect, useRef } from 'react';
import { BufferGeometry, Mesh, Vector3 } from 'three';

import { useClickable } from '../contexts/ClickableProvider';
import { Clickable } from '../types/types';

interface ClickableCubeProps {
  length: number;
  width: number;
  height: number;
  position: Vector3;
  onClick?: Function | undefined;
}

function ClickableCube(props: ClickableCubeProps) {
  const refCube = useRef<Mesh>();

  const { addClickable } = useClickable();

  useEffect(() => {
    if (refCube.current) {
      if (addClickable) addClickable(refCube.current.uuid, onClick);
    }
  }, [refCube, addClickable]);

  const onClick = useCallback(() => {
    console.log('ClickableCube: onClick');
    if (props.onClick) {
      props.onClick();
    }
  }, [props.onClick]);

  return (
    <mesh
      name={Clickable.Cube}
      position={props.position}
      ref={refCube as React.RefObject<Mesh<BufferGeometry>>}
      onClick={() => onClick()}
    >
      <boxGeometry
        args={[props.length, props.width, props.height]}
        attach="geometry"
      />
      <meshPhongMaterial
        color={'#ffffff'}
        opacity={0.1}
        transparent
        attach="material"
      />
    </mesh>
  );
}

export default ClickableCube;

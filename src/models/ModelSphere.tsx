import { useCallback, useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';

import { STATE_INIT, useInworld } from '../contexts/InworldProvider';
import { useUI } from '../contexts/UIProvider';
import { Cursors } from '../types/cursors';

interface ModelSphereProps {
  isLoaded: boolean;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  onClick?: (name: string) => void;
}

function ModelSphere(props: ModelSphereProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { open, state } = useInworld();
  const { cursor, setCursor } = useUI();

  useEffect(() => {
    if (props.isLoaded) {
      setIsLoaded(true);
    }
  }, []);

  const onClick = useCallback((e: any) => {
    e.stopPropagation();
    if (state !== STATE_INIT) return;
    const options: any = { name: props.name! };
    if (props.characterId) options.characterId = props.characterId;
    open(options);
    if (props.onClick && props.name) {
      props.onClick(props.name);
    }
  }, []);

  const onOut = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (setCursor && cursor === Cursors.Pointer) setCursor(Cursors.Auto);
    },
    [cursor]
  );

  const onOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (setCursor) setCursor(Cursors.Pointer);
    },
    [cursor]
  );

  return (
    <>
      {isLoaded && (
        <>
          <group
            position={props.position || new Vector3(0, 0, 0)}
            rotation={props.rotation || new Euler(0, 0, 0)}
            onPointerDown={onClick}
            onPointerOut={onOut}
            onPointerOver={onOver}
          >
            <mesh name={props.name || "Innequin"} castShadow receiveShadow>
              <sphereGeometry args={[0.5, 20, 20]} />
              <meshStandardMaterial color={"blue"} />
            </mesh>
          </group>
        </>
      )}
    </>
  );
}
export default ModelSphere;

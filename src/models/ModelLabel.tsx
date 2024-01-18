import { useCallback, useEffect, useRef, useState } from 'react';
import { DoubleSide, Euler, Mesh, Vector3 } from 'three';

import { TextureFileLoader } from '../loaders/TextureFileLoader';

interface ModelLabelProps {
  isLoaded: boolean;
  name?: string;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
  uri: string;
}

function ModelLabel(props: ModelLabelProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  // const [loader, setLoader] = useState<TextureFileLoader>();

  const labelRef = useRef<Mesh>(null);
  const loaderRef = useRef<TextureFileLoader>(new TextureFileLoader(props.uri));

  useEffect(() => {
    if (!isLoaded) {
      // setLoader(new TextureFileLoader(props.uri));
      loaderRef.current.load(onLoad);
    }
  }, [isLoaded]);

  const onLoad = useCallback(() => {
    // console.log("Loaded Texture");
    if (loaderRef.current && loaderRef.current.getTexture()) {
      loaderRef.current.getTexture()!.flipY = true;
      // texture.getTexture()!.wrapS = RepeatWrapping;
      // texture.getTexture()!.wrapT = RepeatWrapping;
      // texture.getTexture()!.repeat.set(TEXTURE_DIM, TEXTURE_DIM);
      setIsLoaded(true);
    }
  }, [loaderRef.current]);

  return (
    <>
      {isLoaded && (
        <mesh
          ref={labelRef}
          position={props.position || new Vector3(5, 7, 7.6)}
          rotation={props.rotation || new Euler(0, 0, 0)}
          scale={props.scale || new Vector3(3, 0.69, 1)}
          // castShadow
          // receiveShadow
        >
          <planeGeometry />
          {loaderRef.current.getTexture() && (
            <meshStandardMaterial
              map={loaderRef.current.getTexture()}
              attach="material"
              side={DoubleSide}
            />
          )}
        </mesh>
      )}
    </>
  );
}

export default ModelLabel;

import React, {
  Dispatch,
  Ref,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Raycaster,
  Vector2,
} from 'three';

interface RaysContextValues {
  camera: PerspectiveCamera | null;
  intersectObjects: {
    (
      objects: Object3D<Object3DEventMap>[],
      point: Vector2,
      recursive: boolean,
    ): void;
  } | null;
  rayRef: Ref<Raycaster> | null;
  setCamera: Dispatch<SetStateAction<PerspectiveCamera>> | null;
}

const RaysContext = React.createContext<RaysContextValues>({
  camera: null,
  intersectObjects: null,
  rayRef: null,
  setCamera: null,
});

const useRays = () => React.useContext(RaysContext);

function RaysProvider({ children }: any) {
  const [camera, setCamera] = useState(new PerspectiveCamera());
  const rayRef = useRef(new Raycaster());

  const intersectObjects = useCallback(
    (
      objects: Object3D<Object3DEventMap>[],
      point: Vector2,
      recursive: boolean | undefined = true,
    ) => {
      if (!camera) throw new Error('Rays: Camera not set.');
      rayRef.current.setFromCamera(point, camera);
      if (!objects)
        throw new Error('Rays: intersectObjects, objects undefined.');
      return rayRef.current.intersectObjects(objects, recursive);
    },
    [camera, rayRef],
  );

  return (
    <RaysContext.Provider
      value={{
        camera,
        intersectObjects,
        rayRef,
        setCamera,
      }}
    >
      {children}
    </RaysContext.Provider>
  );
}

export { RaysProvider, useRays };

import { RootState, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Vector2 } from 'three';

import { CameraCore } from '../camera/CameraCore';
import { useRays } from '../contexts/RaysProvider';
import { InputController } from './InputController';

export type ClickableControllerProps = {
  cameraCore: CameraCore;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  inputController: InputController;
  isLoaded: boolean;
};

function ClickableController(props: ClickableControllerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const scene = useThree((state: RootState) => state.scene);

  // const { checkClickable } = useClickable();
  const { intersectObjects, camera } = useRays();

  useEffect(() => {
    if (!isLoaded && props.isLoaded && camera) {
      props.canvasRef.current?.addEventListener(
        'mousedown',
        (e: MouseEvent) => {
          if (e.button !== 0) return;

          const pointX = (e.clientX / window.innerWidth) * 2 - 1;
          const pointY = -(e.clientY / window.innerHeight) * 2 + 1;

          if (intersectObjects) {
            const secs = intersectObjects(
              scene.children,
              new Vector2(pointX, pointY),
            );
            for (let i = 0; i < secs.length; i++) {
              console.log('Click', i, secs[i].object.name);
              // if (Object.values(Clickable).includes(secs[i].object.name)) {
              //   if (checkClickable) checkClickable(secs[i].object.uuid);
              // }
            }
          }
        },
      );
      props.canvasRef.current?.addEventListener('mouseup', () => {
        // console.log('mouseup');
      });
      props.canvasRef.current?.addEventListener('mousemove', () => {
        // console.log('mousemove');
      });
      setIsLoaded(true);
    }
  }, [
    intersectObjects,
    camera,
    isLoaded,
    props.isLoaded,
    props.cameraCore,
    props.inputController,
    props.canvasRef.current,
    props.inputController.current,
  ]);

  useEffect(() => {
    if (intersectObjects) {
      console.log('ClickableController intersectObjects update');
    }
  }, [intersectObjects]);

  return <></>;
}

export default ClickableController;

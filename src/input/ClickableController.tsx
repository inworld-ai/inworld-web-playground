import { RootState, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { Vector2 } from 'three';

import { CameraCore } from '../camera/CameraCore';
import { useClickable } from '../contexts/ClickableProvider';
import { useRays } from '../contexts/RaysProvider';
import { ClickableParts } from '../types/clickable';
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

  const { checkClickable } = useClickable();
  const { intersectObjects, camera } = useRays();

  useEffect(() => {
    if (false && props.isLoaded && camera) {
      props.canvasRef.current?.addEventListener('mousedown', onClick);
      props.canvasRef.current?.addEventListener('mouseup', () => {
        // console.log('mouseup');
      });
      props.canvasRef.current?.addEventListener('mousemove', () => {
        // console.log('mousemove');
      });
      setIsLoaded(true);
    }
  }, [
    checkClickable,
    intersectObjects,
    camera,
    isLoaded,
    props.isLoaded,
    props.cameraCore,
    props.canvasRef.current,
    props.inputController.current,
  ]);

  useEffect(() => {
    if (false) {
      props.canvasRef.current?.removeEventListener('mousedown', onClick);
      props.canvasRef.current?.addEventListener('mousedown', onClick);
      props.canvasRef.current?.addEventListener('mouseup', () => {
        // console.log('mouseup');
      });
      props.canvasRef.current?.addEventListener('mousemove', () => {
        // console.log('mousemove');
      });
    }
  }, [
    checkClickable,
    intersectObjects,
    camera,
    isLoaded,
    props.isLoaded,
    props.canvasRef.current,
  ]);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      console.log('ClickableController: onClick');

      const pointX = (event.clientX / window.innerWidth) * 2 - 1;
      const pointY = -(event.clientY / window.innerHeight) * 2 + 1;

      if (intersectObjects && checkClickable) {
        const secs = intersectObjects(
          scene.children,
          new Vector2(pointX, pointY),
        );
        if (secs.length > 0) {
          const parts: string[] = (secs[0].object.name as string).split('_');
          console.log(
            'Click',
            parts[ClickableParts.Name],
            parts[ClickableParts.UUID],
          );
          checkClickable(parts[ClickableParts.UUID]);
        }
      }
    },
    [intersectObjects, checkClickable],
  );

  onClick;

  return <></>;
}

export default ClickableController;

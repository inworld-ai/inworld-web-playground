import { Object3D, Object3DEventMap, Raycaster, Scene, Vector2 } from 'three';

import { CameraCore } from '../camera/CameraCore';
import { ClickableParts } from '../types/ClickableTypes';
import { clickManager } from './ClickManager';

export interface ClickDetectionProps {
  cameraCore: CameraCore;
  scene: Scene;
}

export default class ClickDetection {

  cameraCore: CameraCore;
  raycaster: Raycaster;
  scene: Scene;

  constructor(props: ClickDetectionProps) {

    this.cameraCore = props.cameraCore;
    this.raycaster = new Raycaster();
    this.scene = props.scene;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);

  }

  intersectObjects(
    objects: Object3D<Object3DEventMap>[],
    point: Vector2,
    recursive: boolean | undefined = true) {
    if (!this.cameraCore.camera) throw new Error('ClickDetection: Camera not set.');
    if (!objects) throw new Error('ClickDetection: intersectObjects, objects undefined.');
    this.raycaster.setFromCamera(point, this.cameraCore.camera);
    return this.raycaster.intersectObjects(objects, recursive);
  }

  onMouseDown(event: MouseEvent) {

    if (event.button !== 0) return;
    event.stopPropagation();

    const pointX = (event.clientX / window.innerWidth) * 2 - 1;
    const pointY = -(event.clientY / window.innerHeight) * 2 + 1;
    const secs = this.intersectObjects(
      this.scene.children,
      new Vector2(pointX, pointY),
    );

    if (secs.length > 0) {
      const parts: string[] = (secs[0].object.name as string).split('_');
      clickManager.checkClickable(parts[ClickableParts.UUID]);
    }

  }

  onMouseMove(event: MouseEvent) {
    // console.log('mousemove');
  }

  onMouseUp(event: MouseEvent) {
    // console.log('mouseup');
  }

}

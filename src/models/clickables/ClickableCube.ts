import {
  BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3
} from 'three';
import { v4 as uuidv4 } from 'uuid';

import { clickManager } from '../../helpers/ClickManager';
import { Clickable } from '../../types/ClickableTypes';

export interface ClickableCubeProps {
  length: number;
  width: number;
  height: number;
  position: Vector3;
  onClick?: { (event: MouseEvent): void } | undefined;
}

export default class ClickableCube {

  cube: Mesh;
  geometry: BoxGeometry;
  uuid: string;

  constructor(props: ClickableCubeProps) {

    this.uuid = uuidv4();

    this.geometry = new BoxGeometry(props.length, props.width, props.height);

    this.cube = new Mesh(this.geometry, new MeshPhongMaterial({ color: 0x00ff00, depthWrite: false, opacity: 0.5 }));
    this.cube.name = Clickable.Cube + '_' + this.uuid;
    this.cube.position.set(props.position.x, props.position.y, props.position.z);

    if (props.onClick) {
      clickManager.addClickable(this.uuid, props.onClick)
    }

  }

  get model() {
    return this.cube;
  }

}

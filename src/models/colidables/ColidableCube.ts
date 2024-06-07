import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';

import { colideManager } from '../../helpers/ColideManager';
import { Colidable } from '../../types/ColidableTypes';

export interface ColidableCubeProps {
  length: number;
  width: number;
  height: number;
  position: Vector3;
  onColide?: { (): void } | undefined;
}

export default class ColidableCube {

  cube: Mesh;
  geometry: BoxGeometry;
  uuid: string;

  constructor(props: ColidableCubeProps) {

    this.uuid = uuidv4();

    this.geometry = new BoxGeometry(props.length, props.width, props.height);

    this.cube = new Mesh(this.geometry, new MeshPhongMaterial({ color: 0x00ff00, depthWrite: false, opacity: 0.5 }));
    this.cube.name = Colidable.Cube + '_' + this.uuid;
    this.cube.position.set(props.position.x, props.position.y, props.position.z);

    if (props.onColide) {
      colideManager.addColidable(this.uuid, props.onColide)
    }

  }

  get model() {
    return this.cube;
  }

  show() {
    (this.cube.material as MeshPhongMaterial).depthWrite = true;
    (this.cube.material as MeshPhongMaterial).opacity = 1;
  }

}

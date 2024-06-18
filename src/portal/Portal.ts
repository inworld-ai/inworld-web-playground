import {
    DoubleSide, Euler, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Vector3
} from 'three';

export interface PortalProps {
  position?: Vector3;
  rotation?: Euler;
}

const HEIGHT: number = 3;
const WIDTH: number = 2;

export default class Portal {

  mesh: Mesh;

  constructor(props: PortalProps) {

    this.mesh = new Mesh(new PlaneGeometry(WIDTH, HEIGHT), new MeshPhongMaterial({color: 0x000000, side: DoubleSide}));

    if (props.position) {
      this.mesh.position.set(props.position.x, props.position.y, props.position.z);
    }

    if (props.rotation) {
      this.mesh.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    }

  }

  get portal(): Mesh {
    return this.mesh;
  }

  get position(): Vector3 {
    return this.portal.position;
  }

  get rotation(): Euler {
    return this.portal.rotation;
  }

}

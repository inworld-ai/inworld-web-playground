import { Vector3 } from 'three';

import EventDispatcher from '../events/EventDispatcher';

export interface RoomBaseProps {
  position?: Vector3;
  rotation?: Vector3;
}

export default class RoomBase extends EventDispatcher {

  isLoaded: boolean;

  constructor() {
    super();
    this.isLoaded = false;
  }

}

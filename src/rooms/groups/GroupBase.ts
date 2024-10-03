import { Group, Vector3 } from 'three';

import EventDispatcher from '../../events/EventDispatcher';

export interface GroupBaseProps {
  name: string;
  position?: Vector3;
  rotation?: Vector3;
}

export default class GroupBase extends EventDispatcher {

  group: Group;
  isLoaded: boolean;
  name: string;

  constructor(props: GroupBaseProps) {

    super();
    
    this.name = props.name;
    this.isLoaded = false;
    this.group = new Group();
    if (props.position)
      this.group.position.set(props.position.x, props.position.y, props.position.z);
    if (props.rotation)
      this.group.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);

  }

}

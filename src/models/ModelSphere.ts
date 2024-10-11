

import { Euler, Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

import EventDispatcher from '../events/EventDispatcher';
import { inworld, OpenConnectionType, STATE_INIT } from '../inworld/Inworld';
import { Config } from '../utils/config';
import { log } from '../utils/log';
import ClickableCube from './clickables/ClickableCube';

export interface ModelSphereProps {
  isLoaded: boolean;
  name?: string;
  characterId?: string;
  position?: Vector3;
  rotation?: Euler;
  onClick?: (name: string) => void;
}

export const DEFAULT_NAME = 'Sphere';

export const EVENT_LOADED = 'event_loaded';

export default class ModelSphere extends EventDispatcher {

  callbackClick?: (name: string) => void;
  boundingBox: ClickableCube;
  characterId?: string;
  group: Group;
  isLoaded: boolean;
  name?: string;

  constructor(props: ModelSphereProps) {

    super();

    this.isLoaded = false;
  
    this.characterId = props.characterId;
    this.name = props.name;

    this.callbackClick = props.onClick;

    this.onClick = this.onClick.bind(this);

    this.group = new Group();
    
    if (props.position) {
      this.group.position.set(props.position.x, props.position.y, props.position.z)
    }

    if (props.rotation) {
      this.group.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
    }

    const geometry = new SphereGeometry( 0.5, 20, 20 ); 
    const material = new MeshBasicMaterial( { color: 0x00ff00 } ); 
    const sphere = new Mesh( geometry, material )

    this.boundingBox = new ClickableCube({ length: 1, width: 1, height: 1, position: new Vector3(0, 0, 0), onClick: this.onClick });

    this.group.add(sphere);
    this.group.add(this.boundingBox.model);

    this.setLoaded(true);

  }

  get model(): Group {
    return this.group;
  }

  setLoaded(loaded: boolean) {
    if (loaded !== this.isLoaded) {
      this.isLoaded = loaded;
      this.dispatch(EVENT_LOADED, loaded);
    }
  }

  onClick() {
    if (!inworld.open) return;
    if (inworld.state !== STATE_INIT) return;
    const options: OpenConnectionType = { name: this.name || DEFAULT_NAME };
    if (this.characterId) options.characterId = this.characterId;
    inworld.open(options);
    if (this.callbackClick && this.name) {
      this.callbackClick(this.name);
    }
  }

}

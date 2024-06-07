
type IColidablesType = { [key: string]: Function | null };

class ColideManager {

  Colidables: IColidablesType;

  constructor() {
    this.Colidables = {};
  }

  addColidable(uuid: string, callback: Function) {
    if (!this.Colidables[uuid]) {
      this.Colidables[uuid] = callback;
    }
  }

  checkColidable(uuid: string) {
    if (this.Colidables[uuid]) {
      this.Colidables[uuid]!();
    }
  }

  removeColidable(uuid: string) {
    if (this.Colidables[uuid]) {
      delete this.Colidables[uuid];
    }
  }

}

export const colideManager = new ColideManager();

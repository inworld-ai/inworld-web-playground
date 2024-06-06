
type IClickablesType = { [key: string]: Function | null };

class ClickManager {

  clickables: IClickablesType;

  constructor() {
    this.clickables = {};
  }

  addClickable(uuid: string, callback: Function) {
    if (!this.clickables[uuid]) {
      this.clickables[uuid] = callback;
    }
  }

  checkClickable(uuid: string) {
    if (this.clickables[uuid]) {
      this.clickables[uuid]!();
    }
  }

  removeClickable(uuid: string) {
    if (this.clickables[uuid]) {
      delete this.clickables[uuid];
    }
  }

}

export const clickManager = new ClickManager();

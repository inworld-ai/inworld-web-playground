interface CurrentProps {
  leftButton: boolean;
  rightButton: boolean;
  mouseX: number;
  mouseXDelta: number;
  mouseY: number;
  mouseYDelta: number;
  pointX: number;
  pointY: number;
}

type IKeyType = { [key: string]: any };

export class InputController {

  current: CurrentProps;
  previous: CurrentProps | null;
  keys: IKeyType;
  previousKeys: IKeyType;
  hasMoved: boolean;

  constructor() {
    this.current = {
      leftButton: false,
      rightButton: false,
      mouseX: 0,
      mouseXDelta: 0,
      mouseY: 0,
      mouseYDelta: 0,
      pointX: 0,
      pointY: 0,
    }
    this.previous = null;
    this.keys = {};
    this.previousKeys = {};
    this.hasMoved = false;
    this.init();
  }

  init() {
    document.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e), false);
    document.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e), false);
    document.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e), false);
    document.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e), false);
    document.body.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e), false);
  }

  onContextMenu(e: MouseEvent) {
    // console.log('onContextMenu');
    e.preventDefault();
  }

  onMouseDown(e: MouseEvent) {
    switch (e.button) {
      case 0: {
        // console.log("onMouseDown")
        this.current.pointX = (e.clientX / window.innerWidth) * 2 - 1;
        this.current.pointY = -(e.clientY / window.innerHeight) * 2 + 1;
        this.current.leftButton = true;
        break;
      }
      case 2: {
        this.current.rightButton = true;
        break;
      }
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (e.button) {
      case 0: {
        this.current.leftButton = false;
        break;
      }
      case 2: {
        this.current.rightButton = false;
        break;
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    this.current.mouseX = e.pageX - window.innerWidth / 2;
    this.current.mouseY = e.pageY - window.innerHeight / 2;
    if (this.current.rightButton) {

      if (this.previous === null) {
        this.previous = { ...this.current };
      }

      this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
      this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;

      this.hasMoved = true;
    }
  }

  onKeyDown(e: KeyboardEvent) {
    // console.log('onKeyDown', e.key);
    this.keys[e.key] = true;
  }

  onKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  update() {
    if (this.hasMoved) {
      this.hasMoved = false;
    } else {
      this.current.mouseXDelta = 0;
      this.current.mouseYDelta = 0;
    }
    this.previous = { ...this.current };
  }

}
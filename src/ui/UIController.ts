import EventDispatcher from '../events/EventDispatcher';
import { CursorTypes } from '../types/CursorTypes';

const EVENT_CURSOR = "event_cursor";
const EVENT_LABEL1 = "event_label1";
const EVENT_MENU_COLLAPSED = "event_menu_collapsed";
const EVENT_MENU_WORLD = "event_menu_world";

class UIController extends EventDispatcher {

  cursor: string;
  label1: string;
  menuCollapsed: boolean;
  menuWorldBuilder: boolean;

  constructor() {
    super();
    this.cursor = CursorTypes.Auto;
    this.label1 = '';
    this.menuCollapsed = true;
    this.menuWorldBuilder = true;
  }

  setCursor(cursor: string) {
    if (this.cursor !== cursor) {
      this.cursor = cursor;
      this.dispatch(EVENT_CURSOR, cursor);
    }
  }

  setLabel1(label1: string) {
    if (this.label1 !== label1) {
      this.label1 = label1;
      this.dispatch(EVENT_LABEL1, label1);
    }
  }
  setMenuCollapsed(menuCollapsed: boolean) {
    if (this.menuCollapsed !== menuCollapsed) {
      this.menuCollapsed = menuCollapsed;
      this.dispatch(EVENT_MENU_COLLAPSED, menuCollapsed);
    }
  }
  setMenuWorldBuilder(menuWorldBuilder: boolean) {
    if (this.menuWorldBuilder !== menuWorldBuilder) {
      this.menuWorldBuilder = menuWorldBuilder;
      this.dispatch(EVENT_MENU_WORLD, menuWorldBuilder);
    }
  }

}

export { EVENT_CURSOR, EVENT_LABEL1, EVENT_MENU_COLLAPSED, EVENT_MENU_WORLD }

export const uiController = new UIController();

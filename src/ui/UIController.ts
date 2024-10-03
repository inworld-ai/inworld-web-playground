import EventDispatcher from '../events/EventDispatcher';
import { STATE_INIT, STATE_OPENING } from '../inworld/Inworld';
import { CursorTypes } from '../types/CursorTypes';

export const EVENT_CURSOR = "event_cursor";
export const EVENT_LABEL1 = "event_label1";
export const EVENT_MENU_COLLAPSED = "event_menu_collapsed";
export const EVENT_MENU_ROOM = "event_menu_room";
export const EVENT_MENU_DATA = "event_menu_data";
export const EVENT_MENU_WORLD = "event_menu_world";

export enum RoomMenuType { 
  NONE = "NONE",
  ANIMATIONS = "ANIMATIONS",
  AVATARS = "AVATARS",
  EMOTIONS = "EMOTIONS",
  GOALS = "GOALS",
}

class UIController extends EventDispatcher {

  cursor: string;
  label1: string;
  menuCollapsed: boolean;
  menuWorldBuilder: boolean;
  roomMenu: RoomMenuType;

  constructor() {
    super();
    this.cursor = CursorTypes.Auto;
    this.label1 = '';
    this.menuCollapsed = true;
    this.menuWorldBuilder = true;
    this.roomMenu = RoomMenuType.NONE;

  }
 
  setCursor(cursor: string) {
    if (this.cursor !== cursor) {
      this.cursor = cursor;
      this.dispatch(EVENT_CURSOR, cursor);
    }
  }

  setInworldState(state: string) {
    console.log('UIController onInworldState', state);
    if (state === STATE_INIT) {
      this.setRoomMenuType(RoomMenuType.NONE);
    }
    if (state === STATE_OPENING) {
      this.setCursor(CursorTypes.Wait);
    } else {
      this.setCursor(CursorTypes.Auto);
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

  setRoomMenuType(type: RoomMenuType) {
    if (this.roomMenu !== type) {
      this.roomMenu = type;
      this.dispatch(EVENT_MENU_ROOM, this.roomMenu);
    }
  }

  setRoomMenuData(data: any) {
    this.dispatch(EVENT_MENU_DATA, data);
  }

}

export const uiController = new UIController();

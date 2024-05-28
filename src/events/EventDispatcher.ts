export type CallbackType = {
  details?: any | undefined;
}

export type EventsType = {
  [key: string]: EventType;
}

export type EventType = {
  listeners: Function[]
}

export default class EventDispatcher {

  events: EventsType;

  constructor() {
    this.events = {};
  }

  addListener(event: string, callback: Function) {
    // Check if the callback is not a function
    if (typeof callback !== "function") {
      console.error(
        `The listener callback must be a function, the given type is ${typeof callback}`
      );
      return false;
    } // Check if the event is not a string
    if (typeof event !== "string") {
      console.error(
        `The event name must be a string, the given type is ${typeof event}`
      );
      return false;
    }

    // Create the event if not exists
    if (this.events[event] === undefined) {
      this.events[event] = {
        listeners: [],
      };
    }

    this.events[event].listeners.push(callback);
  }

  dispatch(event: string, details?: any | undefined) {
    // Check if this event not exists
    if (this.events[event] === undefined) {
      console.warn(`The event: ${event} is being dispatched with no listeners.`);
      return false;
    }
    this.events[event].listeners.forEach((listener) => {
      listener(details);
    });
  }

  removeListener(event: string, callback: Function) {
    // Check if this event not exists
    if (this.events[event] === undefined) {
      console.error(`This event: ${event} does not exist`);
      return false;
    }

    this.events[event].listeners = this.events[event].listeners.filter(
      (listener) => {
        return listener.toString() !== callback.toString();
      }
    );
  }
}

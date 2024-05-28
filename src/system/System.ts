import EventDispatcher from '../events/EventDispatcher';

enum MicrophoneModes {
  NORMAL,
  PTT,
}
const EVENT_LOADING_STATE = "event_loading_state";
const EVENT_LOADING_PROGRESS = "event_loading_progress";
const EVENT_MICROPHONE_MODE = "event_complete";
const EVENT_SYSTEM_STATE = "event_system_state";

const STATE_ERROR = 'state_error';
const STATE_INIT = 'state_init';
const STATE_PAUSED = 'state_paused';
const STATE_RUNNING = 'state_running';

class System extends EventDispatcher {

  loading: boolean;
  loadingPercent: number;
  microphoneMode: MicrophoneModes;
  systemState: string;

  constructor() {
    super();
    this.loading = false;
    this.loadingPercent = 0;
    this.microphoneMode = MicrophoneModes.NORMAL;
    this.systemState = STATE_INIT;
  }

  setLoading(state: boolean) {
    if (this.loading !== state) {
      this.loading = state;
      this.dispatch(EVENT_LOADING_STATE, this.loading);
    }
  }

  setLoadingPercent(percent: number) {
    if (this.loadingPercent !== percent) {
      this.loadingPercent = percent;
      this.dispatch(EVENT_LOADING_PROGRESS, this.loadingPercent);
    }
  }

  setMicrophoneMode(mode: MicrophoneModes) {
    if (this.microphoneMode !== mode) {
      this.microphoneMode = mode;
      this.dispatch(EVENT_MICROPHONE_MODE, this.microphoneMode);
    }
  }

  setSystemState(state: string) {
    if (this.systemState !== state) {
      this.systemState = state;
      this.dispatch(EVENT_SYSTEM_STATE, this.systemState);
    }
  }

}

export {
  MicrophoneModes,
  EVENT_LOADING_STATE,
  EVENT_MICROPHONE_MODE,
  EVENT_LOADING_PROGRESS,
  EVENT_SYSTEM_STATE,
  STATE_ERROR,
  STATE_INIT,
  STATE_PAUSED,
  STATE_RUNNING
}

export const system = new System();

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { log } from '../utils/log';

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

interface InputContextValues {
  current: CurrentProps;
  previous: CurrentProps | null;
  keys: IKeyType;
  hasMoved: boolean;
  updateInput: { (): void } | null;
}

type IKeyType = { [key: string]: any };

const InputContext = createContext<InputContextValues>({
  current: {
    leftButton: false,
    rightButton: false,
    mouseX: 0,
    mouseXDelta: 0,
    mouseY: 0,
    mouseYDelta: 0,
    pointX: 0,
    pointY: 0,
  },
  previous: null,
  keys: {},
  hasMoved: false,
  updateInput: null,
});

const useInput = () => useContext(InputContext);

function InputProvider({ children }: any) {
  const [current, setCurrent] = useState({
    leftButton: false,
    rightButton: false,
    mouseX: 0,
    mouseXDelta: 0,
    mouseY: 0,
    mouseYDelta: 0,
    pointX: 0,
    pointY: 0,
    updateInput: null,
  });
  const [previous, setPrevious] = useState<CurrentProps | null>(null);
  const [keys, setKeys] = useState({});
  const [hasMoved, setHasMoved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    // console.log("InputController Init");
    document.addEventListener(
      'mousedown',
      (e: MouseEvent) => onMouseDown(e),
      false,
    );
    document.addEventListener(
      'mouseup',
      (e: MouseEvent) => onMouseUp(e),
      false,
    );
    document.addEventListener(
      'mousemove',
      (e: MouseEvent) => onMouseMove(e),
      false,
    );
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => onKeyDown(e),
      false,
    );
    document.addEventListener('keyup', (e: KeyboardEvent) => onKeyUp(e), false);
    document.body.addEventListener(
      'contextmenu',
      (e: MouseEvent) => onContextMenu(e),
      false,
    );
    setLoaded(true);
  }, [loaded]);

  const onContextMenu = useCallback((e: MouseEvent) => {
    log('onContextMenu');
    e.preventDefault();
  }, []);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      const state = { ...current };

      switch (e.button) {
        case 0: {
          log('onMouseDown Left');
          state.pointX = (e.clientX / window.innerWidth) * 2 - 1;
          state.pointY = -(e.clientY / window.innerHeight) * 2 + 1;
          state.leftButton = true;
          setCurrent(state);
          break;
        }
        case 2: {
          log('onMouseDown Right');
          state.rightButton = true;
          setCurrent(state);
          break;
        }
      }
    },
    [current],
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      const state = { ...current };
      switch (e.button) {
        case 0: {
          state.leftButton = false;
          setCurrent(state);
          break;
        }
        case 2: {
          state.rightButton = false;
          setCurrent(state);
          break;
        }
      }
    },
    [current],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = { ...current };
      state.mouseX = e.pageX - window.innerWidth / 2;
      state.mouseY = e.pageY - window.innerHeight / 2;
      if (state.rightButton) {
        if (previous === null) {
          setPrevious({ ...state });
          state.mouseXDelta = 0;
          state.mouseYDelta = 0;
        } else {
          state.mouseXDelta = state.mouseX - previous.mouseX;
          state.mouseYDelta = state.mouseY - previous.mouseY;
        }
        setCurrent(state);
        setHasMoved(true);
      }
    },
    [current, previous],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const state = { ...keys } as IKeyType;
      state[e.key] = true;
      setKeys(state);
    },
    [keys],
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const state = { ...keys } as IKeyType;
      state[e.key] = false;
      setKeys(state);
    },
    [keys],
  );

  const updateInput = useCallback(() => {
    const state = { ...current };
    if (hasMoved) {
      setHasMoved(false);
    } else {
      state.mouseXDelta = 0;
      state.mouseYDelta = 0;
      setCurrent(state);
    }
    setPrevious({ ...state });
  }, [current, hasMoved]);

  return (
    <InputContext.Provider
      value={{ current, previous, keys, hasMoved, updateInput }}
    >
      {children}
    </InputContext.Provider>
  );
}

export { InputProvider, useInput };

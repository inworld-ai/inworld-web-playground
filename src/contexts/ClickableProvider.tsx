import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

type IClickablesType = { [key: string]: Function | null };

interface ClickableContextValues {
  clickables: IClickablesType;
  addClickable: { (uuid: string, callback: Function): void } | null;
  checkClickable: { (uuid: string): void } | null;
  removeClickable: { (uuid: string): void } | null;
}

const ClickableContext = createContext<ClickableContextValues>({
  clickables: {},
  addClickable: null,
  checkClickable: null,
  removeClickable: null,
});

const useClickable = () => useContext(ClickableContext);

function ClickableProvider({ children }: PropsWithChildren) {
  const [clickables, setClickables] = useState<IClickablesType>({});

  const addClickable = useCallback(
    (uuid: string, callback: Function) => {
      if (!clickables[uuid]) {
        const collection = { ...clickables };
        collection[uuid] = callback;
        setClickables(collection);
      }
    },
    [clickables],
  );

  const checkClickable = useCallback(
    (uuid: string) => {
      if (clickables[uuid]) {
        clickables[uuid]!();
      }
    },
    [clickables],
  );

  const removeClickable = useCallback(
    (uuid: string) => {
      if (clickables[uuid]) {
        const collection = { ...clickables };
        delete collection[uuid];
        setClickables(collection);
      }
    },
    [clickables],
  );

  return (
    <ClickableContext.Provider
      value={{ clickables, addClickable, checkClickable, removeClickable }}
    >
      {children}
    </ClickableContext.Provider>
  );
}

export { ClickableProvider, useClickable };

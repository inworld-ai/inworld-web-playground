import { createContext, useCallback, useContext, useState } from 'react';

type IClickablesType = { [key: string]: Function | null };

interface ClickableContextValues {
  clickables: IClickablesType;
  addClickable: Function | null;
  checkClickable: Function | null;
}

const ClickableContext = createContext<ClickableContextValues>({
  clickables: {},
  addClickable: null,
  checkClickable: null,
});

const useClickable = () => useContext(ClickableContext);

function ClickableProvider({ children, ...props }: any) {
  const [clickables, setClickables] = useState<IClickablesType>({});

  const addClickable = useCallback(
    (uuid: string, callback: Function) => {
      if (!clickables[uuid]) {
        console.log('addClickable', uuid);
        const state = { ...clickables };
        state[uuid] = callback;
        setClickables(state);
      }
    },
    [clickables],
  );

  const checkClickable = useCallback(
    (uuid: string) => {
      if (clickables[uuid]) clickables[uuid]!();
    },
    [clickables],
  );

  return (
    <ClickableContext.Provider
      value={{ clickables, addClickable, checkClickable }}
    >
      {children}
    </ClickableContext.Provider>
  );
}

export { ClickableProvider, useClickable };

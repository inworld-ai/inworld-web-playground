import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

import { Cursors } from '../types/cursors';

interface UIContextValues {
  cursor: string;
  label1: string;
  menuCollapsed: boolean;
  menuWorldBuilder: boolean;

  setCursor: Dispatch<SetStateAction<string>> | null;
  setLabel1: Dispatch<SetStateAction<string>> | null;
  setMenuCollapsed: Dispatch<SetStateAction<boolean>> | null;
  setMenuWorldBuilder: Dispatch<SetStateAction<boolean>> | null;
}

const UIContext = React.createContext<UIContextValues>({
  cursor: Cursors.Auto,
  label1: '',
  menuCollapsed: true,
  menuWorldBuilder: true,
  setCursor: null,
  setLabel1: null,
  setMenuCollapsed: null,
  setMenuWorldBuilder: null,
});

const useUI = () => React.useContext(UIContext);

function UIProvider({ children }: PropsWithChildren) {
  const [cursor, setCursor] = useState<string>(Cursors.Auto);
  const [label1, setLabel1] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [menuWorldBuilder, setMenuWorldBuilder] = useState(true);

  return (
    <UIContext.Provider
      value={{
        cursor,
        label1,
        menuCollapsed,
        menuWorldBuilder,
        setCursor,
        setLabel1,
        setMenuCollapsed,
        setMenuWorldBuilder,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export { UIProvider, useUI };

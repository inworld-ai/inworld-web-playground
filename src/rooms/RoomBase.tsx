import { useEffect } from 'react';

import { useRooms } from '../contexts/RoomsProvider';
import { log } from '../utils/log';

export type RoomBaseProps = {
  children: Element | JSX.Element;
  name: string;
};

function RoomBase(props: RoomBaseProps) {
  const { setUILabel } = useRooms();

  useEffect(() => {
    log('Room init:', props.name);
    if (setUILabel) setUILabel(props.name);
    return () => {
      log('Room destroy:', props.name);
    };
  }, []);

  return <>{props.children}</>;
}

export default RoomBase;

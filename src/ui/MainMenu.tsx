import './MainMenu.css';

import { Button, Paper, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import { useCallback, useEffect, useState } from 'react';

import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  useRooms,
} from '../contexts/RoomsProvider';
import { STATE_RUNNING, useSystem } from '../contexts/SystemProvider';

function MainMenu() {
  const STATE_MAIN = 'state_main';
  const STATE_MICROPHONE = 'state_microphone';

  const [state, setState] = useState<string>(STATE_MAIN);

  const { stateSystem, setStateSystem } = useSystem();
  const { room, setRoom } = useRooms();

  useEffect(() => {
    // console.log("MainMenu init", state);
  }, [stateSystem]);

  const onClickPlay = useCallback(() => {
    if (setStateSystem && stateSystem !== STATE_RUNNING) {
      setStateSystem(STATE_RUNNING);
    }
  }, [stateSystem, setStateSystem]);

  const onClickRoom = useCallback(
    (name: string) => {
      if (setRoom && room !== name) {
        setRoom(name);
      }
    },
    [room, setRoom],
  );

  const onClickState = useCallback((state: string) => {
    setState(state);
  }, []);

  if (stateSystem !== STATE_RUNNING) {
    return (
      <Container className="containerMainMenu">
        {state === STATE_MAIN && (
          <Paper className="paperMainMenu">
            <Stack>
              <p>Main Menu</p>
              <Button onClick={() => onClickPlay()}>Play</Button>
              <p>Rooms</p>
              <Button onClick={() => onClickRoom(ROOM_LOBBY)}>Lobby</Button>
              <Button onClick={() => onClickRoom(ROOM_ANIMATIONS)}>
                Animations
              </Button>
              <Button onClick={() => onClickRoom(ROOM_AVATARS)}>Avatars</Button>
              <Button onClick={() => onClickRoom(ROOM_EMOTIONS)}>
                Emotions
              </Button>
              <Button onClick={() => onClickRoom(ROOM_GOALS)}>Goals</Button>
              <p>Settings</p>
              <Button onClick={() => onClickState(STATE_MICROPHONE)}>
                Microphone
              </Button>
            </Stack>
          </Paper>
        )}
        {state === STATE_MICROPHONE && (
          <Paper className="paperMicrophoneMenu">
            <Stack>
              <p>Microphone Menu</p>
              <Button onClick={() => onClickState(STATE_MAIN)}>
                Main Menu
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
    );
  }

  return <></>;
}

export default MainMenu;

import './MainMenu.css';

import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import Container from '@mui/material/Container';

import {
  STATE_ACTIVE,
  STATE_OPEN,
  useInworld,
} from '../contexts/InworldProvider';
import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  ROOM_NARRATED,
  useRooms,
} from '../contexts/RoomsProvider';
import {
  MicrophoneModes,
  STATE_RUNNING,
  useSystem,
} from '../contexts/SystemProvider';
import { log } from '../utils/log';

function MainMenu() {
  const STATE_MAIN = 'state_main';
  const STATE_MICROPHONE = 'state_microphone';

  const MICROPHONE_NORMAL = 'normal';
  const MICROPHONE_PTT = 'ptt';

  const [state, setState] = useState<string>(STATE_MAIN);

  const { state: systemState } = useInworld();
  const { stateSystem, setMicrophoneMode, setStateSystem } = useSystem();
  const { room, setRoom } = useRooms();

  useEffect(() => {
    log('MainMenu init', state);
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

  const onChangeMic = useCallback(
    (event: any) => {
      console.log('onChangeMic', event.target.value);
      if (!setMicrophoneMode) return;
      const mode = event.target.value;
      if (mode === MICROPHONE_NORMAL) setMicrophoneMode(MicrophoneModes.NORMAL);
      if (mode === MICROPHONE_PTT) setMicrophoneMode(MicrophoneModes.PTT);
    },
    [setMicrophoneMode],
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
              <Button onClick={() => onClickRoom(ROOM_NARRATED)}>Narrated Actions</Button>
              <p>Settings</p>
              <Button onClick={() => onClickState(STATE_MICROPHONE)}>
                Microphone Modes
              </Button>
            </Stack>
          </Paper>
        )}
        {state === STATE_MICROPHONE && (
          <Paper className="paperMicrophoneMenu">
            <Stack>
              <p>Microphone Modes</p>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="normal"
                  name="radio-buttons-group"
                  onChange={onChangeMic}
                >
                  <FormControlLabel
                    value={MICROPHONE_NORMAL}
                    control={<Radio />}
                    label="Normal"
                    disabled={
                      systemState === STATE_ACTIVE || systemState === STATE_OPEN
                        ? true
                        : false
                    }
                  />
                  <FormControlLabel
                    value={MICROPHONE_PTT}
                    control={<Radio />}
                    label="Push to Talk"
                    disabled={
                      systemState === STATE_ACTIVE || systemState === STATE_OPEN
                        ? true
                        : false
                    }
                  />
                </RadioGroup>
              </FormControl>
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

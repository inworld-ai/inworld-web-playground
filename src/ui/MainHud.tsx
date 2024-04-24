import './MainHud.css';

import { button, useControls } from 'leva';

import { Container, Stack, Typography } from '@mui/material';

import { useInworld } from '../contexts/InworldProvider';
import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_GOALS,
  ROOM_LOBBY,
  ROOM_NARRATED,
  useRooms,
} from '../contexts/RoomsProvider';

function MainHud() {
  const { setRoom, uiLabel } = useRooms();

  const { name } = useInworld();

  useControls(
    'Rooms',
    {
      Lobby: button(() => {
        if (setRoom) setRoom(ROOM_LOBBY);
      }),
      Animations: button(() => {
        if (setRoom) setRoom(ROOM_ANIMATIONS);
      }),
      Avatars: button(() => {
        if (setRoom) setRoom(ROOM_AVATARS);
      }),
      Emotions: button(() => {
        if (setRoom) setRoom(ROOM_EMOTIONS);
      }),
      Goals: button(() => {
        if (setRoom) setRoom(ROOM_GOALS);
      }),
      'Narrated Actions': button(() => {
        if (setRoom) setRoom(ROOM_NARRATED);
      }),
    },
    { collapsed: false },
  );

  return (
    <>
      <Container className="mainHud">
        <Stack
          className="stackUI"
          justifyContent="space-between"
          direction="row"
        >
          <Stack
            className="stackLabels"
            justifyContent="flex-start"
            direction="column"
          >
            <Typography className="textRoomNameLabel">
              Room: {uiLabel}
              <br />
              Character: {name}
            </Typography>
            <Typography className="textFooterLabel">
              Inworld Web Playground - ver 1.1.0{' '}
            </Typography>
          </Stack>
          <a className="linkInworld" href="https://www.inworld.ai">
            <img src="/logo-01.svg" color="white" width="120" height="30" />
          </a>
        </Stack>
      </Container>
    </>
  );
}

export default MainHud;

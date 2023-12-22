import "./MainMenu.css";

import { useCallback, useEffect } from "react";

import { Button, Paper, Stack } from "@mui/material";
import Container from "@mui/material/Container";

import {
  ROOM_ANIMATIONS,
  ROOM_AVATARS,
  ROOM_EMOTIONS,
  ROOM_LOBBY,
  useRooms,
} from "../utils/rooms";
import { STATE_RUNNING, useSystem } from "../utils/system";

function MainMenu() {
  const { state, setState } = useSystem();
  const { room, setRoom } = useRooms();

  useEffect(() => {
    // console.log("MainMenu init", state);
  }, [state]);

  const onClickPlay = useCallback(() => {
    if (setState && state !== STATE_RUNNING) {
      setState(STATE_RUNNING);
    }
  }, [state, setState]);

  const onClickRoom = useCallback(
    (name: string) => {
      if (setRoom && room !== name) {
        setRoom(name);
      }
    },
    [room, setRoom]
  );

  if (state !== STATE_RUNNING) {
    return (
      <Container className="containerMainMenu">
        <Paper className="paperMainMenu">
          <Stack>
            <p>Playground Menu</p>
            <Button onClick={() => onClickPlay()}>Play</Button>
            <p>Rooms</p>
            <Button onClick={() => onClickRoom(ROOM_LOBBY)}>Lobby</Button>
            <Button onClick={() => onClickRoom(ROOM_ANIMATIONS)}>
              Animations
            </Button>
            <Button onClick={() => onClickRoom(ROOM_AVATARS)}>Avatars</Button>
            <Button onClick={() => onClickRoom(ROOM_EMOTIONS)}>Emotions</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return <></>;
}

export default MainMenu;

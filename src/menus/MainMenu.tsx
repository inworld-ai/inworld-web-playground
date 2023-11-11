import "./MainMenu.css";

import { Button, Paper, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import { useCallback, useEffect } from "react";

import { useSystem, STATE_RUNNING } from "./../utils/system";

function MainMenu() {
  const { state, setState } = useSystem();

  useEffect(() => {
    // console.log("MainMenu init", state);
  }, [state]);

  const onClickPlay = useCallback(() => {
    if (setState && state !== STATE_RUNNING) {
      setState(STATE_RUNNING);
    }
  }, [state, setState]);

  if (state !== STATE_RUNNING) {
    return (
      <Container className="containerMainMenu">
        <Paper className="paperMainMenu">
          <Stack>
            <p>Playground Menu</p>
            <Button onClick={() => onClickPlay()}>Play</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return <></>;
}

export default MainMenu;

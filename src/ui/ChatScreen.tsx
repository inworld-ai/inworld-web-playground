import "./ChatScreen.css";

import { useCallback, useState } from "react";

import { Button, Container, Stack, TextField } from "@mui/material";

import { STATE_OPEN, useInworld } from "../contexts/InworldProvider";

function ChatScreen() {
  const { close, state } = useInworld();
  const { isRecording, sendText, startRecording, stopRecording } = useInworld();

  const [text, onChangeText] = useState("");

  const onPressSend = useCallback(() => {
    if (text !== "") {
      sendText(text);
      onChangeText("");
    }
  }, [text]);

  const onPressRec = useCallback(() => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onPressSend();
      }
    },
    [onPressSend]
  );

  return (
    <>
      {state === STATE_OPEN && (
        <Container className="containerChat">
          <Stack className="stackChat" direction="column" spacing={2}>
            <Stack className="stackChatInput" direction="row" spacing={2}>
              <TextField
                className="chatTextfield"
                id="outlined-basic"
                label="Chat"
                variant="outlined"
                value={text}
                onChange={(event) => onChangeText(event.target.value)}
                onKeyUp={onKeyPress}
              />
              <Button
                className="chatButton"
                variant="outlined"
                onClick={() => onPressSend()}
              >
                Send
              </Button>
              <Button
                className="chatButton"
                variant="outlined"
                onClick={() => onPressRec()}
                style={{ width: "125px" }}
              >
                {isRecording ? "Stop Rec" : "Start Rec"}
              </Button>
              <Button
                className="chatButton"
                variant="outlined"
                onClick={() => close()}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
}

export default ChatScreen;

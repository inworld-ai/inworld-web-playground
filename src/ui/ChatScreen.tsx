import './ChatScreen.css';

import { useCallback, useState } from 'react';

import { Button, Container, Stack, TextField } from '@mui/material';

import {
  STATE_ACTIVE,
  STATE_OPEN,
  useInworld,
} from '../contexts/InworldProvider';
import { MicrophoneModes, useSystem } from '../contexts/SystemProvider';

function ChatScreen() {
  const { close, state, isRecording, sendText, startRecording, stopRecording } =
    useInworld();
  const { microphoneMode } = useSystem();

  const [text, onChangeText] = useState('');

  const onPressSend = useCallback(() => {
    if (text !== '' && sendText) {
      sendText(text);
      onChangeText('');
    }
  }, [text, sendText]);

  const onPressRec = useCallback(() => {
    if (!isRecording && startRecording) {
      startRecording();
    } else if (stopRecording) {
      stopRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onPressSend();
      }
    },
    [onPressSend],
  );

  return (
    <>
      {(state === STATE_OPEN || state === STATE_ACTIVE) && close && (
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
                onClick={() => {
                  if (microphoneMode === MicrophoneModes.NORMAL) onPressRec();
                }}
                onMouseDown={() => {
                  if (microphoneMode === MicrophoneModes.PTT) onPressRec();
                }}
                onMouseUp={() => {
                  if (microphoneMode === MicrophoneModes.PTT) onPressRec();
                }}
                style={{ width: '125px' }}
              >
                {microphoneMode === MicrophoneModes.NORMAL &&
                  isRecording &&
                  'Stop Rec'}
                {microphoneMode === MicrophoneModes.NORMAL &&
                  !isRecording &&
                  'Start Rec'}
                {microphoneMode === MicrophoneModes.PTT && 'Push to Talk'}
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

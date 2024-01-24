import './App.css';

import Container from '@mui/material/Container';

import { ClickableProvider } from '../contexts/ClickableProvider';
import { InworldProvider } from '../contexts/InworldProvider';
import { RaysProvider } from '../contexts/RaysProvider';
import { RoomsProvider } from '../contexts/RoomsProvider';
import { SystemProvider } from '../contexts/SystemProvider';
import { UIProvider } from '../contexts/UIProvider';
import Scene from '../scene/Scene';
import ChatScreen from '../ui/ChatScreen';
import MainHud from '../ui/MainHud';
import MainMenu from '../ui/MainMenu';

export default function App() {
  return (
    <SystemProvider>
      <UIProvider>
        <RaysProvider>
          <ClickableProvider>
            <RoomsProvider>
              <InworldProvider>
                <Container className="containerMain">
                  <Scene />
                  <MainHud />
                  <ChatScreen />
                  <MainMenu />
                </Container>
              </InworldProvider>
            </RoomsProvider>
          </ClickableProvider>
        </RaysProvider>
      </UIProvider>
    </SystemProvider>
  );
}

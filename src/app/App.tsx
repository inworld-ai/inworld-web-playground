import "./App.css";

import Container from "@mui/material/Container";

import { InworldProvider } from "../contexts/InworldProvider";
import MainMenu from "../menus/MainMenu";
import Scene from "../scene/Scene";
import ChatScreen from "../ui/ChatScreen";
import MainHud from "../ui/MainHud";
import { ClickableProvider } from "../utils/clickable";
import { RaysProvider } from "../utils/rays";
import { RoomsProvider } from "../utils/rooms";
import { SystemProvider } from "../utils/system";

function App() {
  return (
    <SystemProvider>
      <ClickableProvider>
        <RaysProvider>
          <RoomsProvider>
            <InworldProvider>
              <Container className="containerMain">
                <Scene />
                <ChatScreen />
                <MainHud />
                <MainMenu />
              </Container>
            </InworldProvider>
          </RoomsProvider>
        </RaysProvider>
      </ClickableProvider>
    </SystemProvider>
  );
}

export default App;

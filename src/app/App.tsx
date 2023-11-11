import "./App.css";
import Container from "@mui/material/Container";

import { SystemProvider } from "./../utils/system";

import Scene from "./../scene/Scene";
import MainMenu from "../menus/MainMenu";

function App() {
  return (
    <SystemProvider>
      <Container className="containerMain">
        <Scene />
        <MainMenu />
      </Container>
    </SystemProvider>
  );
}

export default App;

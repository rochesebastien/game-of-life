import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/Home/Home";
import GamePage from "./pages/Game/Game";
import InfoPage from "./pages/Info/Info";

import SoundControl from "./components/SoundControl/SoundControl";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/info" element={<InfoPage />} />
      </Routes>
      <SoundControl />
    </>
  );
}

export default App;

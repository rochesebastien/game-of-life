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
    <div style={{ width: '100vw' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/info" element={<InfoPage />} />
      </Routes>
      <SoundControl />
    </div>
  );
}

export default App;

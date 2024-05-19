import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Info from "./pages/Info";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}

export default App;

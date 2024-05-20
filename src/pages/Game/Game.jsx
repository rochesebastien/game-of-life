import React, { useState, useEffect, useRef } from 'react';
import NavLogo from '../../components/NavLogo/NavLogo';'../../components/NavLogo/NavLogo'
import Grid from '../../components/Grid/Grid';
import GameControls from '../../components/GameControls/GameControls';
import './Game.css'
function GamePage() {
  const rows = Math.floor((0.9*window.innerHeight)/20);
  const cols = Math.floor((0.9*window.innerWidth)/20);

  const createEmptyGrid = () => {
    return Array.from({ length: rows }).map(() => Array(cols).fill(false));
  };

  const [grid, setGrid] = useState(createEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(25);

  const resetGrid = () => {
    setRunning(false);
    setGrid(createEmptyGrid());
  };

  return (
    <div className='game_ctn'>
      <NavLogo />
      <GameControls
        running={running}
        setRunning={setRunning}
        resetGrid={resetGrid}
        setSpeed={setSpeed}
      />
      <Grid rows={rows} cols={cols} grid={grid} setGrid={setGrid} running={running} speed={speed} />
    </div>
  );
}

export default GamePage;

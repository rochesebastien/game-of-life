import React, { useState, useEffect, useRef } from 'react';
import NavLogo from '../../components/NavLogo/NavLogo'; '../../components/NavLogo/NavLogo'
import Grid from '../../components/Grid/Grid';
import GameControls from '../../components/GameControls/GameControls';
import GameInfo from '../../components/GameInfo/GameInfo';
import CreditText from '../../components/CreditText/CreditText';

import './Game.css'
function GamePage() {
  const rows = Math.floor((0.9 * window.innerHeight) / 20);
  const cols = Math.floor((0.9 * window.innerWidth) / 20);

  const createEmptyGrid = () => {
    return Array.from({ length: rows }).map(() => Array(cols).fill(false));
  };

  const [grid, setGrid] = useState(createEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(250);
  const [generation, setGeneration] = useState(0);

  const resetGrid = () => {
    setRunning(false);
    setGeneration(0);
    setGrid(createEmptyGrid());
  };

  return (
    <div className='game_ctn'>
      <NavLogo />
      <GameInfo generation={generation} speed={speed} />
      <GameControls
        running={running}
        setRunning={setRunning}
        resetGrid={resetGrid}
        setSpeed={setSpeed}
      />
      <Grid rows={rows} cols={cols} grid={grid} setGrid={setGrid} running={running} speed={speed} setGeneration={setGeneration} />
      <CreditText />
    </div>
  );
}

export default GamePage;

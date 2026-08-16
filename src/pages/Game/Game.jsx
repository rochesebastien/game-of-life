import React, { useEffect, useState } from 'react';
import NavLogo from '../../components/NavLogo/NavLogo';
import Grid from '../../components/Grid/Grid';
import GameControls from '../../components/GameControls/GameControls';
import GameInfo from '../../components/GameInfo/GameInfo';
import { nextGeneration } from '../../game/life';

import './Game.css'
function GamePage() {
  // Living cells only, keyed by "x,y": the board has no rows/cols limit.
  const [cells, setCells] = useState(() => new Set());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(250);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (!running) return undefined;

    const interval = setInterval(() => {
      setCells((previous) => nextGeneration(previous));
      setGeneration((previous) => previous + 1);
    }, speed);

    return () => clearInterval(interval);
  }, [running, speed]);

  // Space toggles the simulation. preventDefault keeps the page from
  // scrolling and stops the key from re-triggering a focused button.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== 'Space') return;
      if (event.repeat) return;
      if (event.target instanceof HTMLInputElement) return;

      event.preventDefault();
      setRunning((previous) => !previous);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetGrid = () => {
    setRunning(false);
    setGeneration(0);
    setCells(new Set());
  };

  return (
    <div className='game_ctn'>
      <NavLogo />
      <GameInfo generation={generation} speed={speed} population={cells.size} />
      <GameControls
        running={running}
        setRunning={setRunning}
        resetGrid={resetGrid}
        setSpeed={setSpeed}
      />
      <Grid cells={cells} setCells={setCells} />
    </div>
  );
}

export default GamePage;

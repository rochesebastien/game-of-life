import React, { useEffect, useState } from 'react';
import NavLogo from '../../components/NavLogo/NavLogo';
import Grid from '../../components/Grid/Grid';
import GameControls from '../../components/GameControls/GameControls';
import GameInfo from '../../components/GameInfo/GameInfo';
import CreditText from '../../components/CreditText/CreditText';
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
      <CreditText />
    </div>
  );
}

export default GamePage;

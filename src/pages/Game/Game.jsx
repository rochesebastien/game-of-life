import React, { useState, useEffect } from 'react';
import Cell from '../../components/Cell'
import Grid from '../../components/Grid';
import Controls from '../../components/Controls';

function Game() {
  const rows = 40;
  const cols = 40;
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
    <div style={{ textAlign: 'center' }}>
      <h1>Jeu de la vie de Conway</h1>
      <Controls
        running={running}
        setRunning={setRunning}
        resetGrid={resetGrid}
        setSpeed={setSpeed}
      />
      <Grid rows={rows} cols={cols} grid={grid} setGrid={setGrid} running={running} speed={speed} />
    </div>
  );
}

export default Game;

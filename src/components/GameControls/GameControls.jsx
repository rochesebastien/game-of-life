import React from "react";
import './GameControls.css';

function GameControls({ running, setRunning, resetGrid, setSpeed }) {
    return (
        <div className="game_controls">
            <button onClick={() => setRunning(!running)}>
                {running ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetGrid}>Reset</button>
            {/* <label>
                Speed:
                <input
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    onChange={(e) => setSpeed(Number(e.target.value))}
                />
            </label> */}
        </div>
    );
}

export default GameControls;
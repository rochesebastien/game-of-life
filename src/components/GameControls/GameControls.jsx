import React from "react";
import './GameControls.css';

function GameControls({ running, setRunning, resetGrid, setSpeed }) {
    return (
        <div className="game_controls">

            <span onClick={() => setRunning(!running)}>
                {running ? 
                    <img src="/icons/pause.svg" alt="Pause"/> : 
                    <img src="/icons/play.svg" alt="Play"/>
                    }
            </span>
            <span onClick={resetGrid}>
                <img src="/icons/reset.svg" alt="Play"/>
            </span>
            <span className="speed">
                <img src="/icons/gauge.svg" alt="Play"/>
                <input 
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    // onChange={(e) => setSpeed(Number(e.target.value))}
                />
            </span>
        </div>
    );
}

export default GameControls;
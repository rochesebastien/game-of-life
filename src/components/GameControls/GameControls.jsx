import React from "react";
import './GameControls.css';

function GameControls({ running, setRunning, resetGrid, setSpeed }) {

    return (
        <div className="game_controls">

            <span onClick={() => setRunning(!running)} data-tooltip={running ? 'Pause the simulation (Space)' : 'Start the simulation (Space)'}>
                {running ?
                    <img src="/icons/pause.svg" alt="Pause"/> :
                    <img src="/icons/play.svg" alt="Play"/>
                    }
            </span>
            <span onClick={resetGrid} data-tooltip="Reset the grid">
                <img src="/icons/reset.svg" alt="Reset"/>
            </span>
            <span className="speed" data-tooltip="Change the simulation speed">
                <img src="/icons/gauge.svg" alt="Speed"/>
                <input 
                    type="range"
                    min="0"
                    max="500"
                    defaultValue={500 - 250}
                    onChange={(e) => setSpeed(500 - Number(e.target.value))}
                />
            </span>
        </div>
    );
}

export default GameControls;
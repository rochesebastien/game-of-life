import React from "react";

function Controls({ running, setRunning, resetGrid, setSpeed }) {
    return (
        <div>
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

export default Controls;
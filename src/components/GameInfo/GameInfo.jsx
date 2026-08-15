import React from 'react';
import './GameInfo.css'

function GameInfo({generation, speed, population}) {
    return (
        <div className='game_infos'>
            <span data-tooltip="Current generation" data-tooltip-pos="bottom">
                <img src="/icons/dna.svg" alt="Generation"/>
                {generation}
            </span>
            <span data-tooltip="Living cells" data-tooltip-pos="bottom">
                <img src="/icons/sprout.svg" alt="Living cells"/>
                {population}
            </span>
            <span data-tooltip="Time between generations" data-tooltip-pos="bottom">
                <img src="/icons/speed.svg" alt="Speed"/>
                {speed} ms
            </span>
        </div>
    );
};

export default GameInfo;

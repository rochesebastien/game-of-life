import React from 'react';
import './GameInfo.css'

function GameInfo({generation, speed, population}) {
    return (
        <div className='game_infos'>
            <span>
                <img src="/icons/dna.svg" alt="Generation"/>
                {generation}
            </span>
            <span>
                <img src="/icons/sprout.svg" alt="Living cells"/>
                {population}
            </span>
            <span>
                <img src="/icons/speed.svg" alt="Speed"/>
                {speed} ms
            </span>
        </div>
    );
};

export default GameInfo;

import React from 'react';
import './GameInfo.css'

function GameInfo({generation, speed}) {
    console.log(speed);
    return (
        <div className='game_infos'>
            <span>
                <img src="/icons/dna.svg" alt="Generation"/>
                {generation}
            </span> 
            <span>
                <img src="/icons/speed.svg" alt="Generation"/>
                {speed} ms
            </span>
        </div>
    );
};

export default GameInfo;
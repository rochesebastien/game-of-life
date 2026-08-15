import React from 'react';
import { Link } from "react-router-dom";
import './HomeMenu.css'

function HomeMenu() {

    return (
        <div className='home_menu'>
            <img className="main_logo" src="/logo.png" alt="Game of Life"/>
            <div className="buttons_menu">
                <Link className="btn" to="/game" data-tooltip="Start playing the Game of Life">Play !</Link>
                <Link className="btn" to="/info" data-tooltip="Learn how the game works">Informations</Link>
                <a className="btn" href='https://github.com/rochesebastien/game-of-life' target='_blank' data-tooltip="View the source code on Github">Github</a>
            </div>
        </div>
    );
}

export default HomeMenu;
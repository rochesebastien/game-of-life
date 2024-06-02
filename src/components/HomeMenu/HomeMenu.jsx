import React from 'react';
import { Link } from "react-router-dom";
import './HomeMenu.css'

function HomeMenu() {

    return (
        <div className='home_menu'>
            <img className="main_logo" src="/logo.png" alt="Game of Life"/>
            <div className="buttons_menu">
                <Link className="btn" to="/game">Play !</Link>
                <Link className="btn" to="/info">Informations</Link>
                <a className="btn" href='https://github.com/rochesebastien/game-of-life' target='_blank'>Github</a>
            </div>
        </div>
    );
}

export default HomeMenu;
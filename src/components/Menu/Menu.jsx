import React from 'react';
import { Link } from "react-router-dom";
import './Menu.css'

function Menu() {

    return (
        <div className='home_menu'>
            <img className="main_logo" src="/logo.png" alt="Game of Life"/>
            <div className="buttons_menu">
                <Link className="btn" to="/game">Jouer</Link>
                <Link className="btn" to="/info">Informations</Link>
                <button className="btn">Github</button>
            </div>
        </div>
    );
}

export default Menu;
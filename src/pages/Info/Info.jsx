import React from 'react';
import { Link } from "react-router-dom";
import './Info.css';
import InfoCell from '../../components/InfoCell/InfoCell';

function InfoPage() {

    const infocells = [
        {
            icon: "sprout.svg",
            title: "Birth",
            text: "A dead cell with exactly three living neighbors becomes alive."
        },
        {
            icon: "tree.svg",
            title: "Survival",
            text: "A living cell with two or three living neighbors remains alive."
        },
        {
            icon: "skull.svg",
            title: "Death",
            text: "A living cell with fewer than two living neighbors dies."
        }
    ];

    return (
        <div className='infopage'>
            <img className="bg_image" src="/gameoflife.gif" alt="Game of Life GIF" />
            <img className="bg_image" src="/gameoflife.gif" alt="Game of Life GIF" />
            <div className="bg_blur"></div>
            <h1>Conway's game of life 3 main rules</h1>
            <div className="info_container">
                {infocells.map((cell, index) => {
                    return <InfoCell key={index} icon={cell.icon} title={cell.title} text={cell.text} />
                }
                )}
            </div>
            <a className="info_more" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target='_blank'>Want more informations about the story of the game ? See here</a>
            <Link className="btn" to="/">Back to menu</Link>
        </div>
    );
}

export default InfoPage;
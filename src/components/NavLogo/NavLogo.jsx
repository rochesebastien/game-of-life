import React from 'react';
import { Link } from "react-router-dom";
import './NavLogo.css'

function NavLogo() {
    return (
        <Link className="navlogo" to="/">
            <img src="/logo.png" alt="Game Of Life" />
        </Link>
    );
};

export default NavLogo;
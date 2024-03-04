import React from 'react';
import { Link } from "react-router-dom";
import ThemeButton from './ThemeButton';
export default function Navbar({title, theme, toggleTheme}) {
    return (
        <div>
            <nav className='navbar navbar-expand-lg bg-body-tertiary shadow-sm' data-bs-theme={theme==='dark'?'dark':''}>
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center text-primary fw-bold" to="/"><i className="bi bi-database fs-3 text-primary mx-1"></i>{title}</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item mx-2">
                                <Link className={`nav-link`} to="/">Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link  className={`nav-link`} to="/craft">Craft</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className={`nav-link`} to="/about">About</Link>
                            </li>
                            <li className='nav-item mx-2'>
                                <button className='nav-link' onClick={toggleTheme}><ThemeButton theme={theme}/></button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
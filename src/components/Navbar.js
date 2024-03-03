import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import ThemeButton from './ThemeButton';
import { useState } from 'react';
export default function Navbar({title, theme, toggleTheme}) {
    const [currentPage, setCurrentPage] = useState('home');
    function currentPageSetter(event){
        setCurrentPage(event.target.dataset.path);
    }
    return (
        <div>
            <nav className='navbar navbar-expand-lg bg-body-tertiary shadow-sm' data-bs-theme={theme==='dark'?'dark':''}>
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center text-primary fw-bold" to="/"><i class="bi bi-database fs-3 text-primary mx-1"></i>{title}</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item mx-2">
                                <Link data-path='home' className={`nav-link ${currentPage === 'home'?'bg-secondary bg-opacity-25 rounded py-1 active px-2':''}`} to="/" onClick={currentPageSetter}>Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link  data-path='craft' className={`nav-link ${currentPage === 'craft'?'bg-secondary bg-opacity-25 rounded py-1 active px-2':''}`} to="/craft" onClick={currentPageSetter}>Craft</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link data-path='about' className={`nav-link ${currentPage === 'about'?'bg-secondary bg-opacity-25 rounded py-1 active px-2':''}`} to="/about" onClick={currentPageSetter}>About</Link>
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

Navbar.propTypes = {
    title: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Site Name'
}
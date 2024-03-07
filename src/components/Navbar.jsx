import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ThemeButton from './ThemeButton';
export default function Navbar({title, theme, toggleTheme, showAlert, authInfo, setAuthInfo}) {

    function login(){

        fetch('http://localhost:3000/loginstatus', {
          method: 'GET',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.user){
                setAuthInfo(data.user);
            } else {
                setAuthInfo(null);
            }
        })
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
      }
    useEffect(login);
    function logout(){
        fetch('http://localhost:3000/logout', {
          method: 'GET',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{showAlert(data.message, 'success')})
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
    }
    return (
        <div>
            <nav className='navbar navbar-expand-lg bg-body-tertiary shadow-sm' data-bs-theme={theme==='dark'?'dark':''}>
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center text-primary fw-bold" to="/"><i className="bi bi-database text-primary mx-1"></i>{title}</Link>
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
                            <li className={`nav-item dropdown ${authInfo?'':'d-none'}`} data-bs-them={theme}>
                                <button className={`btn btn-${theme} dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                                    {authInfo?authInfo:'username'}
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-${theme.type}`}>
                                    <li className="btn" onClick={logout}>Logout</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
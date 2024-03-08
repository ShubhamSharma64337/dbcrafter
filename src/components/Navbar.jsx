import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ThemeButton from './ThemeButton';
export default function Navbar({title, theme, toggleTheme, showAlert, authInfo, setAuthInfo}) {
    const [collapsed, setCollapsed] = useState(true);
    function toggleCollapsed(){
        collapsed?setCollapsed(false):setCollapsed(true);   
    }
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

                <div className="navbar shadow flex justify-between items-center px-2 py-3 relative top-0 w-full">
                    <Link className="logo text-xl font-medium" to="/"><i className="bi bi-database text-primary mx-1"></i>{title}</Link>
                    <ul className={`${collapsed?'scale-0':'scale-100'} transition flex flex-col absolute shadow bg-white text-center top-full left-0 w-full md:w-min md:static md:flex-row md:shadow-none md:scale-100`}>
                        <li className="mx-2 my-2 md:my-0">
                            <Link className="transition px-1.5 py-1 rounded hover:bg-slate-200" to="/">Home</Link>
                        </li>
                        <li className="mx-2 my-2 md:my-0">
                            <Link className="transition px-1.5 py-1 rounded hover:bg-slate-200"  to="/craft">Craft</Link>
                        </li>
                        <li className="mx-2 my-2 md:my-0">
                            <Link className="transition px-1.5 py-1 rounded hover:bg-slate-200" to="/about">About</Link>
                        </li>
                        <li className="mx-2 my-2 md:my-0">
                            <button onClick={toggleTheme}><ThemeButton theme={theme}/></button>
                        </li>
                        <li className="hidden">
                            <button className="">
                                {authInfo?authInfo:'username'}
                            </button>
                            <ul onClick={logout} className="">
                                <li className="" >Logout</li>
                            </ul>
                        </li>
                    </ul>
                    <button id="menu-close-button" className={`md:hidden`} onClick={toggleCollapsed}>
                        {!collapsed ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>}

                    </button>

                </div>
    )
}
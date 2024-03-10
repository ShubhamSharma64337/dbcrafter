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

                <div className={`navbar  ${theme==='dark'?'bg-black text-white':'bg-white'} transition shadow flex justify-between items-center px-2 py-3 relative w-full`}>
                    <Link className="logo text-xl font-medium" to="/"><i className="bi bi-database text-primary mx-1"></i>{title}</Link>
                    <ul className={`${collapsed?'scale-0':'scale-100'} transition-transform flex flex-col absolute top-full shadow justify-center items-center bg-inherit text-center left-0 w-full md:w-min md:static md:flex-row md:shadow-none md:scale-100`}>
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
                        <li className={`mx-2 px-3 my-2 md:my-0 w-min justify-center relative md:border-s-2 ${authInfo?'':'hidden'}`}>
                            <button className="flex items-center justify-center" onClick={() => { document.querySelector('#userDropdown').classList.toggle('hidden') }}>
                                {authInfo ?     authInfo : 'username'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </button>
                            <ul id="userDropdown" className="absolute hidden top-full bg-white border right-0">
                                <li className="hover:bg-slate-200 w-full px-3 py-2" ><button className='flex justify-between' onClick={() => { document.querySelector('#userDropdown').classList.toggle('hidden'); logout(); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    Logout</button></li>
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
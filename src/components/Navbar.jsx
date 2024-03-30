import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeButton from './ThemeButton';
import GithubButton from './GithubButton';
export default function Navbar({title, theme, toggleTheme, showAlert, authInfo, setAuthInfo}) {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    function toggleCollapsed(){
        collapsed?setCollapsed(false):setCollapsed(true);   
    }
    function login(){
        fetch('https://dbcrafter-project.uc.r.appspot.com/loginstatus', {
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
        fetch('https://dbcrafter-project.uc.r.appspot.com/logout', {
          method: 'GET',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
                setAuthInfo(null);
                showAlert(data.message, 'success')
                navigate('/');
            } else {
                showAlert(data.message, 'danger');
            }
        })
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
    }
    if(pathname === '/craft'){
        return;
    }
    return (

                <div className={`navbar  ${theme==='dark'?'bg-blue-950 text-white':'bg-white'} transition flex justify-between items-center px-4 py-5  relative w-full`}>
                    <Link className={`logo text-xl font-bold flex items-center ${theme==='dark'?'text-white':'text-slate-900'}`} to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${theme==='dark'?'text-blue-400':'text-blue-700'} w-7 h-7 me-2`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                        {title}
                    </Link>
                    <ul className={`${collapsed?'scale-0':'scale-100'} transition-transform flex flex-col absolute top-full shadow justify-center items-center bg-inherit text-center text-sm font-medium left-0 w-full md:w-min md:static md:flex-row md:shadow-none md:scale-100`}>
                        <li className="mx-2 my-2 md:my-0">
                            <Link className={`transition px-1.5 py-1 rounded ${theme==='dark'?'hover:bg-blue-900':'hover:bg-slate-200'}`} to="/">Home</Link>
                        </li>
                        <li className={`mx-2 my-2 md:my-0 ${authInfo?'':'hidden'}`}>
                            <Link className={`transition px-1.5 py-1 rounded ${theme==='dark'?'hover:bg-blue-900':'hover:bg-slate-200'}`}  to="/diagrams">Diagrams</Link>
                        </li>
                        <li className={`mx-2 my-2 md:my-0 ${authInfo?'hidden':''}`}>
                            <Link className={`transition px-1.5 py-1 rounded ${theme==='dark'?'hover:bg-blue-900':'hover:bg-slate-200'}`} to="/login">Login</Link>
                        </li>
                        <li className="mx-2 my-2 md:my-0">
                            <Link className={`transition px-1.5 py-1 rounded ${theme==='dark'?'hover:bg-blue-900':'hover:bg-slate-200'}`} to="/about">About</Link>
                        </li>
                        <li className="mx-2 my-2 md:my-0 flex items-center">
                            <button onClick={toggleTheme}><ThemeButton theme={theme}/></button>
                        </li>
                        <li className={`mx-2 my-2 md:my-0 flex items-center ${authInfo?'':'hidden'}`}>
                            <button className="relative flex flex-col items-center justify-center" onClick={() => { document.querySelector('#userDropdown').classList.toggle('hidden') }}>
                                <div className='flex'>
                                {authInfo ?     authInfo : 'username'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ms-2 w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                </div>
                                <ul id="userDropdown" className={`my-2 rounded sm:absolute hidden p-1 top-full ${theme==='dark'?'bg-blue-900':'bg-white'} border border-slate-400 right-0`}>
                                    <li className={`hover:${theme==='dark'?'bg-blue-950':'bg-blue-50'} rounded`} >
                                        <div className='flex gap-x-2 justify-between  px-3 py-2' onClick={() => { document.querySelector('#userDropdown').classList.toggle('hidden'); logout(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                            </svg>
                                            Logout
                                        </div>
                                    </li>
                                </ul>
                            </button>
                        </li>
                        <li className='mx-2 my-2 md:my-0 flex items-center'>
                            <GithubButton theme={theme}/>
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
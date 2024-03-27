import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Slider from './Slider';


export default function MainContent({theme, authInfo}) {
    return (
        <div className={`grid grid-rows-2 h-[190vh] ${theme==='dark'?'bg-blue-950':''} transition-colors`}>
                    <div className={`first flex flex-col items-center justify-center ${theme==='dark'?'text-white':'text-slate-900'}`}>
                        <div className="text  text-center w-10/12 sm:w-6/12">
                            <div className='main font-[800]  text-5xl sm:text-6xl'>
                                Quickly design relational schemas without leaving your browser
                            </div>
                            <div className='text-xl mt-5'>
                            Dbcrafter is an open source relational schema design tool built using <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://react.dev' target="_blank">ReactJS</a>, <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://expressjs.com/' target="_blank">ExpressJS</a> and <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://www.mongodb.com/' target="_blank">MongoDB</a>.
                            You can design, save and edit diagrams with an intuitive interface.
                            </div>
                        </div>
                        <div className={`flex gap-x-20 mt-10 ${authInfo?'hidden':''}`}>
                            <div>
                                <Link type='button' to='/signup' className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:shadow-blue-900 hover:translate-y-[4px] transition">Sign Up</Link>
                            </div>
                            <div>
                                <Link type='button' to='/craft' className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:shadow-blue-900 hover:translate-y-[4px] transition">Try Now</Link>
                            </div>
                        </div>
                    </div>
                    <Slider/>
        </div>
    )
}
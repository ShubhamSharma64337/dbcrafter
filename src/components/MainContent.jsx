import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Slider from './Slider';
import ImageList from './ImageList';


export default function MainContent({theme, authInfo}) {
    return (
        <div className={`flex flex-col gap-y-10 ${theme==='dark'?'bg-gray-950':''} transition-colors`}>
                    <div className={`first py-10 flex flex-col items-center justify-center ${theme==='dark'?'text-white':'text-slate-900'}`}>
                        <div className="text  text-center w-10/12 sm:w-6/12">
                            <div className='main font-[800]  text-5xl sm:text-6xl'>
                                Use <span className='text-blue-600'>AI</span> to Quickly design and share relational schemas without leaving your browser
                            </div>
                            <div className='text-xl mt-5'>
                            Dbcrafter is an open source relational schema design tool built using <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://react.dev' target="_blank">ReactJS</a>, <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://expressjs.com/' target="_blank">ExpressJS</a> and <a className={`${theme==='dark'?'text-blue-400':'text-blue-700'} underline`} href='https://www.mongodb.com/' target="_blank">MongoDB</a>.
                            You can design, publically share, save and edit diagrams with an intuitive interface. It supports touch and mobile devices, so you can effortlessly access the diagrams on your phone too.
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
                    <div className='sm:hidden'>
                        <ImageList theme={theme}></ImageList>
                    </div>
                    <div className='hidden sm:flex py-5'>
                        <Slider theme={theme}></Slider>
                    </div>
        </div>
    )
}
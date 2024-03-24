import React, { useState } from 'react'
import { Link } from 'react-router-dom';


export default function MainContent({authInfo}) {
    return (
        <div className="grid grid-rows-2 h-[190vh]">
                    <div className="first flex flex-col items-center justify-center">
                        <div className="text text-center w-10/12 sm:w-6/12">
                            <div className='main font-[800] text-slate-900 text-5xl sm:text-6xl'>
                                Quickly design relational schemas without leaving your browser
                            </div>
                            <div className='text-xl mt-5'>
                            Dbcrafter is an open source relational schema design tool built using <span className='text-blue-600'>ReactJS</span>, <span className='text-blue-600'>ExpressJS</span> and <span className='text-blue-600'>MongoDB</span>.
                            You can design, save and edit diagrams with an intuitive interface.
                            </div>
                        </div>
                        <div className={`flex gap-x-20 mt-10 ${authInfo?'hidden':''}`}>
                            <div>
                                <Link type='button' to='/signup' className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">Sign Up</Link>
                            </div>
                            <div>
                                <Link type='button' to='/craft' className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">Try Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="slider flex flex-col sm:flex-row gap-x-5 items-center justify-center">
                        <div className="hidden sm:block">
                            <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                        </div>
                        <img src='craft.png' className=' hover:scale-95 transition w-4/5 sm:w-3/5 h-auto border-4 border-blue-700 rounded-lg'></img>
                        <div className="hidden sm:block">
                            <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>


                            </button>
                        </div>
                        <div className="buttons-below flex justify-around mt-5">
                            <div className="sm:hidden">
                                <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sm:hidden">
                                <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    
        </div>
    )
}

{/* <div className={`right w-full p-10 md:w-1/3 ${authInfo?'hidden':''}`}>
        {type === 'signup' ? <SignupForm theme={theme} showAlert={showAlert} authInfo={authInfo}  toggleTerms={toggleTerms}/> : <LoginForm theme={theme} showAlert={showAlert}/>}
</div> */}
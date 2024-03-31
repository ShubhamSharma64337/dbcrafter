import React from 'react'

export default function Alert({alert,closeAlert}) {
    return (    
                            <div className={`${alert?'bottom-2':'-bottom-full'} left-1/2 -translate-x-1/2 z-20 bg-white transition-all fixed w-9/12 sm:w-fit border-blue-400 px-4 py-3 border-2 rounded-md flex justify-between items-center text-black`}>
                                    <p className="text-lg">{alert?alert.message:''}</p>
                                    <button type="button" className="ms-3" onClick={alert?closeAlert:undefined}>
                                        <svg xmlns="http://www.w3.or    /2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="rounded-full bg-blue-200 p-2 w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                            </div>
    )                       
}

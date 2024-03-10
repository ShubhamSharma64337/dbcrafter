import React from 'react'

export default function Alert({alert,closeAlert}) {
    return (    
                            <div className={`${alert?'left-0':'-left-full'} bg-blue-700 shadow transition-all fixed bottom-2 px-4 py-3 rounded-r-md flex justify-between items-center text-white`}>
                                    <p className="text-lg">{alert?alert.message:''}</p>
                                    <button type="button" className="ms-3" onClick={alert?closeAlert:undefined}>
                                        <svg xmlns="http://www.w3.or    /2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                            </div>
    )                       
}

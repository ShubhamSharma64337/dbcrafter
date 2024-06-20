import React from 'react'

export default function Loader({theme, isLoading}) {
  return (
    isLoading && <div className={`overlay z-10 overflow-auto fixed justify-center md:justify-center  flex items-center pt-5 top-0 w-screen h-screen ${theme==='dark'?'bg-black':'bg-white'} bg-opacity-75`}>
        <div className="loading-ring border-4 border-transparent border-t-4 border-t-blue-500  p-10 rounded-full">
            
            </div>
    </div>
  )
}

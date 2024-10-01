import React from 'react'

export default function Loader({theme, isLoading}) {
  return (
    true && <div className={`overlay z-10 overflow-auto fixed justify-center md:justify-center  flex flex-col gap-y-2 items-center pt-5 top-0 w-screen h-screen ${theme==='dark'?'bg-black':'bg-white'} bg-opacity-75`}>
        <div className="loading-ring border-4 border-transparent border-t-4 border-t-blue-500  p-10 rounded-full">
            
        </div>
        <div className="note p-1 bg-white border rounded"><strong>Note - </strong>It may take around 50s to load on first visit</div>
    </div>
  )
}

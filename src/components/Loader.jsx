import React from 'react'

export default function Loader({isLoading}) {
  return (
    isLoading && <div className="overlay overflow-auto fixed justify-center md:justify-center  flex items-center pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
        <div className="loading-ring border-4 border-t-blue-500  p-5 rounded-full">
            
        </div>
    </div>
  )
}

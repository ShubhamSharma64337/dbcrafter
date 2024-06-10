import React, { useEffect } from 'react'

export default function PageNumber({numPages,currentPage,getdiagrams}) {
  function getpage(e){
        getdiagrams(parseInt(e.currentTarget.value));
  }
  return (
    <div className='flex justify-center text-lg sm:col-span-2 lg:col-span-3 xl:col-span-4'>
        <ul className='flex bg-white h-min rounded overflow-hidden border-2 border-blue-300'>
            {[...Array(numPages)].map((page,i)=>{
                return <li key={i}><button className={`py-1 px-3 hover:bg-blue-300 ${currentPage==i+1?'bg-blue-300':''}`} onClick={getpage} value={i+1}>{i+1}</button></li>
            })}
        </ul>
    </div>
  )
}

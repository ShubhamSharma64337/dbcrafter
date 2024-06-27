import React, { useEffect } from 'react'

export default function PageNumber({theme, numPages,currentPage,getdiagrams}) {
  function getpage(e){
        getdiagrams(parseInt(e.currentTarget.value), document.querySelector("#searchKeyword").value); //Here we send search keyword also, so that if the
        //pages are for the searched keyword, we do not get the next normal page, but next page of searched keyword diagrams
  }
  return (
    <div className='flex my-5 pt-3 justify-center text-lg sm:col-span-2 lg:col-span-3 xl:col-span-4'>
        <ul className={`flex gap-x-2 h-min`}>
          <li className='flex rounded overflow-hidden items-center'>
            <button className={`rounded py-2 px-2 ${theme === 'dark' ? `disabled:text-gray-500  text-white  enabled:hover:bg-gray-700` : `disabled:text-gray-300  enabled:hover:bg-slate-300`}`} disabled={currentPage>1?false:true} onClick={()=>{
              if(currentPage>1){
                getdiagrams(parseInt(currentPage-1), document.querySelector("#searchKeyword").value);
              }
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
            {[...Array(numPages)].map((page,i)=>{
                return <li key={i} className='rounded overflow-hidden'><button className={`py-1 px-3 ${theme==='dark'?`text-white ${currentPage==i+1?'bg-gray-800':''} hover:bg-gray-700`:`${currentPage==i+1?'bg-slate-200':''} hover:bg-slate-300 `}`} onClick={getpage} value={i+1}>{i+1}</button></li>
            })}
          <li className='flex items-center'>
            <button className={`rounded py-2 px-2  ${theme === 'dark' ? `disabled:text-gray-500 text-white  enabled:hover:bg-gray-700` : 'disabled:text-gray-300 enabled:hover:bg-slate-300'}`} disabled={currentPage<numPages?false:true} onClick={()=>{
              if(currentPage<numPages){
                getdiagrams(parseInt(currentPage+1), document.querySelector("#searchKeyword").value);
              }
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        </ul>
    </div>
  )
}

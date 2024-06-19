import React from 'react'

export default function TopBar({getdiagrams, pgSize, setPgSize}) {
  function executeSearch(e){
    if(!document.querySelector("#search-form").checkValidity()){
        document.querySelector("#search-form").reportValidity();
        return;
    }
    getdiagrams(1, document.querySelector("#searchKeyword").value);
  }

  function sizeChanger(e){
    getdiagrams(1, document.querySelector("#searchKeyword").value, e.currentTarget.value);
  }
  return (
    <div className='mb-5 flex justify-between items-center text-sm md:text-md lg:text-lg sm:col-span-2 lg:col-span-3 xl:col-span-4'>
        
        <form id="search-form">
            <div className='flex'>
                <input type='text' className="text-black border-2 border-r-2 shadow p-2 w-full rounded-l outline-blue-700 transition focus:bg-white" id="searchKeyword" placeholder='Search' name="keyword"/>
                <button type='button' className="px-2 border-2 border-l-0 -z-2 shadow text-slate-500 rounded-r outline-blue-700" onClick={executeSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-6 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
                </button>
            </div>
        </form>
        <div>
          <select id='pageSizeSelect' className='border outline-blue-200 shadow rounded p-2' value={pgSize} onChange={sizeChanger}>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </div>
    </div>
  )
}
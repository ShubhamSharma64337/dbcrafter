import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Settings({theme,urls,currentPath}) {
  return (
    <div className={`grid grid-cols-4 grid-rows-6 lg:grid-rows-1 h-screen p-5 rounded gap-1`}>
            <div className='left flex justify-center items-center p-5 border-s-4 border-blue-500 shadow-[0px_0px_2px_2px] shadow-slate-200 h-full bg-white rounded-lg lg:rounded-s-lg col-span-4 lg:col-span-1 lg:block row-span-1 lg:row-span-6  overflow-x-auto'>
              <ul className='text-lg flex lg:flex-col justify-evenly h-full items-center w-full gap-x-2 lg:gap-x-0'>
                  <li className='w-full'>
                      <Link to='/settings/profile' className={`${currentPath === '/settings/profile' ? 'bg-gray-200' : ''} hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2 transition-colors`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          <div className="label hidden lg:block">Profile</div>
                      </Link>
                  </li>
                  <li className='w-full'>
                      <Link to='/settings/password' className={`${currentPath === '/settings/password' ? ' bg-gray-200' : ''} hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2 transition-colors`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          <div className="label hidden lg:block">Password</div>
                      </Link>
                  </li>
                  <li className=' w-full'>
                      <Link to='/settings/resetaccount' className={`${currentPath === '/settings/resetaccount' ? 'bg-gray-200' : ''}  hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2 transition-colors`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          <div className="label hidden lg:block">Reset Account</div>
                      </Link>
                  </li>
                  <li className=' w-full'>
                      <Link to='/settings/deleteaccount' className={`${currentPath === '/settings/deleteaccount' ? 'bg-gray-200' : ''} hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2 transition-colors`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                          </svg>
                          <div className="label hidden lg:block">Delete Account</div>
                      </Link>
                  </li>
                  <li className=' w-full'>
                      <Link to='/settings/help' className={`${currentPath === '/settings/help' ? 'bg-gray-200' : ''} hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2 transition-colors`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                          </svg>
                          <div className="label hidden lg:block">Help</div>
                      </Link>
                  </li>
                  <li className=' w-full'>
                      <Link to='/' className='hover:bg-gray-200 py-5 px-10 rounded flex items-center gap-x-2'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                          </svg>
                          <div className="label hidden lg:block">Back to Home</div>
                      </Link>
                  </li>
              </ul>
            </div>
            <div className="right col-span-4 lg:col-span-3 lg:p-10 rounded-lg lg:rounded-e-lg row-span-5 lg:row-span-6">
                <div className="breadcrumb px-10 py-5 text-slate-400 text-center lg:text-left text-lg">
                    {currentPath.slice(1,currentPath.length).toUpperCase().replace(/\//g,' > ')}   
                </div>
                <Outlet/>
            </div>
    </div>
  )
}

import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Settings({theme,urls}) {
  return (
    <div className='flex justify-center p-5'>
        <div className='card rounded border-l-4 border-yellow-500 shadow-slate-300 shadow-[0px_0px_2px_0.5px] flex justify-center items-center'>
            <ul className='settings-menu p-10 rounded-lg text-xl font-medium'>
                <li className='my-5'>
                    <button className='hover:bg-gray-200 py-1 px-2 rounded'>
                        Profile
                    </button>
                </li>
                <li className='my-5'>
                    <Link to='/settings/password' className='bg-gray-200 py-1 px-2 rounded'>
                        Security
                    </Link>
                </li>
                <li className='my-5'>
                    <button className='hover:bg-gray-200 py-1 px-2 rounded'>
                        Reset Account
                    </button>
                </li>
                <li className='my-5'>
                    <button className='hover:bg-gray-200 py-1 px-2 rounded'>
                        Delete Account
                    </button>
                </li>
                <li className='my-5'>
                    <button className='hover:bg-gray-200 py-1 px-2 rounded'>
                        Help
                    </button>
                </li>
            </ul>
            <div className="right hidden md:block">   
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

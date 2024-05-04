import { useEffect } from "react";
import React from 'react'

export default function ResetAccount({setCurrentPath}) {
    useEffect(()=>{setCurrentPath('/settings/resetaccount');},[]);

  return (

    <div className='px-10 py-5'>
        <form>
            <div className="my-5 flex flex-col gap-y-1">
                <label htmlFor='password' className='text-slate-400 font-medium'>Password</label>
                <input type='text' id='password' className='border text-lg p-2 outline-blue-500 w-full' placeholder='Please re-enter your password'></input>
            </div>
            <div className="my-5 flex gap-x-2">
                <input type='checkbox' id='email' className='border text-lg p-2 outline-blue-500 w-5'></input>
                <label htmlFor='email' className='text-slate-400 font-medium text-md'>I agree that all my saved diagrams will be deleted</label>
            </div>
            <div className="my-5 flex flex-col gap-y-1">
                <button type='button' className='bg-blue-600 rounded p-2 font-medium text-slate-50 hover:bg-blue-500'>Reset</button>
            </div>
        </form>
    </div>
  )
}

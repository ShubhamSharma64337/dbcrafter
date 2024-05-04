import React, { useEffect } from 'react'

export default function Profile({authInfo,setCurrentPath}) {
  useEffect(()=>{
    setCurrentPath('/settings/profile');
  },[])
  return (
    <div className='px-10 py-5'>
        <form>
            <div className="my-5 flex flex-col gap-y-1">
                <label htmlFor='email' className='text-slate-400 font-medium'>Email</label>
                <input type='text' id='email' className='border text-lg p-2 outline-blue-500 w-full' defaultValue={authInfo} disabled={true}></input>
            </div>
            
        </form>
    </div>
  )
}

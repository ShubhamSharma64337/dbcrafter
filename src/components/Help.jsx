import React from 'react'

export default function Help({setCurrentPath}) {
    setCurrentPath('/settings/help');

  return (
    <div className='px-20 py-10 flex justify-center items-center text-lg'>
        <div>
            For any support/help, send an email on <br></br> <span className='underline'>sharmashubham64337@outlook.com</span>
        </div>
    </div>
  )
}

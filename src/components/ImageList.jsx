import React from 'react'
import img1 from '/craft1.png'
import img2 from '/craft2.png'
import img3 from '/craft3.png'

export default function ImageList({theme}) {
  return (
        <div className='flex flex-col justify-around gap-y-5 items-center'>
            <figure className='flex flex-col justify-center items-center'>
                <img id='imageList' src={img1} className={`hover:scale-95 transition w-4/5 h-auto rounded-lg border ${theme==='dark'?'border-blue-500':'border-slate-500'}`}></img>
                <figcaption className={`text-sm sm:text-lg ${theme==='dark'?'text-white':''} border-b-2 border-blue-600`}>Simple, easy to understand diagrams</figcaption>
            </figure>
            <figure className='flex flex-col justify-center items-center'>
                <img id='imageList' src={img2} className={`hover:scale-95 transition w-4/5 h-auto rounded-lg border ${theme==='dark'?'border-blue-500':'border-slate-500'}`}></img>
                <figcaption className={`text-sm sm:text-lg ${theme==='dark'?'text-white':''} border-b-2 border-blue-600`}>Create and store as many diagrams as you want</figcaption>
            </figure>
            <figure className='flex flex-col justify-center items-center'>
                <img id='imageList' src={img3} className={`hover:scale-95 transition w-4/5 h-auto rounded-lg border ${theme==='dark'?'border-blue-500':'border-slate-500'}`}></img>
                <figcaption className={`text-sm sm:text-lg ${theme==='dark'?'text-white':''} border-b-2 border-blue-600`}>One click conversion to SQL</figcaption>
            </figure>
          </div>

  )
}

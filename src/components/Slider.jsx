import { React, useEffect, useState } from 'react'
import img1 from '/craft1.png'
import img2 from '/craft2.png'
import img3 from '/craft3.png'
import img4 from '/craft4.png'
import img5 from '/craft5.png'

export default function Slider({theme}) {
  const [currentImage, setCurrentImage] = useState(1);
  const captions = ['Simple, easy to understand diagrams','Create and store as many diagrams as you want','One click conversion to SQL','Save your time by using hundreds of pre-provided diagrams','Leverage the power of AI to generate tables']

  useEffect(()=>{
        if(currentImage===1){
            document.getElementById('sliderImage').src = img1;
            document.getElementById('sliderImageCaption').innerText = captions[0];
        } else if(currentImage===2){
            document.getElementById('sliderImage').src = img2;
            document.getElementById('sliderImageCaption').innerText = captions[1];
        } else if(currentImage===3){
            document.getElementById('sliderImage').src = img3;
            document.getElementById('sliderImageCaption').innerText = captions[2];
        } else if(currentImage===4){
            document.getElementById('sliderImage').src = img4;
            document.getElementById('sliderImageCaption').innerText = captions[3];
        } else {
            document.getElementById('sliderImage').src = img5;
            document.getElementById('sliderImageCaption').innerText = captions[4];
        }
    },[currentImage])
  return (
          <div className="slider-large flex flex-col sm:flex-row gap-x-5 items-center justify-center">
              <div className="hidden sm:block">
                  <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={() => {
                      if (currentImage > 1) {
                          setCurrentImage(currentImage - 1);
                      } else {
                          setCurrentImage(5);
                      }
                  }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                  </button>
              </div>
              <figure className='flex flex-col justify-center items-center  w-4/5 sm:w-3/5'>
                <div className='relative mb-5 '>
                <img id='sliderImage' src={img1} className={`hover:scale-95 transition w-full h-auto rounded-lg ring ${theme==='dark'?'ring-blue-500':'ring-blue-700'}`}></img>
                    <ul className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-x-2 bg-gray-800 rounded bg-opacity-50 p-2'>
                        {[1,2,3,4,5].map((item,index)=>{
                            return <li key={index} className={`${item===currentImage?'bg-blue-600':'bg-slate-200'} w-3 h-3 rounded-full transition-colors`}></li>
                        })}
                    </ul>
                </div>
                <figcaption id='sliderImageCaption' className={`w-fit text-lg border-b-2 border-blue-600 ${theme==='dark'?'text-white':''}`}></figcaption>
              </figure>

              <div className={`hidden sm:block`}>
                  <button className={`bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition`} onClick={(e) => {
                      if (currentImage < 5) {
                          setCurrentImage(currentImage + 1);
                      } else {
                          setCurrentImage(1);
                      }
                  }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                  </button>
              </div>
              <div className="buttons-below flex gap-x-5 mt-5">
                  <div className="sm:hidden">
                      <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={() => {
                          if (currentImage > 1) {
                              setCurrentImage(currentImage - 1);
                          } else {
                              setCurrentImage(5);
                          }
                      }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                          </svg>
                      </button>
                  </div>
                  <div className="sm:hidden">
                      <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={() => {
                          if (currentImage < 5) {
                              setCurrentImage(currentImage + 1);
                          } else {
                              setCurrentImage(1);
                          }
                      }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
  )
}

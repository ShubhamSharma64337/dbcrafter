import { React, useState } from 'react'

export default function Slider() {
  const [currentImage, setCurrentImage] = useState(1);

  return (
    <div className="slider flex flex-col sm:flex-row gap-x-5 items-center justify-center">
                        <div className="hidden sm:block">
                            <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={()=>{
                                if(currentImage>1){
                                    setCurrentImage(currentImage-1);
                                } else {
                                    setCurrentImage(3); 
                                }
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                        </div>
                        <img src={`craft${currentImage}.png`} className="hover:scale-95 transition w-4/5 sm:w-3/5 h-auto border-4 border-blue-600 rounded-lg"></img>
                        <div className={`hidden sm:block`}>
                            <button className={`bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition`} onClick={(e)=>{
                                if(currentImage<3){
                                    setCurrentImage(currentImage+1);
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
                                <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={()=>{
                                if(currentImage>1){
                                    setCurrentImage(currentImage-1);
                                } else {
                                    setCurrentImage(3); 
                                }
                            }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sm:hidden">
                                <button className="bg-blue-600 font-[800] text-lg text-white shadow-blue-900 hover:shadow-blue-900   border-slate-700 px-4 py-3 rounded-lg shadow-[0px_4px_0.1rem] hover:shadow-[0px_0.1px_0.1rem] hover:translate-y-[4px] transition" onClick={()=>{
                                if(currentImage<3){
                                    setCurrentImage(currentImage+1);
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

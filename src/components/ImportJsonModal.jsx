import React, { useEffect, useState } from 'react'

export default function ImportJsonModal({theme, visible, toggleVisible, showAlert, setDiagram}) {
    let reader = new FileReader();
    let newDiagram = null;

    function importJSON() {
        let fileList = document.querySelector('#jsonFile').files;
        if(!document.querySelector('#jsonFile').checkValidity()){
            document.querySelector('#jsonFile').reportValidity();
            return;
        }
        reader.readAsText(fileList[0], 'UTF-8');
        reader.onload = ()=>{
            newDiagram = JSON.parse(reader.result)
            console.log(newDiagram);
            setDiagram({name: null, isPublic: false, tbls: newDiagram.tbls});
            toggleVisible();
            showAlert("Diagram Imported!","success");
        }
    }

  return (
    visible && <div className="overlay overflow-auto fixed justify-center  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
        <div className={`modal ${theme==='dark'?'bg-gray-950 text-white':'bg-white'} rounded`}>
            {/* Modal Header */}
            <div className="modal-header flex  gap-5 justify-between items-center border-blue-700 border-b-2 p-5">
              <button type="button" className={`p-2 rounded-full transition-colors  ${theme==='dark'?'hover:bg-red-500':'bg-slate-200 hover:bg-red-300'}`} onClick={toggleVisible}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Upload JSON File</p>
              <button className={`p-2 rounded-full  transition-colors ${theme==='dark'?'hover:bg-blue-500':'bg-slate-200 hover:bg-blue-300'}`} type='button' onClick={importJSON}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
            <form className="flex flex-col overflow-auto">
                    <div className="formItem my-3 flex items-center justify-center gap-x-2">
                        <input type='file' id='jsonFile' required={true}></input>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

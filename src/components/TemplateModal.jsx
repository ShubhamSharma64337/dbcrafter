import React, { useEffect, useState } from 'react'
import {  useNavigate } from "react-router-dom";

export default function TemplateModal({visible, toggleVisible, templates, setIsLoading, setDiagram, urls, showAlert}) {
  const navigate = useNavigate();
  function openTemplate(e){
    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/user/gettemplate':urls.devUrl+'/user/gettemplate', {
        method: 'POST',
        headers: {         
          'Content-Type': 'application/json',
        },
        credentials: 'include', //this must be set in order to save the received session-cookie,
        //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        body: JSON.stringify({_id:e.currentTarget.dataset.id})
      })
      .then(response => response.json()) //response.json() or response.text() provides the 'data'
      .then((data)=>{
          if(data.success){
            setDiagram({name: null, isPublic: false, tbls: data.message.tbls})
            navigate('/craft');
            return;
          } else {
            showAlert(data.message, 'danger');
            return;
          }
      })
      .catch((error)=>{
        showAlert('An error occured while trying to access the backend API', 'danger')
        console.log(error)
      })
      .finally(()=>{
        setIsLoading(false);
      })
  }

  return (
    visible && templates && <div className="overlay overflow-auto fixed justify-center  flex items-start p-5 top-0 left-0 w-screen h-screen bg-black bg-opacity-75">
        <div className="modal bg-white rounded w-full">
            {/* Modal Header */}
            <div className="modal-header p-2 flex justify-between items-center border-b">
              <div className='text-lg ms-2'>
                Public Diagrams
              </div>
              <button type="button" className="p-2 rounded-full transition-colors  hover:bg-red-300" onClick={toggleVisible}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>


            {/* Modal Body */}
            <div className="modal-body grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5">
              {templates ? templates.map((element, index) => {
                return <button key={index} className='card grid grid-cols-1 grid-rows-4 bg-white rounded p-1 transition shadow hover:shadow-none hover:border-blue-500 border-2 border-slate-200' onClick={openTemplate} data-id={element._id}>
                  <div className='image row-span-3 h-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  </div>
                  <div className='row-span-1 bg-blue-100 rounded py-2'>
                    {element.name}
                  </div>
                </button>
              })
                :
                'No Templates Found'

              }
            </div>
        </div>
    </div>
  )
}

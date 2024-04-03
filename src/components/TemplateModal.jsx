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
        <div className="modal relative bg-white rounded pt-10 w-full">
            {/* Modal Header */}
              <button type="button" className="p-2 absolute top-2 right-2 rounded-full transition-colors  hover:bg-red-300" onClick={toggleVisible}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>


            {/* Modal Body */}
            <div className="modal-body grid grid-cols-3 gap-5 p-5">
              {templates? templates.map((element, index)=>{
                return <button key={index} className='card grid grid-cols-1 grid-rows-4 bg-white rounded hover:bg-sky-100 px-5 py-4 border border-slate-200' onClick={openTemplate} data-id={element._id}>
                  <div className='image row-span-3 flex justify-center items-center px-5 py-20'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z" clipRule="evenodd" />
                  </svg>

                  </div>
                  <div className='row-span-1 text-lg'>
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

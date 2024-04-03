import React, { useEffect, useState } from 'react'

export default function CreateDiagramModal({diagram, createDiagramModalShow, toggleModal, showAlert, setDiagram, setIsLoading, urls}) {
  const [diagramName, setDiagramName] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  useEffect(()=>{
    setDiagramName(diagram.name);
  }, [diagram])

  function handleChange(e){
    setDiagramName(e.currentTarget.value);
  }

  function handleCheck(e){
    setIsPublic(e.currentTarget.checked);
  }

  function createDiagram(){
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }

    if(/^\s*$/.test(diagramName) || diagramName==null){
      showAlert("Diagram name cannot be empty!","danger");
      return;
    }

    let diagramCopy = {...diagram};
    diagramCopy.name = diagramName;
    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/user/creatediagram':urls.devUrl+'/user/creatediagram', {
      method: 'POST',
      headers: {         
        'Content-Type': 'application/json',
      },
      credentials: 'include', //this must be set in order to save the received session-cookie,
      //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
      body: JSON.stringify(diagramCopy)
    })
    .then(response => response.json()) //response.json() or response.text() provides the 'data'
    .then((data) => {
        if(data.success){
          setDiagram({...diagram, name: diagramName})
          showAlert(data.message, 'success');
          toggleModal();
        } else {
        showAlert(data.message, 'success');
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
    createDiagramModalShow && <div className="overlay overflow-auto fixed justify-center  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
        <div className="modal bg-white rounded">
            {/* Modal Header */}
            <div className="modal-header flex  gap-5 justify-between items-center border-blue-700 border-b-2 p-5">
              <button type="button" className="p-2 rounded-full transition-colors bg-slate-200 hover:bg-red-300" onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Create New Diagram</p>
              <button className="bg-slate-200 p-2 rounded-full  transition-colors hover:bg-blue-300" type='button' onClick={createDiagram}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
            <form className="flex flex-col overflow-auto">
                    <div className="formItem my-3">
                        {/* <label className='block' htmlFor='diagramName'>Diagram Name</label> */}
                        <input required={true} name='diagramName' id='diagramName' value={diagramName?diagramName:''} onChange={handleChange} className="border p-2 w-full outline-blue-700" type='text' placeholder='Enter the diagram name'></input>
                    </div>
                    <div className="formItem my-3 flex items-center gap-x-2">
                        <input name='isPublic' id='isPublic' className="h-4 w-4 " type='checkbox' checked={isPublic} onChange={handleCheck}></input>
                        <label  htmlFor='isPublic' className=' text-slate-500'>Make this Public</label>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

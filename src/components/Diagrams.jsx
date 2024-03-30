import React, { useEffect } from 'react'
import {useState} from 'react'
import {  useNavigate } from "react-router-dom";

export default function Diagrams({authInfo, showAlert, setDiagram}) {
    const navigate = useNavigate();
    const [diagrams, setDiagrams] = useState(null);

    function getdiagrams(){
        fetch('https://dbcrafter-project.uc.r.appspot.com/user/getdiagrams', {
          method: 'GET',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagrams(data.message.map((element)=>{
                return {...element, isEditing: false}
              }));
            } else {
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
      }

    useEffect(()=>{
      if(!authInfo){
        showAlert("You cannot access this route without signing in!","danger");
        navigate('/');
        return;
      }
      getdiagrams();
    }, [authInfo])

    function openDiagram(e){
      fetch('https://dbcrafter-project.uc.r.appspot.com/user/getdiagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({name:e.currentTarget.dataset.diagramname})
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagram(data.message);
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
    }

    function deleteDiagram(e){
      if(!confirm("Do you really want to delete the diagram?")){
        return;
      }
      fetch('https://dbcrafter-project.uc.r.appspot.com/user/deletediagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({name:e.currentTarget.dataset.diagramname})
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagram({name: null, tbls: [{ name: 'Table1', x: 100, y: 100, w: 150, notNull: false, pKey: null, fields: [{ name: 'id', type: 'INT', isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]});
              getdiagrams();
              showAlert(data.message, "danger");
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
    }

    function enableEdit(e){
      let oldname = e.currentTarget.dataset.diagramname;
      let newDiagrams = diagrams.map((element, index)=>{
        if(element.name === oldname){
          return {...element, isEditing: true};
        }
        return {...element}
      });
      setDiagrams(newDiagrams);
    }

    function disableEdit(e){
      let oldname = e.currentTarget.dataset.diagramname;
      document.getElementById(oldname+'Input').value = oldname;
      let newDiagrams = diagrams.map((element, index)=>{
        if(element.name === oldname){
          return {...element, isEditing: false};
        }
        return {...element}
      });
      setDiagrams(newDiagrams);
    }

    function renameDiagram(e){
      let oldname = e.currentTarget.dataset.diagramname;
      let newname = document.getElementById(oldname+'Input').value;

      if(!document.querySelector('#'+oldname+'Form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
        document.querySelector('#'+oldname+'Form').reportValidity();
        return;
      }
      fetch('https://dbcrafter-project.uc.r.appspot.com/user/renamediagram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', //this must be set in order to save the received session-cookie,
        //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        body: JSON.stringify({oldname: oldname , newname: newname})
    })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data) => {
            if (data.success) {
              showAlert(data.message, 'success');
              getdiagrams();
            } else {
              document.getElementById(oldname+'Input').value = oldname;
              showAlert(data.message, 'success');
            }
        })
        .catch((error) => {
            showAlert('An error occured while trying to access the backend API', 'danger')
            console.log(error)
        })
    }

    return (
    diagrams ? <div className='p-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {diagrams.map((element, index)=>{
              return (
              <div key={index} className="card p-1 rounded-lg border-2 border-blue-50 shadow-lg flex flex-col justify-center items-center transition overflow-hidden hover:shadow hover:border-2 hover:border-blue-400">
                  <div className="image flex justify-center items-center px-2 py-10 w-full" data-diagramname={element.name}  onClick={!element.isEditing?openDiagram:undefined}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-blue-500 w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>

                  </div>
                  <div className="body rounded bg-blue-50 flex justify-between items-center w-full overflow-x-auto p-3">
                      <form id={element.name+'Form'} className='left flex items-center gap-x-2'>
                        <input type='text' required={true} id={element.name+'Input'} defaultValue={element.name} className="diagram-name rounded px-1 py-0.5 outline-blue-700 enabled:border disabled:bg-blue-50" disabled={element.isEditing?false:true} data-diagramname={element.name}/>
                      </form>
                      <div className='right buttons flex flex-nowrap'>
                        <button className={`rename-button rounded-full p-2 hover:bg-blue-200 ${element.isEditing?'hidden':''}`} data-diagramname={element.name} onClick={enableEdit}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                          </svg>
                        </button>
                        <button className={`cancel-button rounded-full p-2 hover:bg-blue-200 ${element.isEditing ? '' : 'hidden'}`} data-diagramname={element.name} onClick={disableEdit}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className={`save-button rounded-full p-2 hover:bg-blue-200 ${element.isEditing?'':'hidden'}`} data-diagramname={element.name} onClick={renameDiagram}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className={`delete-button rounded-full p-2 hover:bg-red-200 ${element.isEditing?'hidden':''}`} data-diagramname={element.name} onClick={deleteDiagram}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                        
                      </div>
                  </div>
                
              </div>
              )
          })}
          <div className="bottom-right-buttons flex flex-col fixed bottom-5 right-5 gap-5">
                    <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={()=>{
                      setDiagram({name: null, tbls: [{ name: 'Table1', x: 100, y: 100, w: 150, notNull: false, pKey: null, fields: [{ name: 'id', type: 'INT', isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]});
                      navigate('/craft');                        
                    }}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New Diagram</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
          </div>
    </div>
    :
        <div className='flex justify-center items-center gap-5 p-10 flex-col'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <div className="text-3xl">
          No diagrams found
          </div>
          <div className="bottom-right-buttons flex flex-col fixed bottom-5 right-5 gap-5">
                    <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={()=>{
                      setDiagram({name: null, tbls: [{ name: 'Table1', x: 100, y: 100, w: 150, notNull: false, pKey: null, fields: [{ name: 'id', type: 'INT', isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]});
                      navigate('/craft');                        
                    }}>
                        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New Diagram</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
          </div>
        </div>
  )
}

import React, { useEffect } from 'react'
import {useState} from 'react'
import {  useNavigate } from "react-router-dom";
import TemplateModal from './TemplateModal';
import PageNumber from './PageNumber';
import TopBar from './TopBar';

export default function Diagrams({showAlert, setDiagram, setIsLoading, urls, theme}) {
    const navigate = useNavigate();
    const [templates, setTemplates]= useState(null);
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [diagrams, setDiagrams] = useState(null);
    const [loadStatus, setLoadStatus] = useState('Fetching Diagrams...');
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pgSize, setPgSize] = useState(8);
    function getdiagrams(page,key=null,size=pgSize){
        setIsLoading(true);
        fetch(import.meta.env.PROD?urls.productionUrl+'/user/getdiagrams':urls.devUrl+'/user/getdiagrams', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({pageNumber: page, keyword: key, pageSize: size}),
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagrams(data.message.map((element)=>{
                return {...element, isEditing: false}
              }));
              setNumPages(data.numPages);
              setPgSize(size);
              setCurrentPage(page?page:currentPage);
            } else {
              setDiagrams(null); //without this, if the last diagram is deleted, the state will remain same, and the last diagram will still be shown on page
              setLoadStatus('No Diagrams Found!');
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          setLoadStatus('Unable to Fetch Diagrams!');
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
      }

    useEffect(getdiagrams,[])

    function openDiagram(e){
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/getdiagram':urls.devUrl+'/user/getdiagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({_id:e.currentTarget.dataset.diagramid})
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
        .finally(()=>{
          setIsLoading(false);
        })
    }

    function deleteDiagram(e){
      if(!confirm("Do you really want to delete the diagram?")){
        return;
      }
      setIsLoading(true);

      let newDiagrams = [...diagrams]; //here we will find index of the deleted diagram, delete it from react state copy, and
      let delIndex = newDiagrams.findIndex((dg)=>{ // will update it in state once request for deletion is successful on server
        return dg._id === e.currentTarget.dataset.diagramid;
      })
      if(delIndex<0){
        showAlert("Diagram with given diagramid not found!","danger");
        return;
      }
      newDiagrams.splice(delIndex,1)

      fetch(import.meta.env.PROD?urls.productionUrl+'/user/deletediagram':urls.devUrl+'/user/deletediagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({_id:e.currentTarget.dataset.diagramid})
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagram({name: null, tbls: null, isPublic: false});

              if(newDiagrams.length === 0){ //if the last diagram was deleted, we set diagrams to null and set loadStatus properly to show that no diagrams exist
                setDiagrams(null);
                setLoadStatus('No Diagrams Found!');
              }else{
                setDiagrams(newDiagrams);
              }
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
        .finally(()=>{
          setIsLoading(false);
        })
    }

    function enableEdit(e){
      let newDiagrams = diagrams.map((element)=>{
        if(element._id === e.currentTarget.dataset.diagramid){
          return {...element, isEditing: true};
        }
        return {...element}
      });
      setDiagrams(newDiagrams);
      let inp = document.getElementById('input'+e.currentTarget.dataset.diagramid);
      console.log(inp);
      inp.disabled = false; //this must be done because if we do not make the input enabled, focus() will be called before it is enabled, thus 
      //the cursor will not be able to move inside the input
      inp.focus();

    }

    function disableEdit(e){
      let oldname = e.currentTarget.dataset.diagramname;
      document.getElementById('input'+e.currentTarget.dataset.diagramid).value = oldname;
      let newDiagrams = diagrams.map((element, index)=>{
        if(element._id === e.currentTarget.dataset.diagramid){
          return {...element, isEditing: false};
        }
        return {...element}
      });
      setDiagrams(newDiagrams);
    }

    function renameDiagram(e){
      let diagramid = e.currentTarget.dataset.diagramid;
      let oldname = e.currentTarget.dataset.diagramname;
      let newname = document.getElementById('input'+diagramid).value;

      if(!document.querySelector('#form'+diagramid).checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
        document.querySelector('#form'+diagramid).reportValidity();
        return;
      }
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/renamediagram':urls.devUrl+'/user/renamediagram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', //this must be set in order to save the received session-cookie,
        //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        body: JSON.stringify({_id: diagramid , newname: newname})
    })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data) => {
          let newDiagrams = diagrams.map((element) => { //the below lines will actually disable the input before doing anything with response
            if (element._id === diagramid) {
              return { ...element, isEditing: false };
            }
            return { ...element }
          });
          setDiagrams(newDiagrams);

          if (data.success) {
            showAlert(data.message, 'success');
            getdiagrams();
          } else {
            document.getElementById('input'+diagramid).value = oldname;
            showAlert(data.message, 'success');
          }
        })
        .catch((error) => {
            showAlert('An error occured while trying to access the backend API', 'danger')
            console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
    }
    

    function toggleTemplateModal(){
      templateModalVisible?setTemplateModalVisible(false):setTemplateModalVisible(true);
    }

    function openTemplateModal(){
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/gettemplates':urls.devUrl+'/user/gettemplates', {
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
              setTemplates(data.message);
            } else {
              setTemplates(null); //without this, if the last diagram is deleted, the state will remain same, and the last diagram will still be shown on page
              setLoadStatus('No Templates Found!');
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          setLoadStatus('Unable to Fetch Templates!');
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
      toggleTemplateModal();
    }

  return (
  <div className={`p-5 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
    <TopBar getdiagrams={getdiagrams} pgSize={pgSize} setPgSize={setPgSize}/>
    {diagrams ?
      <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        {diagrams.map((element, index) => {
          return (
            <div key={index} className={`card p-1 rounded-lg ${theme === 'dark' ? 'border-gray-900 bg-gray-900' : 'border-blue-50'} border-2  shadow-lg flex flex-col justify-center items-center transition overflow-hidden hover:shadow hover:border-2 hover:border-blue-400`}>
              <div className='publicStatus w-full flex justify-end text-gray-400'>
                {
                  element.isPublic ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 open-eye">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 closed-eye">
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                }
              </div>
              <div className="image flex justify-center items-center px-2 py-10 w-full" data-diagramid={element._id} onClick={!element.isEditing ? openDiagram : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-blue-500 w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>

              </div>
              <div className={`body rounded bg-transparent flex justify-between items-center w-full overflow-x-auto p-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                <form id={'form' + element._id} className='left flex items-center gap-x-2'>
                  {/* We need to set key value in the below input to one which changes everytime, because, if key value will be same, defaultValue will be cached for first rerender as the input maintains its own state,
                      But, if the key value exists, and changes on rerender, the defaultValue also changes */}
                  <input key={element._id} type='text' required={true} id={'input' + element._id} defaultValue={element.name} className="diagram-name px-1 py-0.5 border-blue-600 enabled:outline-0 enabled:border-b-2 bg-transparent" disabled={element.isEditing ? false : true} data-diagramid={element._id} />
                </form>
                <div className='right buttons flex flex-nowrap'>
                  <button className={`rename-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-blue-500' : 'hover:bg-blue-200'} ${element.isEditing ? 'hidden' : ''}`} data-diagramid={element._id} onClick={enableEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                  </button>
                  <button className={`cancel-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-200'} ${element.isEditing ? '' : 'hidden'}`} data-diagramname={element.name} data-diagramid={element._id} onClick={disableEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className={`save-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-blue-500' : 'hover:bg-blue-200'} ${element.isEditing ? '' : 'hidden'}`} data-diagramname={element.name} data-diagramid={element._id} onClick={renameDiagram}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className={`delete-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-red-500' : 'hover:bg-red-200'} ${element.isEditing ? 'hidden' : ''}`} data-diagramid={element._id} onClick={deleteDiagram}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          )
        })}
      </div>
      :
      <div className={`p-5 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className='flex gap-x-2 justify-center text-gray-500'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          <div className="text-3xl">
            {loadStatus}
          </div>
        </div>
      </div>
    }
    <div className={`${diagrams?'':'hidden'}`}>
      <PageNumber numPages={numPages} currentPage={currentPage} setCurrentPage={setCurrentPage} getdiagrams={getdiagrams}/>
    </div>
    <div className="bottom-right-buttons flex flex-col fixed bottom-5 right-5 gap-5">
      <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={() => {
        setDiagram({ name: null, tbls: null, isPublic: false });
        navigate('/craft');
      }}>
        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New Diagram</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={openTemplateModal}>
        <span className={`text-sm text-nowrap tooltip absolute right-full top-1/2 bg-white text-black border border-slate-500 px-2 py-1 rounded -translate-y-1/2 me-2 hidden group-hover:block`}>New From Template</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
    <TemplateModal showAlert={showAlert} urls={urls} visible={templateModalVisible} toggleVisible={toggleTemplateModal} templates={templates} setIsLoading={setIsLoading} setDiagram={setDiagram}></TemplateModal>
  </div>
  )
  }

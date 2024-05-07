import React from 'react'
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

export default function DeleteAccount({setIsLoading, showAlert, setCurrentPath, urls, setAuthInfo}) {
    const navigate = useNavigate();

    useEffect(()=>{
        setCurrentPath('/settings/deleteaccount');
    },[]);

    function sendDeleteRequest(){
        let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
        let fdata = {}
        fdobj.forEach(function(value, key){
          fdata[key] = value;
        })
        if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
          document.querySelector('form').reportValidity();
          return;
        }
    
        setIsLoading(true);
        fetch(import.meta.env.PROD?urls.productionUrl+'/user/deleteaccount':urls.devUrl+'/user/deleteaccount', {
            method: 'POST',
            headers: {         
              'Content-Type': 'application/json',
            },
            credentials: 'include', //this must be set in order to save the received session-cookie,
            //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
            body: JSON.stringify(fdata)
          })
          .then(response => response.json()) //response.json() or response.text() provides the 'data'
          .then((data) => {
            showAlert(data.message, data.success?'success':'danger')
            if(data.success){
                setAuthInfo(null);
                navigate('/');
            }
          })
          .catch((error)=>{
            showAlert('An error occured while trying to access the backend API', 'danger')
            console.log(error)
          })
          .finally(()=>{
            //stopping the loader
            setIsLoading(false);
          })
    }

  return (

    <div className='px-10 py-5'>
        <form>
            <div className="my-5 flex flex-col gap-y-1">
                <label htmlFor='password' className='text-slate-400 font-medium'>Password</label>
                <input type='password' name='password' required={true} id='password' className='border text-lg p-2 outline-blue-500 w-full' placeholder='Please re-enter your password'></input>
            </div>
            <div className="my-5 flex gap-x-2">
                <input type='checkbox' required={true} id='email' className='border text-lg p-2 outline-blue-500 w-5'></input>
                <label htmlFor='email' className='text-slate-400 font-medium text-md'>I agree that all my saved diagrams will be deleted</label>
            </div>
            <div className="my-5 flex flex-col gap-y-1">
                <button type='button' className='bg-blue-600 rounded p-2 font-medium text-slate-50 hover:bg-blue-500' onClick={sendDeleteRequest}>Delete</button>
            </div>
        </form>
    </div>
  )
}
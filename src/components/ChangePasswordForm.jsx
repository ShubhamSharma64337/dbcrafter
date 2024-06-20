import { React, useEffect} from 'react'

export default function ChangePasswordForm({theme,urls,setIsLoading,showAlert,setCurrentPath}) {
    useEffect(()=>{
        setCurrentPath('/settings/password');
    },[]);
  function changePassword(){
    let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
    let fdata = {}
    fdobj.forEach(function(value, key){
      fdata[key] = value;
    })
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }

    if(fdata['newPassword'] !== fdata['confirmNewPassword']){
        showAlert('Confirmation password does not match!','warning');
        return;
    }

    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/user/changepassword':urls.devUrl+'/user/changepassword', {
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
                <label htmlFor='oldPass' className='text-slate-400 font-medium'>Old Password</label>
                <input required={true} className={`border text-lg p-2 ${theme==='dark'?'bg-gray-900 border-blue-500 text-white focus:outline-none':'outline-blue-500'}  w-full`} type='password' name='oldPassword' id='oldPass' placeholder='Enter your old password'></input>
            </div>
            <div className="my-5 flex flex-col gap-y-1">
                <label htmlFor='newPass' className='text-slate-400 font-medium'>New Password</label>
                <input required={true} minLength={6} className={`border text-lg p-2 ${theme==='dark'?'bg-gray-900 border-blue-500 text-white focus:outline-none':'outline-blue-500'}  w-full`} type='password' name='newPassword' id='newPass' placeholder='Enter the new password'></input> 
            </div>
            <div className="my-5 flex flex-col gap-y-1">
                <label htmlFor='confirmNewPass' className='text-slate-400 font-medium'>Confirm New Password</label>
                <input required={true} minLength={6} className={`border text-lg p-2 ${theme==='dark'?'bg-gray-900 border-blue-500 text-white focus:outline-none':'outline-blue-500'}  w-full`} type='password' name='confirmNewPassword' id='confirmNewPass' placeholder='Confirm new password'></input>
            </div>
            <div className="my-5 flex flex-col gap-y-1">
                <button type='button' className='bg-blue-600 rounded p-2 font-medium text-slate-50 hover:bg-blue-500' onClick={changePassword}>Change</button>
            </div>
        </form>
    </div>
  )
}

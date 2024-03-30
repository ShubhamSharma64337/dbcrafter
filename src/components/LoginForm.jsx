import React from 'react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
export default function LoginForm({showAlert, setAuthInfo, theme}) {
  const [mail,setMail] = useState('');
  const navigate = useNavigate();
  function handleLowerMail(event){
    setMail(event.target.value.toLowerCase());
  }

  //login function handles click event on login button and uses fetch api to login into the account
  function login(){
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }
    let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
    let fdata = {}
    fdobj.forEach(function(value, key){
      fdata[key] = value;
    })
    fetch('https://dbcrafter-project.uc.r.appspot.com/signin', {
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
      if(data.success){
        setAuthInfo(fdata.email);
        navigate('/');
      }
      showAlert(data.message, data.success?'success':'danger')
    })
    .catch((error)=>{
      showAlert('An error occured while trying to access the backend API', 'danger')
      console.log(error)
    })
  }

  return (
        <div className={`flex justify-center w-full p-10 h-screen ${theme==='dark'?'bg-blue-950':''}`}>
          <form className="shadow-lg rounded w-full sm:w-2/5 h-min  border p-10 bg-white">
          <div className="my-5">
              <label htmlFor="loginName" className="block">Email address</label>
              <input type="email" value={mail} required={true} minLength={5} onChange={handleLowerMail} className="border-2 border-slate-300 bg-slate-50 p-2 w-full out outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="loginName" name="email" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="text-sm text-slate-500">We'll never share your email with anyone else.</div>
          </div>
          <div className="my-5">
              <label htmlFor="loginPassword" className="block">Password</label>
              <input type="password" required={true} minLength={6} className="border-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="loginPassword" placeholder='Enter your password' name="password"/>
          </div>
          <div className="my-5 flex items-center">
              <input type="checkbox" className="w-4 h-4" id="rememberCheck"/>
              <label className="ms-2" htmlFor="rememberCheck">Remember Me</label>
          </div>
          <div className="my-5">
            <button type="button" className="flex justify-center items-center w-full bg-blue-700 p-2 rounded text-white transition hover:bg-blue-600" onClick={login}>
              Login
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ms-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
              </button>
          </div>
          <div className="my-5">
            <Link className="hover:underline text-blue-700" to='/signup'>Don't have an account?</Link>
          </div>
        </form>
        </div>
  )
}

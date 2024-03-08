import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
export default function LoginForm({theme, showAlert}) {
  const [mail,setMail] = useState('');
  function handleLowerMail(event){
    setMail(event.target.value.toLowerCase());
  }

  //login function handles click event on login button and uses fetch api to login into the account
  function login(){
    let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
    let fdata = {}
    fdobj.forEach(function(value, key){
      fdata[key] = value;
    })
    fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {         
        'Content-Type': 'application/json',
      },
      credentials: 'include', //this must be set in order to save the received session-cookie,
      //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
      body: JSON.stringify(fdata)
    })
    .then(response => response.json()) //response.json() or response.text() provides the 'data'
    .then(data => showAlert(data.message, data.success?'success':'danger'))
    .catch((error)=>{
      showAlert('An error occured while trying to access the backend API', 'danger')
      console.log(error)
    })
  }

  return (
        <form className="shadow border p-10">
          <div className="my-5">
              <label htmlFor="loginName" className="block">Email address</label>
              <input type="email" value={mail} onChange={handleLowerMail} className="border p-2 w-full out outline-blue-700" id="loginName" name="email" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="text-sm text-slate-500">We'll never share your email with anyone else.</div>
          </div>
          <div className="my-5">
              <label htmlFor="loginPassword" className="block">Password</label>
              <input type="password" className="border p-2 w-full outline-blue-700" id="loginPassword" placeholder='Enter your password' name="password"/>
          </div>
          <div className="my-5 flex items-center">
              <input type="checkbox" className="w-4 h-4" id="rememberCheck"/>
              <label className="ms-2" htmlFor="rememberCheck">Remember Me</label>
          </div>
          <div className="my-5">
            <button type="button" className="w-full bg-blue-700 p-2 rounded text-white transition hover:scale-95" onClick={login}>Login <i className="bi bi-arrow-right fs-5 mx-2"></i></button>
          </div>
          <div className="my-5">
            <Link className="underline text-slate-500" to='/signup'>Don't have an account?</Link>
          </div>
        </form>
  )
}

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
    <div  className={`card border-1 shadow ${theme==='dark'?'bg-dark shadow-lg text-light':'bg-light'}`} data-bs-theme={theme}>
        <form className='p-5'>
          <div className="mb-3">
              <label htmlFor="loginName" className="form-label">Email address</label>
              <input type="email" value={mail} onChange={handleLowerMail} className="form-control" id="loginName" name="email" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input type="password" className="form-control" id="loginPassword" placeholder='Enter your password' name="password"/>
          </div>
          <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
              <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
          </div>
          <div className='mt-5'>
            <button type="button" className="btn btn-primary w-100 py-1 d-flex align-items-center justify-content-center" onClick={login}>Login <i className="bi bi-arrow-right fs-5 mx-2"></i></button>
          </div>
          <div className='mt-3'>
            <Link className='link-secondary' to='/signup'>Don't have an account?</Link>
          </div>
        </form>
    </div>
  )
}

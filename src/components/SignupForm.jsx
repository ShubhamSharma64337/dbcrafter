import React from 'react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
export default function SignupForm({theme, showAlert}) {
  const [mail,setMail] = useState('');
  const navigate = useNavigate();
  function handleLowerMail(event){
    setMail(event.target.value.toLowerCase());
  }
  //signup function handles click event on signup button and uses fetch api to signup into the account
  function signup(){
    let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
    let fdata = {}
    fdobj.forEach(function(value, key){
      fdata[key] = value;
    })
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {         
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fdata)
    })
    .then(response => response.json()) //response.json() or response.text() provides the 'data'
    .then((data) => {
      showAlert(data.message, data.success?'success':'danger')
      if(data.success){
        navigate('/')
      }
    })
    .catch((error)=>{
      showAlert('An error occured while trying to access the backend API', 'danger')
      console.log(error)
    })
  }
  return (
    <div className={`card shadow border-1 ${theme==='dark'?'bg-dark shadow-lg text-light':'bg-light'}`} data-bs-theme={theme}>
        <form className='p-5'>
          <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label">Email address</label>
              <input type="email" name='email' value={mail} onChange={handleLowerMail} className="form-control" id="signupEmail" aria-describedby="emailHelp" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
              <label htmlFor="signupPassword" className="form-label">Password</label>
              <input name='password' type="password" className="form-control" id="signupPassword" placeholder='Enter a password'/>
          </div>
          <div className="mb-3">
              <label htmlFor="signupConfirmPassword" className="form-label">Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-control" id="signupConfirmPassword" placeholder='Re-enter the password'/>
          </div>
          <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
              <label className="form-check-label" htmlFor="exampleCheck1">I agree to terms and conditions</label>
          </div>
          <div className="mt-5">
            <button type="button" className="btn btn-primary w-100 py-1 d-flex align-items-center justify-content-center" onClick={signup}>Sign Up<i className="bi bi-arrow-right fs-5 mx-2"></i></button>
          </div>
          <div className="my-3">
            <Link className='link-secondary' to='/'>Already have an account?</Link>
          </div>
        </form>
    </div>
  )
}

import React from 'react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
export default function SignupForm({theme, showAlert}) {
  const navigate = useNavigate();

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

        <form className="shadow border p-10">
          <div className="my-5">
              <label htmlFor="signupEmail" className="block">Email address</label>
              <input type="email" name='email' className="border p-2 w-full outline-blue-700" id="signupEmail" aria-describedby="emailHelp" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="text-sm text-slate-500">We'll never share your email with anyone else.</div>
          </div>
          <div className="my-5">
              <label htmlFor="signupPassword" className="block">Password</label>
              <input name='password' type="password" className="border p-2 w-full outline-blue-700" id="signupPassword" placeholder='Enter a password'/>
          </div>
          <div className="my-5">
              <label htmlFor="signupConfirmPassword" className="block">Confirm Password</label>
              <input name="confirmPassword" type="password" className="border p-2 w-full outline-blue-700" id="signupConfirmPassword" placeholder='Re-enter the password'/>
          </div>
          <div className="my-5 flex items-center">
              <input type="checkbox" className="w-4 h-4" id="termsCheck"/>
              <label className="ms-2" htmlFor="termsCheck">I agree to terms and conditions</label>
          </div>
          <div className="my-5">
            <button type="button" className="flex justify-center items-center w-full bg-blue-700 text-white p-2 rounded transition hover:scale-95" onClick={signup}>
              Sign Up
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ms-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
          <div className="my-5">
            <Link className="underline text-slate-500" to='/'>Already have an account?</Link>
          </div>
        </form>

  )
}

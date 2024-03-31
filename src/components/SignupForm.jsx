import {React, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import TermsModal from './TermsModal';

export default function SignupForm({showAlert, theme, setIsLoading, urls}) {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  function toggleTerms(){
      showTerms?setShowTerms(false):setShowTerms(true);
  }
  //signup function handles click event on signup button and uses fetch api to signup into the account
  function signup(){
    let fdobj = new FormData(document.querySelector('form')) //this retrieves only those inputs which have a name value
    let fdata = {}
    fdobj.forEach(function(value, key){
      fdata[key] = value;
    })
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }
    //starting the loader
    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/signup':urls.devUrl+'/signup', {
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
    .finally(()=>{
      //stopping the loader
      setIsLoading(false);
    })
  }
  return (

        <div className={`w-full flex justify-center h-screen p-10 ${theme==='dark'?'bg-blue-950':''}`}>
          <form className="shadow-lg w-full sm:w-2/5 h-min border p-10 bg-white rounded">
          <div className="my-5">
              <label htmlFor="signupEmail" className="block">Email address</label>
              <input type="email" required={true} name='email' minLength={5} className="border-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupEmail" aria-describedby="emailHelp" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="text-sm text-slate-500">We'll never share your email with anyone else.</div>
          </div>
          <div className="my-5">
              <label htmlFor="signupPassword" className="block">Password</label>
              <input name='password' type="password" required={true} minLength={6} className="border-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupPassword" placeholder='Enter a password'/>
          </div>
          <div className="my-5">
              <label htmlFor="signupConfirmPassword" className="block">Confirm Password</label>
              <input name="confirmPassword" type="password" required={true} minLength={6} className="border-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupConfirmPassword" placeholder='Re-enter the password'/>
          </div>
          <div className="my-5 flex items-center">
              <input type="checkbox" className="w-4 h-4" id="termsCheck" required={true}/>
              <label className="ms-2" htmlFor="termsCheck">I agree to terms and conditions</label>
              <button type='button' className='flex items-center ms-1' onClick={toggleTerms}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mt-[4px] w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </button>
          </div>
          <div className="my-5">
            <button type="button" className="flex justify-center items-center w-full bg-blue-700 text-white p-2 rounded transition hover:bg-blue-600" onClick={signup}>
              Sign Up
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ms-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
          <div className="my-5">
            <Link className="text-blue-700 hover:underline" to='/login'>Already have an account?</Link>
          </div>
          <TermsModal visible={showTerms} toggleTerms={toggleTerms}></TermsModal> 
        </form>
        </div>

  )
}

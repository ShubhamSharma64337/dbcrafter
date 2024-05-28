import {React, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import TermsModal from './TermsModal';

export default function SignupForm({showAlert, theme, setIsLoading, urls}) {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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

        <div className={`w-full flex justify-center h-screen p-10 ${theme==='dark'?'bg-gray-950':'bg-white'}`}>
          <form className={`shadow-lg w-full sm:w-2/5 h-min p-10 ${theme==='dark'?'bg-gray-900 text-white':'bg-white border'} rounded`}>
          <div className="my-5">
              <label htmlFor="signupEmail" className="block">Email address</label>
              <input type="email" required={true} name='email' minLength={5} className="text-black border-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupEmail" aria-describedby="emailHelp" placeholder='abc@xyz.com'/>
              <div id="emailHelp" className="text-sm text-slate-500">We'll never share your email with anyone else.</div>
          </div>
          <div className="my-5">
              <label htmlFor="signupPassword" className="block">Password</label>
              <div className='flex'>
                <input name='password' type={passwordVisible?'text':'password'} required={true} minLength={6} className="text-black border-2 border-r-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupPassword" placeholder='Enter a password'/>
                <button type='button' className="px-2 border-2 border-l-0 -z-2 border-slate-300 bg-slate-50 text-slate-500 rounded-r outline-blue-700" onClick={()=>{
                  passwordVisible?setPasswordVisible(false):setPasswordVisible(true);
                }}>
              {passwordVisible ?
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
              </button>
              </div>
          </div>
          <div className="my-5">
              <label htmlFor="signupConfirmPassword" className="block">Confirm Password</label>
              <div className='flex'>
                <input name="confirmPassword" type={confirmPasswordVisible?'text':'password'} required={true} minLength={6} className="text-black border-2 border-r-2 border-slate-300 bg-slate-50 p-2 w-full outline-blue-700 hover:bg-slate-200 transition focus:bg-white" id="signupConfirmPassword" placeholder='Re-enter the password'/>
                <button type='button' className="px-2 border-2 border-l-0 -z-2 border-slate-300 bg-slate-50 text-slate-500 rounded-r outline-blue-700" onClick={()=>{
                  confirmPasswordVisible?setConfirmPasswordVisible(false):setConfirmPasswordVisible(true);
                }}>
              {confirmPasswordVisible ?
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
              </button>
              </div>
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
          <TermsModal visible={showTerms} toggleTerms={toggleTerms} theme={theme}></TermsModal> 
        </form>
        </div>

  )
}

import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
export default function SignupForm() {
  const [mail,setMail] = useState('');
  function handleLowerMail(event){
    setMail(event.target.value.toLowerCase());
  }
  return (
    <div>
        <form>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" value={mail} onChange={handleLowerMail} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword2" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
            <label class="form-check-label" for="exampleCheck1">I agree to terms and conditions</label>
        </div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
                 
        <div class="my-3">
          <Link className='link-secondary' to='/'>Already have an account?</Link>
        </div>
        </form>
    </div>
  )
}

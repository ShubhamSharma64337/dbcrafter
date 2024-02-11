import React from 'react'
import LoginForm  from './LoginForm'
import SignupForm from './SignupForm'
export default function MainContent(props) {
  return (
        <div className='main-content container'>
        <div className='main-container container row p-5'>
            <div className='left p-5 col-12 col-md-5'>
                <p className='h3'>
                    Open Source relational database design tool built using ReactJS and HTML Canvas 
                </p>
            </div>
            <div className='center col-2 d-none d-md-flex justify-content-center'>
                <div className='sep border-start'></div>
            </div>
            <div className='right p-5 col-12 col-md-5'>
                <p>
                    {props.type==='signup'?<SignupForm/>:<LoginForm/>}
                </p>
            </div>
        </div>
    </div>

  )
}

import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
export default function MainContent({type, theme, showAlert, authInfo}) {
    return (
            <div className={`row h-100 align-items-center justify-content-center pb-5 overflow-y-auto bg-${theme}`}>
                <div className='left col col-md-8'>
                    <p className={`fw-bold p-5 text-center fs-3 ${theme==='light'?'text-dark':'text-light'}`} >
                        Open Source relational database design tool built using ReactJS and HTML Canvas. Create diagrams, use templates, export as SQL or image.
                    </p>
                </div>
                <div className={`right col col-md-4 p-5 ${authInfo?'d-none':''}`}>
                        {type === 'signup' ? <SignupForm theme={theme} showAlert={showAlert}/> : <LoginForm theme={theme} showAlert={showAlert}/>}
                </div>
            </div>
    )
}

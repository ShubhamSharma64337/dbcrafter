import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function MainContent({type, theme, showAlert, authInfo}) {
    return (
        <div className="flex flex-col justify-center items-center  md:flex-row">
                <div className="left w-full p-10 md:w-2/3">
                    <p className="text-3xl font-medium text-center" >
                        Open Source relational database design tool built using ReactJS and HTML Canvas. Create diagrams, use templates, export as SQL or image.
                    </p>
                </div>
                <div className="right w-full p-10 md:w-1/3">
                        {type === 'signup' ? <SignupForm theme={theme} showAlert={showAlert} authInfo={authInfo}/> : <LoginForm theme={theme} showAlert={showAlert}/>}
                </div>
            </div>
    )
}

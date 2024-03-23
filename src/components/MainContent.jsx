import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import TermsModal from './TermsModal';

export default function MainContent({type, theme, showAlert, authInfo}) {
    const [showTerms, setShowTerms] = useState(false);
    function toggleTerms(){
        showTerms?setShowTerms(false):setShowTerms(true);
    }
    return (
        <div className="flex flex-col justify-center items-center md:mt-20 md:flex-row">
                <div className="left w-full p-10 md:w-2/3">
                    <p className="text-3xl font-medium text-center" >
                        Open Source relational database design tool built using ReactJS and HTML Canvas. Create diagrams, use templates, export as SQL or image.
                    </p>
                </div>
                <div className={`right w-full p-10 md:w-1/3 ${authInfo?'hidden':''}`}>
                        {type === 'signup' ? <SignupForm theme={theme} showAlert={showAlert} authInfo={authInfo}  toggleTerms={toggleTerms}/> : <LoginForm theme={theme} showAlert={showAlert}/>}
                </div>
                <TermsModal visible={showTerms} toggleTerms={toggleTerms}></TermsModal> 
        </div>
    )
}

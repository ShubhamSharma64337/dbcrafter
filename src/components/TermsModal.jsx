import React from 'react'

export default function TermsModal({visible, toggleTerms, theme}) {
  return (
    visible && <div className="overlay overflow-auto fixed justify-center left-0  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
        <div className={`modal ${theme==='dark'?'bg-gray-900':'bg-white'} rounded w-4/5 sm:w-2/5`}>
            {/* Modal Header */}
            <div className="modal-header flex  gap-5 justify-between items-center border-blue-700 border-b-2 p-5">
              <button type="button" className={`p-2 rounded-full transition-colors ${theme==='dark'?'bg-transparent hover:bg-red-500':'bg-slate-200 hover:bg-red-300'} `} onClick={toggleTerms}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className={`modal-body p-5 ${theme==='dark'?'bg-slate-900':''}`}>
                <p>
                    By signing up, you agree to share your email with us which will be stored in plain text form. The data will
                    be stored in a MongoDB Cloud Database, therefore, Dbcrafter will not be responsible for any kind of data theft 
                    or leaks. Your password will be converted into a hash with bcrypt before storing it in the database, but email address will be stored as it is. 
                </p>
            </div>
        </div>
    </div>
  )
}

import React from 'react'

export default function GuestInfoModal({visible, toggleModal}) {
  return (
    visible && <div className="overlay overflow-auto fixed justify-center left-0  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
        <div className="modal bg-white rounded w-4/5 sm:w-2/5">
            {/* Modal Header */}
            <div className="modal-header flex  gap-5 justify-between items-center border-blue-700 border-b-2 p-5">
              <button type="button" className="p-2 rounded-full transition-colors bg-slate-200 hover:bg-red-300" onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
                <p>
                    You are not signed into an account, therefore many features including Saving the diagrams, Generating SQL, Exporting Images etc. will be disabled.
                     To access all the features, please create an account and sign-in.
                </p>
            </div>
        </div>
    </div>
  )
}

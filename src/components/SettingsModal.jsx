import React from 'react'
import Settings from './Settings'

export default function SettingsModal() {
  return (
    <div className="overlay overflow-auto fixed justify-center  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35">
            <div className="modal bg-white rounded">
            

            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
                <Settings/>
            </div>
    </div>
  )
}

import React from 'react'


export default function Modal({show, toggleModal, tbl}) {
  return (
    show && <div className="fixed justify-center flex items-center top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className="modal-body bg-white p-4 rounded">
                <form className="flex flex-col">
                    <div className="formItem mb-3">
                        <label className='block' htmlFor='tableName'>Table Name</label>
                        <input id='tableName' className="border p-2" defaultValue={tbl.name} type='text' placeholder='Enter the table name'></input>
                    </div>
                    <div className="formItem mt-3 flex justify-between">
                        <button type="button" className="bg-red-700 p-2 rounded text-white" onClick={toggleModal}>Cancel</button>
                        <button className="bg-blue-700 p-2 rounded text-white" type='submit'>Add Table</button>
                    </div>
                </form>
        </div>
    </div>
  )
}
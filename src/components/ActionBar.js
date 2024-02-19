import React, { useState } from 'react'

export default function ActionBar(props) {
    //this function fills the select input with field names of the selected table when deleting a field
    const [hidden,setHidden] = useState(false);
    function setDelRowModal() {
        if (!props.tbls) {
            return;
        }
        let select_input = document.querySelector('#delFieldName');
        while (select_input.options.length > 0) {
            select_input.remove(0);
        }
        for (let field of props.tbls[props.selections.selectedTbl].fields) {
            let newOption = new Option(field.name, field.name);
            select_input.add(newOption);
        }
    }

    //this function fills the select input with field names of the selected table when changing pkey
    function setChgPKeyModal() {
        if (!props.tbls) {
            return;
        }
        let select_input = document.querySelector('#pKeyField');
        while (select_input.options.length > 0) {
            select_input.remove(0);
        }
        for (let field of props.tbls[props.selections.selectedTbl].fields) {
            let newOption = new Option(field.name, field.name);
            select_input.add(newOption);
        }
    }

    //this function fills the rename table modal with old table name value and resets the new name value
    function setRenameModal() {
        if (!props.tbls) {
            return;
        }
        document.querySelector("#oldTblName").value = props.tbls[props.selections.selectedTbl].name;
        document.querySelector("#newTblName").value = '';
    }

    //this function makes sure new name is not same as the old name
    function newNameValidator() {
        let newName = document.querySelector('#newTblName').value;
        if (newName === document.querySelector('#oldTblName').value) {
            document.querySelector('#newNameError').hidden = false;
            document.querySelector('#newNameSubmitBtn').disabled = true;
        } else {
            document.querySelector('#newNameError').hidden = true;
            document.querySelector('#newNameSubmitBtn').disabled = false;
        }
    }

    //this function properly initializes the Add New Row modal fields
    function setAddRowModal(){
        document.querySelector("#fieldName").value = '';
    }

    //this function is used to toggle the action bar hidden prop
    function toggleHidden(){
        hidden?setHidden(false):setHidden(true);
    }
    
    //this function triggers an alert with message that no tables exist
    function noTblError(){
        props.showAlert('No tables exist','warning');
    }
    return (
        <div>
            <div className='action-bar fixed-bottom d-flex justify-content-center align-items-center'>
                <ul className={`border border-warning my-3 p-0 bg-white rounded-3 d-flex align-items-center  ${hidden?'d-none':''}`} style={{ listStyle : 'none' }}>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target='#addTblModal' data-bs-toggle='modal'><i className="bi bi-file-plus-fill text-warning fs-3"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#delTblModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?undefined:noTblError}><i className="bi bi-file-minus-fill fs-3 text-warning"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#addRowModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setAddRowModal:noTblError}><i className="bi bi-node-plus-fill fs-3 text-warning"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#delRowModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setDelRowModal:noTblError}><i className="bi bi-node-minus-fill fs-3 text-warning"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#chgPKeyModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setChgPKeyModal:noTblError}><i className="bi bi-key-fill fs-3 text-warning"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#renameModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setRenameModal:noTblError}><i className="bi bi-input-cursor-text fs-3 text-warning"></i></button>
                    </div>
                </ul>
                <div className='pullBtn'>
                    <i class={`bi bi-caret-${hidden?"up":"down"}-square-fill text-warning fs-5 my-0`} onClick={toggleHidden}></i>
                </div>
            </div>
            <div className="modal fade" id="addTblModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addTblModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addTblModalLabel">Add Table</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="tblName" className="form-label">Table Name</label>
                                <input type="text" className="form-control" id="tblName" placeholder="Enter name of table" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.addTbl}>Create</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addRowModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addRowModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addRowModalLabel">New Field</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="fieldName" className="form-label">Field Name</label>
                                <input type="text" className="form-control" id="fieldName" placeholder="Enter name of field" />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='fieldType' className='form-label'>Field Type</label>
                                <select id='fieldType' defaultValue={'NONE'} className="form-select" aria-label="Default select example">
                                    <option>NONE</option>
                                    <option>BOOL</option>
                                    <option>CHAR</option>
                                    <option>INT</option>
                                    <option>BIGINT</option>
                                    <option>FLOAT</option>
                                    <option>DOUBLE</option>
                                    <option>DATE</option>
                                    <option>VARCHAR</option>
                                    <option>TIMESTAMP</option>
                                    <option>TIME</option>
                                    <option>YEAR</option>
                                </select>

                            </div>
                            <div className='mb-3'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="isPkey" />
                                    <label className="form-check-label" htmlFor="isPkey">
                                        Primary key
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={props.addRow}>Add</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="delRowModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="delRowModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="delRowModalLabel">Delete Field</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="delFieldName" className="form-label">Field Name</label>
                                <select id='delFieldName' className="form-select" aria-label="Default select example">
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={props.delRow}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="delTblModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="delTblModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="delTblModalLabel">Delete Table</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Do you want to delete the selected table?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={props.delTbl}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="chgPKeyModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="chgPKeyModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="chgPKeyModalLabel">Change Primary key</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="pKeyField" className="form-label">Field Name</label>
                                <select id='pKeyField' className="form-select" aria-label="Default select example">

                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss='modal' onClick={props.chgPKey}>Change</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="renameModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="renameModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="renameModalLabel">Rename Table</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="oldTblName" className="form-label">Old Table Name</label>
                                <input type="text" className="form-control" disabled={true} id="oldTblName" placeholder="Old Table name" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newTblName" className="form-label">New Table Name</label>
                                <input type="text" className="form-control" id="newTblName" placeholder="Enter the new name" onChange={newNameValidator} />
                                <p id='newNameError' className='mx-1 text-danger' hidden={true}>New name is same as the old name</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id='newNameSubmitBtn' type="button" className="btn btn-danger" data-bs-dismiss='modal' onClick={props.renameTbl}>Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

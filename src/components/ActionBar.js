import React, { useState } from 'react'

export default function ActionBar(props) {
    const [hidden,setHidden] = useState(false);
    //this function resets the table name field to blank when creating a new table
    function setAddTblModal(){
        document.querySelector("#tblName").value = '';
    }
    //this function fills the select input with field names of the selected table when deleting a field
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

    //this function properly initializes/resets the Add New Row modal fields
    function setAddRowModal(){
        document.querySelector("#fieldName").value = '';
        document.querySelector('#fieldType').value = 'NONE';
        document.querySelector('#isFKey').checked = false;
        document.querySelector('#isPKey').checked = false;
        document.querySelector('.fKeyInputs').classList.add('d-none');
        document.querySelector('#refFieldName').value = 'NONE';
        document.querySelector('#refFieldName').disabled = true;
        if(props.tbls.length < 2){ //this condition disables the Foreign Key checkbox if there does not exist any other table
            document.querySelector('#isFKey').disabled = true;
        } else {
            document.querySelector('#isFKey').disabled = false;
        }
    }

    //this function enables setting the table name if Foreign Key checkbox is checked while adding new row
    //it also fills the select list of table names properly, it is added as onchange event handler of the isFKey checkbox
    function enableRefTblInput(){
        let fKeyCheck = document.querySelector('#isFKey');
        let refTblInput = document.querySelector('#refTblName');
        let refFieldInput = document.querySelector('#refFieldName');
        if(fKeyCheck.checked){ 
            document.querySelector('.fKeyInputs').classList.remove('d-none'); //unhides the foreign key related inputs
            if(!props.tbls){
                return;
            }
            while (refTblInput.options.length > 0) { //to avoid repeated addition of same options
                refTblInput.remove(0);
            }
            refTblInput.add(new Option('NONE','NONE'));
            for (let tbl of props.tbls) { //adding the names of tables except the selected table to the select list
                if(tbl.name === props.tbls[props.selections.selectedTbl].name){
                    continue;
                }
                let newOption = new Option(tbl.name, tbl.name);
                refTblInput.add(newOption);
            }
        } else {
            document.querySelector('.fKeyInputs').classList.add('d-none'); //hides the foreign key related inputs
            refTblInput.value = 'NONE';
            refFieldInput.disabled = true; //disables the Referenced Field Name input when checkbox is unchecked
            refFieldInput.value = 'NONE';
        }
        
    }

    //this function enables and properly initializes the Referenced Field Name select list when Referenced Table Name is changed
    //this is added to onchange event handler of Referenced Table Name select list
    function enableRefFieldInput(){
        let refTblInput = document.querySelector('#refTblName');
        let refFieldInput = document.querySelector('#refFieldName');
        let refTblExists = false;
        let tblIndex = 0;
        for(let tbl of props.tbls){ //checking if user has selected a valid table (e.g the user might have selected the default option 'NONE')
            if(tbl.name === refTblInput.value){
                refTblExists = true;
                break;
            }
            tblIndex += 1; //storing the index of the table selected in select list
        }

        if(refTblExists){
            while (refFieldInput.options.length > 0) {
                refFieldInput.remove(0);
            }
            refFieldInput.add(new Option('NONE','NONE'));
            for (let field of props.tbls[tblIndex].fields) { //filling the field names of the referenced table
                let newOption = new Option(field.name, field.name);
                refFieldInput.add(newOption);
            }
            refFieldInput.disabled = false; //enabling the referenced field input select list
        } else {
            refFieldInput.value = 'NONE'; //this again resets and disables the referenced field input select list
            refFieldInput.disabled = true; // if the user reselects the default 'NONE' option in the referenced table list
        }
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
        <>
            <div className='action-bar d-flex align-items-center position-absolute bottom-0'>
                <ul className={`border border-end-0 shadow my-3 p-0 ${props.theme==='dark'?'bg-dark':'bg-white'} transition rounded-3 d-flex align-items-center  ${hidden?'d-none':''}`} style={{ listStyle : 'none' }}>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target='#addTblModal' data-bs-toggle='modal' onClick={setAddTblModal}><i className="bi bi-file-plus-fill text-primary fs-3"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#delTblModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?undefined:noTblError}><i className="bi bi-file-minus-fill fs-3 text-primary"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#addRowModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setAddRowModal:noTblError}><i className="bi bi-node-plus-fill fs-3 text-primary"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#delRowModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setDelRowModal:noTblError}><i className="bi bi-node-minus-fill fs-3 text-primary"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#chgPKeyModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setChgPKeyModal:noTblError}><i className="bi bi-key-fill fs-3 text-primary"></i></button>
                    </div>
                    <div className='action-button mx-2 my-0'>
                        <button className='btn' data-bs-target={props.tbls?'#renameModal':undefined} data-bs-toggle={props.tbls?'modal':undefined} onClick={props.tbls?setRenameModal:noTblError}><i className="bi bi-input-cursor-text fs-3 text-primary"></i></button>
                    </div>
                </ul>
                <div className='pullBtn'>
                    <i className={`bi px-1 ${hidden?'rounded-top':'rounded-end'}  bg-${props.theme} shadow bi-caret-${hidden?"up":"down"}-fill text-primary fs-5 my-0`} onClick={toggleHidden}></i>
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
                                    <input className="form-check-input" type="checkbox" value="" id="isPKey" />
                                    <label className="form-check-label" htmlFor="isPKey">
                                        Primary key
                                    </label>
                                </div>
                            </div>
                            <div className='mb-3'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="isFKey" onChange={enableRefTblInput}/>
                                    <label className="form-check-label" htmlFor="isFKey">
                                        Foreign key
                                    </label>
                                </div>
                            </div>
                            <div className='fKeyInputs m-0 p-0 d-none'>
                                <div className="mb-3">
                                    <label htmlFor="refTblName" className="form-label">Referenced Table Name</label>
                                    <select id='refTblName' className="form-select" aria-label="Default select example" defaultValue={'NONE'} onChange={enableRefFieldInput}>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="refFieldName" className="form-label">Referenced Field Name</label>
                                    <select id='refFieldName' className="form-select" disabled={true} aria-label="Default select example" defaultValue={'NONE'}>
                                    </select>
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
        </>
    )
}

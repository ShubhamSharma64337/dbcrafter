import React, { useState } from 'react'
import Tooltip from './Tooltip';


export default function CreateTableModal({theme, show, toggleCreateModal, addTable, tbls, showAlert, dtypes, setIsLoading, urls, authInfo}) {
  const [maxIndex, setMaxIndex] = useState(0);
  const [newTbl, setNewTbl] = useState({name: 'table1', pKey: null, fields: [ //this state variable tracks the details filled into the modal form by the user, once finished, when user clicks on go button, this variable is used to add to the application level diagram object's tables
    {name: 'id', type: 'INT', size: null, notNull: false, unique: false, isFKey: false, refTbl: 'NONE', refField: 'NONE', default: null}
  ]})

  function handleNameChange(e){ //table name change handler
    setNewTbl({...newTbl, name: e.target.value});
  }

  function addField(e){ //this adds field to the newTbl state variable which represents the temporary table filled into the modal and not the table belonging to the diagram
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
    const insertIndex = parseInt(e.currentTarget.dataset.rowindex) + 1;
    tableCopy.fields.splice(insertIndex,0, {name: 'field'+(maxIndex+1),size: null, type: 'INT', notNull: false, unique: false, isFKey: false, refTbl: 'NONE', refField: 'NONE', default: null})
    setNewTbl(tableCopy);
    setMaxIndex(maxIndex+1);
  }

  function delField(e){ //this deletes field from the newTbl state variable which represents the temporary table filled into the modal and not the table belonging to the diagram
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
    if(tableCopy.fields.length<2){
      showAlert("Table must have at least one row!","danger");
      return;
    }
    if(tableCopy.fields[parseInt(e.currentTarget.dataset.rowindex)].name === tableCopy.pKey){ //this resets the primary key to null if field which is currently set to primary key is deleted
      tableCopy.pKey = null;
    }
    tableCopy.fields.splice(parseInt(e.currentTarget.dataset.rowindex),1)
    setNewTbl(tableCopy);
  }

  function handleChange(e){
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    const rowindex = parseInt(e.currentTarget.dataset.rowindex);
    let tableCopy = {}
    if(e.currentTarget.name==='isFKey'){ //to handle change in fkey checkbox

      let checked = e.currentTarget.checked;
      tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
        if(index === rowindex){
          if(checked === false){
            return {...element, [name]:checked, refTbl: 'NONE', refField: 'NONE'}
          }
          return {...element, [name]: checked};
        } else {
          return {...element};
        }
      })}
    } else if (name === 'notNull' || name === 'unique'){ //handles change in Not Null checkbox
      let checked = e.currentTarget.checked;
      tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
        if(index === rowindex){
          return {...element, [name]: checked};
        } else {
          return {...element};
        }
      })}
    } else if (name === 'pKey'){ //handle change in pkey checkbox
      let checked = e.currentTarget.checked;
      let currentField = newTbl.fields[parseInt(e.currentTarget.dataset.rowindex)];
      if(checked === true){
          tableCopy = {...newTbl, pKey: currentField.name}
        } else { //if user unchecked the checkbox
          tableCopy = {...newTbl, pKey: null};
      }
    } else {  //handle change in field name or type or any other text input
      tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
        if(index === rowindex){
          return {...element, [name]: value};
        } else {
          return {...element};
        }
      })}
    }
    setNewTbl(tableCopy);
  }

  function handleSelect(e){ //this function handles change in selection of all the select lists
    const name = e.currentTarget.name; //retrieving the name value of the select list, this will be same as the key in the newTbl dictionary
    const value = e.currentTarget.value; //retrieving the value of the select field
    const rowindex = parseInt(e.currentTarget.dataset.rowindex); //retrieving the field index using the data attribute of the select input
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{ //now starting actually modifying the select field
        if(index === rowindex){
          return {...element, [name]: value, size: null};  //Here we set size to null because if datatype is set to one without size, we need to update it
        } else {
          return {...element};
        }
    })}
    setNewTbl(tableCopy);
  }

  function addTbl(){
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }
    for(let field of newTbl.fields){
      if(field.isFKey){
        if(field.refTbl==='NONE' || field.refField==='NONE'){
          showAlert("You must set referenced table and field if you have checked Foreign key!","warning");
          return;
        }
      }
      if(/^\s*$/.test(field.name)){
        showAlert("Fieldname cannot be empty!","warning");
        return;
      }
    }
    let res = addTable(newTbl);
    if(res!==0){
      return;
    }
    toggleCreateModal();
    setNewTbl({name: 'table1', pKey: null, fields: [{name: 'id', type: 'INT', size: null, notNull: false, unique: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'}]}) //this resets
    //the modal when a table has been added
    setMaxIndex(0)
  }

  function closeModal(){
    setNewTbl({name: 'table1', pKey: null, fields: [{name: 'id', type: 'INT', size: null, notNull: false, unique: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'}]}) //this resets the modal
    //if the user closes the modal without adding the table to the diagram
    setMaxIndex(0)
    toggleCreateModal(0)
  }

  function autoFill(){
    if(!document.getElementById('tableName').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.getElementById('tableName').reportValidity();
      return;
    }
    const fdata = {tblName: document.getElementById('tableName').value};
    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/user/getattributes':urls.devUrl+'/user/getattributes', {
      method: 'POST',
      headers: {         
        'Content-Type': 'application/json',
      },
      credentials: 'include', //this must be set in order to save the received session-cookie,
      //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
      body: JSON.stringify(fdata)
    })
    .then(response => response.json()) //response.json() or response.text() provides the 'data'
    .then((data) => {
        if(data.success){
          let autoTbl = {...newTbl, fields: []};
        for(let field of data.message){
          if(field.isPKey){
            autoTbl.pKey = field.name;
          }
          autoTbl.fields.push({name: field.name, type: field.type, size: null, notNull: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'})
        }
        setNewTbl(autoTbl);
      }else{
        showAlert(data.message, data.success?'success':'danger')
      }
    })
    .catch((error)=>{
      showAlert('An error occured while trying to access the backend API', 'danger')
      console.log(error)
    })
    .finally(()=>{
      //stopping the loader
      setIsLoading(false);
    })
  }

  return (
    show && <div className="overlay overflow-auto fixed justify-center md:justify-center flex items-start p-5 top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className={`modal ${theme==='dark'?'bg-gray-950 text-white':'bg-white'} rounded w-full`}>
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center border-blue-700 border-b-2 p-3">
              <button type="button" className={`p-2 rounded-full transition-colors ${theme==='dark'?'hover:bg-red-500':'bg-slate-200 hover:bg-red-300'}`} onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Add New Table</p>
              <button className={` p-2 rounded-full  transition-colors ${theme==='dark'?'hover:bg-blue-500':'bg-slate-200 hover:bg-blue-300'}`} type='button' onClick={addTbl}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
            <form className="flex flex-col overflow-auto">
                    <div className="mb-3 p-1">
                          <label className='block' htmlFor='tableName'>Table Name</label>
                        <div className='flex gap-x-2'>
                          <input name='tblName' id='tableName' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={newTbl.name}  onChange={handleNameChange} type='text' required={true} maxLength={64} placeholder='Enter the table name'></input>
                          <button onClick={autoFill} type="button" className={`group relative ${theme==='dark'?'bg-purple-400 hover:bg-purple-500':'bg-purple-100 hover:bg-purple-200'} p-2 rounded-full   disabled:bg-slate-100 `} disabled={authInfo?false:true}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                            <Tooltip theme={theme} text={authInfo?'Use AI to generate fields':'Please Sign In to use AI related features'} position={'right'}></Tooltip>
                          </button>
                        </div>
                    </div>
                    <table className={`ms-1 text-center border ${theme==='dark'?'border-slate-700':''}`} cellPadding={15} cellSpacing={5}>
                      
                      <tbody>
                        <tr>
                          <th>Field name</th>
                          <th>Datatype</th>
                          <th>Attributes</th>
                          <th>Not Null</th>
                          <th>Unique</th>
                          <th>Primary Key</th>
                          <th>Foreign Key</th>
                          <th>Referenced Table</th>
                          <th>Referenced Field</th>
                          <th>Default</th>
                        </tr>
                        {newTbl.fields.map((element, index)=>{
                          return <tr key={`row${index}`}>
                          <td>
                            <input name='name' type='text' required={true} className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':' outline-blue-700'}`} value={newTbl.fields[index].name} data-rowindex={index} placeholder='Enter table name' onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='type' className={`border ${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':' outline-blue-700'} py-2 px-3`} value={element.type} data-rowindex={index} onChange={handleSelect}>
                              {dtypes.map((element, index)=>{
                                return <option key={index}>{element}</option>
                              })}
                            </select>
                          </td>
                          <td> {/* IMPORTANT */}
                            <input name='size' pattern={["DECIMAL","DEC","FLOAT","DOUBLE"].includes(element.type) ? "^[0-9]+,[0-9]+$" : ["SET","ENUM"].includes(element.type) ? "^'([^',]*)'(?:,'([^',]*)')*$":undefined } type={["DECIMAL","DEC","FLOAT","DOUBLE","SET","ENUM"].includes(element.type)? 'text':'number'} required={['VARCHAR','VARBINARY'].includes(element.type) ? true:false} min={["DECIMAL","DEC","FLOAT","DOUBLE"].includes(element.type)?undefined:0} disabled={['DATE','BOOL','BOOLEAN','TINYTEXT','TINYBLOB',"MEDIUMTEXT","MEDIUMBLOB","LONGTEXT","LONGBLOB","YEAR"].includes(element.type) ?true:false} className={`${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':'outline-blue-700'} border p-2 `} max={8000} value={newTbl.fields[index].size?newTbl.fields[index].size:''}  data-rowindex={index} placeholder={["DECIMAL","DEC","FLOAT","DOUBLE"].includes(element.type) ? 'Precision,Scale':['INT','INTEGER','BIGINT','SMALLINT','TINYINT','MEDIUMINT'].includes(element.type) ? 'Width':["SET","ENUM"].includes(element.type)?"'val1','val2',...":['DATETIME','TIME','TIMESTAMP'].includes(element.type) ? 'fsp':'Length'} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='notNull' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={newTbl.notNull} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='unique' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={newTbl.unique} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='pKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.name===newTbl.pKey?true:false} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='isFKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={newTbl.fields[index].isFKey} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='refTbl' className={`${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':' outline-blue-700'} border py-2 px-3`} value={element.refTbl} data-rowindex={index} onChange={handleSelect} disabled={!element.isFKey}>
                              <option value="NONE">NONE</option>
                              {tbls && tbls.map((element, index)=>{
                                return <option key={index}>{element.name}</option>
                              })}
                            </select>
                          </td>
                          <td>
                            <select name='refField' className={`refFieldInput ${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':'outline-blue-700'} border py-2 px-3 `} disabled={element.refTbl==='NONE'?true:false} value={element.refTbl==='NONE'?'NONE':element.refField} data-rowindex={index} onChange={handleSelect}>
                              <option value={'NONE'}>NONE</option>
                              {tbls && tbls.map((table)=>{
                                if(table.name === element.refTbl){
                                  return table.fields.map((field, index)=>{
                                    return <option key={index}>{field.name}</option>
                                  })
                                }
                              })}
                            </select>
                          </td>
                          <td> {/* IMPORTANT */}
                          {
                              ["BOOL","BOOLEAN"].includes(element.type) ? 
                                <select name='default' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={element.default} data-rowindex={index} onChange={handleSelect}>
                                  <option>NONE</option>
                                  <option>TRUE</option>
                                  <option>FALSE</option>
                                </select>
                                :
                                <input pattern={["CHAR","VARCHAR","TEXT","MEDIUMTEXT","LONGTEXT","TINYTEXT","DATETIME","TIMESTAMP"].includes(element.type) ? "[^']*" : element.type === 'SET' ? "^'([^',]*)(?:,([^',]*))*'$": element.type === 'ENUM' ? "^'([^',]+)'$":undefined} name='default' type={["CHAR","VARCHAR","TEXT","MEDIUMTEXT","LONGTEXT","TINYTEXT","DATETIME","TIMESTAMP","SET","ENUM"].includes(element.type)? 'text': ["DATE"].includes(element.type) ? 'date' : 'number'} className={`${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':'outline-blue-700'} border p-2`} value={element.default?element.default:''}  data-rowindex={index} placeholder={element.type === 'SET'? "'val1,val2,...'": element.type === 'ENUM' ? "'value'":'Enter a value'} onChange={handleChange}></input>
                            }  
                          </td>
                          <td>
                              <button type="button" className="rounded" data-rowindex={index} onClick={addField}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </button>
                          </td>
                          <td>
                              <button type="button" className="rounded" data-rowindex={index} onClick={delField}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </button>
                          </td>
                        </tr>
                        })}
                      </tbody>
                    </table>
                </form>
            </div>
        </div>
    </div>
  )
}

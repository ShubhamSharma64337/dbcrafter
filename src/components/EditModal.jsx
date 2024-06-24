import React, { useEffect, useState } from 'react'

export default function EditModal({theme, table, editShow, toggleEditModal, tbls, showAlert, updateTbl, dtypes}) {
  const [maxIndex, setMaxIndex] = useState(0); //this keeps track about what name should be given to the new row being added in the modal
  const [updatedTbl, setUpdatedTbl] = useState({...table}) //this actually stores all the details about the form in the modal which is used
  //to update the table

  function handleNameChange(e){ //table name change handler
    setUpdatedTbl({...updatedTbl, name: e.target.value});
  }

  useEffect(()=>{ //when user changes the selected table, the modal contents will be updated to that table's values
    setUpdatedTbl(table)
  }, [table])

  function addField(e){
    let tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{
      return {...element}
    })}
    const insertIndex = parseInt(e.currentTarget.dataset.rowindex) + 1;
    tableCopy.fields.splice(insertIndex,0, {name: 'field'+(maxIndex+1), type: 'INT', notNull: false, unique: false, isFKey: false, refTbl: 'NONE', refField: 'NONE', default: null})
    setUpdatedTbl(tableCopy);
    setMaxIndex(maxIndex+1);
  }

  function delField(e){
    let tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{
      return {...element}
    })}
    if(tableCopy.fields.length<2){ //this makes sure that user does not delete all the rows in the table
      showAlert("Table must have at least one row!","danger");
      return;
    }
    if(tableCopy.fields[parseInt(e.currentTarget.dataset.rowindex)].name === tableCopy.pKey){ //this resets the primary key to null if field which is currently set to primary key is deleted
      tableCopy.pKey = null;
    }
    tableCopy.fields.splice(parseInt(e.currentTarget.dataset.rowindex),1)
    setUpdatedTbl(tableCopy);
  }

  function handleChange(e){
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    const rowindex = parseInt(e.currentTarget.dataset.rowindex);
    let tableCopy = {}
    if(e.currentTarget.name==='isFKey'){ //to handle change in fkey checkbox
      let checked = e.currentTarget.checked;
      tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{
        if(index === rowindex){
          if(checked === false){
            return {...element, [name]:checked, refTbl: 'NONE', refField: 'NONE'}
          }
          return {...element, [name]: checked};
        } else {
          return {...element};
        }
      })}
    } else if (name === 'notNull' || name === 'unique'){ //handle change in notNull checkbox
        let checked = e.currentTarget.checked;
        tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{
          if(index === rowindex){
              return {...element, [name]:checked};
          }
          else {
            return {...element };
          }
        })
      } 
    } else if (name === 'pKey'){ //handle change in pkey checkbox
      let currentField = updatedTbl.fields[parseInt(e.currentTarget.dataset.rowindex)];
      let checked = e.currentTarget.checked;
      if(checked === true){
        tableCopy = {...updatedTbl, pKey: currentField.name}
      } else {
        tableCopy = {...updatedTbl, pKey: null}
      }
    } else {  //handle change in field name or type or any other text input
      tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{
        if(index === rowindex){
          return {...element, [name]: value};
        } else {
          return {...element};
        }
      })}
    }
    setUpdatedTbl(tableCopy);
  }

  function handleSelect(e){ //this function handles change in selection of all the select lists
    const name = e.currentTarget.name; //retrieving the name value of the select list, this will be same as the key in the updatedTbl dictionary
    const value = e.currentTarget.value; //retrieving the value of the select field
    const rowindex = parseInt(e.currentTarget.dataset.rowindex); //retrieving the field index using the data attribute of the select input

    let tableCopy = {...updatedTbl, fields: updatedTbl.fields.map((element, index)=>{ //now starting actually modifying the select field
        if(index === rowindex){
          if(name === 'type'){ //This condition makes sure that the Default value is set to null if datatype is changed, this is necessary because 
            //certain values cannot be typecasted to another type e.g. an integer or string cannot be typecasted to a DATE type value
            return {...element, [name]: value, size: null, default: null}; //Here we set size to null because if datatype is set to one which does not support size, we need to update it
          } else if (name === 'default'){
            return {...element, [name]: value};
          } 
          else {
            return {...element, [name]: value, size: null}; //Here we set size to null because if datatype is set to one which does not support size, we need to update it
          }
        } else {
          return {...element};
        }
      
    })}
    setUpdatedTbl(tableCopy);
  }

  function closeEditModal(){
    setUpdatedTbl(table); //this must be done to discard changes made by the user in the edit modal before closing it
    setMaxIndex(0);
    toggleEditModal(0);
  }

  function editTable(){
    if(!document.querySelector('form').checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
      document.querySelector('form').reportValidity();
      return;
    }
    for(let field of updatedTbl.fields){
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
    if(/^\s*$/.test(updatedTbl.name)){
      showAlert("Table name cannot be empty!","danger");
      return;
    }
    updateTbl(updatedTbl);
    toggleEditModal();
  }
  return (
    //here we are also checking the table value, because, if somehow, an out of bounds index was present in selectedTbl, then the table argument
    //passed to edit modal will be null, so in that case, we need to make sure we avoid displaying the modal.
    //we can make sure this never happens by makiing the other code work in such a way, that whenever the diagram is updated, it makes sure
    //that selectedTbl does not go out of bounds, or is reset to null
    editShow && table && <div className="overlay overflow-auto fixed justify-center md:justify-center  flex items-start p-5 top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className={`modal ${theme==='dark'?'bg-gray-950 text-white':'bg-white'} rounded w-full`}>
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center border-blue-700 border-b-2 p-3">
              <button type="button" className={`p-2 rounded-full transition-colors ${theme==='dark'?'hover:bg-red-500':'bg-slate-200 hover:bg-red-300'}`} onClick={closeEditModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Modify Table</p>
            <button className={`p-2 rounded-full  transition-colors ${theme==='dark'?'hover:bg-blue-500':'bg-slate-200 hover:bg-red-300'}`} type='button' onClick={editTable}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
            </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
            <form className="flex flex-col overflow-auto">
                    <div className="formItem mb-3 p-1">
                        <label className='block' htmlFor='tableName'>Table Name</label>
                        <input type='text' required={true} maxLength={64} name='tblName' id='tableName' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={updatedTbl.name} onChange={handleNameChange} placeholder='Enter the table name'></input>
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
                        {updatedTbl.fields.map((element, index)=>{
                          return <tr key={`row${index}`}>
                          <td>
                            <input name='name' type='text' required={true} className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={element.name} data-rowindex={index} placeholder='Enter table name' onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='type' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={element.type} data-rowindex={index} onChange={handleSelect}>
                              {dtypes.map((element, index)=>{
                                return <option key={index}>{element}</option>
                              })}
                            </select>
                          </td>
                          <td>
                            <input name='size' type={["DECIMAL","DEC","FLOAT","DOUBLE","SET"].includes(element.type)? 'text':'number'} pattern={["DECIMAL","DEC","FLOAT","DOUBLE"].includes(element.type) ? "^[0-9]+,[0-9]+$" : ["SET"].includes(element.type) ? "^'([^',]*)'(?:,'([^',]*)')*$" : undefined } required={['VARCHAR','VARBINARY'].includes(element.type) ? true:false} min={0} disabled={['DATE','BOOL','BOOLEAN','TINYTEXT','TINYBLOB',"MEDIUMTEXT","MEDIUMBLOB","LONGTEXT","LONGBLOB","YEAR"].includes(element.type) ?true:false} className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} max={8000} value={updatedTbl.fields[index].size?updatedTbl.fields[index].size:''}  data-rowindex={index} placeholder={["DECIMAL","DEC","FLOAT","DOUBLE"].includes(element.type) ? 'Precision,Scale': ['INT','INTEGER','BIGINT','TINYINT','SMALLINT','MEDIUMINT'].includes(element.type) ? 'Width': ["SET"].includes(element.type)?"'val1','val2',...": ['DATETIME','TIME','TIMESTAMP'].includes(element.type) ? 'fsp':'Length'} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='notNull' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.notNull} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='unique' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.unique} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='pKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.name===updatedTbl.pKey?true:false} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='isFKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.isFKey} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='refTbl' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={element.refTbl} data-rowindex={index} onChange={handleSelect} disabled={!element.isFKey}>
                              <option value="NONE">NONE</option>
                              {tbls && tbls.map((currentTbl, index)=>{
                                if(currentTbl.name === table.name){ //this makes sure we cannot reference a table to itself
                                  return;
                                }
                                return <option key={index}>{currentTbl.name}</option>
                              })}
                            </select>
                          </td>
                          <td>
                            <select name='refField' className={`refFieldInput border py-2 px-3 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'}`} disabled={element.refTbl==='NONE'?true:false} value={element.refTbl==='NONE'?'NONE':element.refField} data-rowindex={index} onChange={handleSelect}>
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
                          <td>
                          {
                              ["BOOL","BOOLEAN"].includes(element.type) ? 
                                <select name='default' className={`border p-2 ${theme==='dark'?'bg-gray-900 focus:outline-none border-slate-700 focus:border-blue-500':'outline-blue-500'} `} value={element.default} data-rowindex={index} onChange={handleSelect}>
                                  <option>NONE</option>
                                  <option>TRUE</option>
                                  <option>FALSE</option>
                                </select>
                                :
                                <input pattern={element.type === 'SET' ? "^'([^',]*)(?:,([^',]*))*'$":undefined} name='default' type={["CHAR","VARCHAR","TEXT","MEDIUMTEXT","LONGTEXT","TINYTEXT","DATETIME","TIMESTAMP","SET"].includes(element.type)? 'text': ["DATE"].includes(element.type) ? 'date' : 'number'} className={`${theme==='dark'?'bg-gray-900 focus:outline-none focus:border-blue-500 border-slate-700':'outline-blue-700'} border p-2`} value={element.default?element.default:''}  data-rowindex={index} placeholder={element.type === 'SET'? "'val1,val2,...'":'Enter a value'} onChange={handleChange}></input>
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

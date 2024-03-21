import React, { useState } from 'react'


export default function CreateTableModal({show, toggleCreateModal, addTable, tbls, showAlert, dtypes}) {
  const [maxIndex, setMaxIndex] = useState(0);
  const [newTbl, setNewTbl] = useState({name: 'table', pKey: 'id', fields: [
    {name: 'id', type: 'INT', notNull: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'}
  ]})

  function handleNameChange(e){ //table name change handler
    setNewTbl({...newTbl, name: e.target.value});
  }

  function addField(e){
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
    const insertIndex = parseInt(e.currentTarget.dataset.rowindex) + 1;
    tableCopy.fields.splice(insertIndex,0, {name: 'field'+(maxIndex+1), type: 'INT', notNull: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'})
    setNewTbl(tableCopy);
    setMaxIndex(maxIndex+1);
  }

  function delField(e){
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
    if(tableCopy.fields.length<2){
      showAlert("Table must have at least one row!","danger");
      return;
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
    } else if (name === 'notNull'){
      let checked = e.currentTarget.checked;
      tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
        if(index === rowindex){
          return {...element, [name]: checked};
        } else {
          return {...element};
        }
      })}
    } else if (name === 'pKey'){ //handle change in pkey checkbox
      let currentField = newTbl.fields[parseInt(e.currentTarget.dataset.rowindex)];
      tableCopy = {...newTbl, pKey: currentField.name}
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
          return {...element, [name]: value};
        } else {
          return {...element};
        }
      
    })}
    setNewTbl(tableCopy);
  }

  function addTbl(){
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
    setNewTbl({name: 'table', pKey: 'id', fields: [{name: 'id', type: 'INT', notNull: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'}]})
    setMaxIndex(0)
  }

  function closeModal(){
    setNewTbl({name: 'table', pKey: 'id', fields: [{name: 'id', type: 'INT', notNull: false, isFKey: false, refTbl: 'NONE', refField: 'NONE'}]})
    setMaxIndex(0)
    toggleCreateModal(0)
  }


  return (
    show && <div className="overlay overflow-auto fixed justify-start md:justify-center  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className="modal bg-white rounded">
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center border-blue-700 border-b-2 p-3">
              <button type="button" className="p-2 rounded-full transition-colors bg-slate-200 hover:bg-red-300" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Add New Table</p>
              <button className="bg-slate-200 p-2 rounded-full  transition-colors hover:bg-blue-300" type='button' onClick={addTbl}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>

            {/* Modal Body */}
            <div className="modal-body p-5">
            <form className="flex flex-col overflow-auto">
                    <div className="formItem mb-3">
                        <label className='block' htmlFor='tableName'>Table Name</label>
                        <input name='tblName' id='tableName' className="border p-2 outline-blue-700" value={newTbl.name} onChange={handleNameChange} type='text' placeholder='Enter the table name'></input>
                    </div>
                    <table className='text-center border' cellPadding={15} cellSpacing={5}>
                      
                      <tbody>
                        <tr>
                          <th>Field name</th>
                          <th>Datatype</th>
                          <th>Not Null</th>
                          <th>Primary Key</th>
                          <th>Foreign Key</th>
                          <th>Referenced Table</th>
                          <th>Referenced Field</th>
                        </tr>
                        {newTbl.fields.map((element, index)=>{
                          return <tr key={`row${index}`}>
                          <td>
                            <input name='name' type='text' className='border p-2 outline-blue-700' value={newTbl.fields[index].name} data-rowindex={index} placeholder='Enter table name' onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='type' className='border py-2 px-3 outline-blue-700' value={element.type} data-rowindex={index} onChange={handleSelect}>
                              {dtypes.map((element)=>{
                                return <option>{element}</option>
                              })}
                            </select>
                          </td>
                          <td>
                            <input name='notNull' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={newTbl.notNull} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='pKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={element.name===newTbl.pKey?true:false} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='isFKey' type='checkbox' className='border p-2 w-5 h-5 accent-blue-700' checked={newTbl.fields[index].isFKey} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='refTbl' className={`border py-2 px-3 outline-blue-700`} value={element.refTbl} data-rowindex={index} onChange={handleSelect} disabled={!element.isFKey}>
                              <option value="NONE">NONE</option>
                              {tbls && tbls.map((element, index)=>{
                                return <option key={index}>{element.name}</option>
                              })}
                            </select>
                          </td>
                          <td>
                            <select name='refField' className='refFieldInput border py-2 px-3 outline-blue-700' disabled={element.refTbl==='NONE'?true:false} value={element.refTbl==='NONE'?'NONE':element.refField} data-rowindex={index} onChange={handleSelect}>
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

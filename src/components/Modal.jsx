import { func } from 'prop-types'
import React, { useState } from 'react'


export default function Modal({show, toggleModal}) {
  const [maxIndex, setMaxIndex] = useState(0);
  const [newTbl, setNewTbl] = useState({name: 'table', fields: [
    {name: 'field0', type: '', isFKey: null, refTbl: '', refField: ''}
  ]})

  function handleNameChange(e){ //table name change handler
    setNewTbl({...newTbl, name: e.target.value});
  }

  function addField(e){
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
    const insertIndex = parseInt(e.currentTarget.dataset.rowindex) + 1;
    tableCopy.fields.splice(insertIndex,0, {name: 'field'+(maxIndex+1), type: '', isFKey: null, refTbl: '', refField: ''})
    setNewTbl(tableCopy);
    setMaxIndex(maxIndex+1);
  }

  function delField(e){
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      return {...element}
    })}
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

  function handleSelect(e){
    const name = e.target.name;
    const value = e.target.value;
    const rowindex = parseInt(e.currentTarget.dataset.rowindex);
    let tableCopy = {...newTbl, fields: newTbl.fields.map((element, index)=>{
      if(index === rowindex){
        return {...element, [name]: value};
      } else {
        return {...element};
      }
    })}
    setNewTbl(tableCopy);
  }

  function handleCheck(e){

  }


  return (
    show && <div className="overlay fixed justify-center flex items-center top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className="modal-body bg-white p-5 rounded h-4/5 overflow-y-auto">
                <form className="flex flex-col">
                    <div className="formItem mb-3">
                        <label className='block' htmlFor='tableName'>Table Name</label>
                        <input name='tblName' id='tableName' className="border p-2" value={newTbl.name} onChange={handleNameChange} type='text' placeholder='Enter the table name'></input>
                    </div>
                    <table className='text-center border' cellPadding={15} cellSpacing={5}>
                      
                      <tbody>
                        <tr>
                          <th>Field name</th>
                          <th>Datatype</th>
                          <th>Primary Key</th>
                          <th>Foreign Key</th>
                          <th>Referenced Table</th>
                          <th>Referenced Field</th>
                        </tr>
                        {newTbl.fields.map((element, index)=>{
                          return <tr key={`row${index}`}>
                          <td>
                            <input name='name' type='text' className='border p-2' value={newTbl.fields[index].name} data-rowindex={index} placeholder='Enter table name' onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='type' className='border py-2 px-3' value={element.type} data-rowindex={index} onChange={handleSelect}>
                              <option>INT</option>
                              <option>CHAR</option>
                              <option>VARCHAR</option>
                              <option>BOOL</option>
                              <option>FLOAT</option>
                              <option>DATE</option>
                            </select>
                          </td>
                          <td>
                            <input name='pKey' type='checkbox' className='border p-2 w-5 h-5' checked={element.name===newTbl.pKey?true:false} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <input name='isFKey' type='checkbox' className='border p-2 w-5 h-5' checked={newTbl.fields[index].isFKey} data-rowindex={index} onChange={handleChange}></input>
                          </td>
                          <td>
                            <select name='refTbl' className='border py-2 px-3' value={element.refTbl} data-rowindex={index} onChange={handleSelect}>
                              <option>table1</option>
                              <option>table2</option>
                              <option>table3</option>
                            </select>
                          </td>
                          <td>
                            <select name='refField' className='border py-2 px-3' value={element.refField} data-rowindex={index} onChange={handleSelect}>
                              <option>field1</option>
                              <option>field2</option>
                              <option>field3</option>
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
                    <div className="formItem mt-3 flex justify-between">
                        <button type="button" className="bg-red-700 p-2 rounded text-white" onClick={toggleModal}>Cancel</button>
                        <button className="bg-blue-700 p-2 rounded text-white" type='submit'>Add Table</button>
                    </div>
                </form>
        </div>
    </div>
  )
}

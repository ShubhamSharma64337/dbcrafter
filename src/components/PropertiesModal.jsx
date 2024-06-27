import React, { useEffect, useState } from 'react'

export default function PropertiesModal({theme, visible,toggleModal,tbls}) {
  const [relationships, setRelationships] = useState(0);
  useEffect(()=>{
    let relcount = 0;
    if(!tbls){
        return;
    }
    for(let tbl of tbls){
        for(let field of tbl.fields){
            if(field.isFKey){
                relcount++;
            }
        }
    }
    setRelationships(relcount);
  },[tbls])
  return (
    visible && <div className={`overlay flex justify-center items-center w-screen h-screen absolute top-0 bg-black bg-opacity-50`}>
        <div className={`modal w-2/5 text-lg ${theme === 'dark'? 'bg-gray-900':'bg-white'} p-2 rounded-md shadow-lg`}>
            <div className="modal-header border-b px-1 py-2 flex justify-between">
                <div>
                Statistics
                </div>
                  <button onClick={toggleModal}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                      </svg>

                  </button>
            </div>
            <div className="modal-body px-1 py-2">
                <ul>
                    <li className='flex justify-between'><span>Tables</span> <span>{tbls?tbls.length:'0'}</span></li>
                    <li className='flex justify-between'><span>Foreign Keys</span> <span>{relationships}</span></li>
                    
                </ul>
            </div>
        </div>

    </div>
  )
}

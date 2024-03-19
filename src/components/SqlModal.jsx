import { useState, React, useEffect } from 'react'
export default function SqlModal({diagram, show,  toggleModal}) {
  const [sql, setSql] = useState(null); 
  useEffect(()=>{
    let newSql = [];
    if(!diagram.tbls){
      setSql(null)
      return;
    }
    for(let table of diagram.tbls){
      let stmt = "CREATE TABLE " + table.name + "(\n";
      table.fields.map((field, index)=>{ //this creates each field's portion in the statement
        stmt = stmt + "\t" + field.name + " " + field.type;
        if(table.pKey === field.name){
          stmt += " PRIMARY KEY";
        } else {
          if(field.notNull){
            stmt += " NOT NULL"
          }
          if(field.isFKey){
            stmt += " REFERENCES " + field.refTbl +"(" + field.refField + ")";
          }
        }
        if(index !== table.fields.length - 1){ //this removes comma in case of last field
          stmt = stmt + ", \n";
        }
      })
      stmt = stmt + "\n);";
      newSql.push(stmt);
    }
    setSql(newSql);
  }, [diagram])
  return (
    show && <div className="overlay overflow-auto fixed justify-start md:justify-center  flex items-start pt-5 top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className="modal bg-white rounded w-full md:w-4/5">
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center border-blue-700 border-b-2 p-3">
              <button type="button" className="p-2 rounded-full transition-colors bg-slate-200 hover:bg-red-300" onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p className='text-center text-lg font-medium '>Auto-Generated SQL</p>


            </div>

            {/* Modal Body */}
            <div className="modal-body p-5 text-lg">
                {sql?sql.map((stmt, index)=>{return <pre key={index}>{stmt} <br></br><br></br></pre>}):'No SQL Generated'}
            </div>
        </div>
    </div>
  )
}

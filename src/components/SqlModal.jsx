import { useState, React, useEffect } from 'react'
export default function SqlModal({theme, diagram, show,  toggleModal}) {
  const [sql, setSql] = useState(null); 
  useEffect(()=>{
    let newSql = [];

    if(!diagram.tbls){
      setSql(null)
      return;
    }

    newSql.push("CREATE DATABASE " + diagram.name + ";\n\nUSE " + diagram.name + ";\n");

    for(let table of diagram.tbls){ //this is the first iteration in which we will not consider the Foreign Key constraints

      let stmt = "CREATE TABLE " + table.name + "(\n";
      table.fields.map((field, index)=>{ //this creates each field's portion in the statement
        stmt = stmt + "\t" + field.name + " " + field.type;
        if(field.size){
          if(['INT','INTEGER','BIGINT','SMALLINT','TINYINT','MEDIUMINT'].includes(field.type)){
            stmt = stmt + "(" + field.size + ") ZEROFILL" //This is necessary, because without ZEROFILL, the Display Width has no effect
          } else {
            stmt = stmt + "(" + field.size + ")"
          }
          
        }
        if(field.notNull){
          stmt += " NOT NULL"
        }
        if(field.unique){
          stmt += " UNIQUE"
        }
        if(table.pKey === field.name){
          stmt += " PRIMARY KEY";
        }
        if(index !== table.fields.length - 1){ //this removes comma in case of last field
          stmt = stmt + ", \n";
        }
      })
      stmt = stmt + "\n);";
      newSql.push(stmt);
    }

    for(let table of diagram.tbls){ //this is the second iteration in which we will create the Foreign Key Constraints
      
      let stmt = null;
      table.fields.map((field, index)=>{ //this creates each field's portion in the statement
        if(field.isFKey){
          stmt = "ALTER TABLE " + table.name + "\n" + "ADD FOREIGN KEY (" + field.name + ") REFERENCES " + field.refTbl + "(" + field.refField + ");";
            newSql.push(stmt);
          }
      })
    }
    
    setSql(newSql);
  }, [diagram])

  function downloader(){ //this function actually programmatically inserts an anchor tag into dom, with href set to data: url containing the sql,
    //and sets its download attribute to a filename, triggers the click event on it, and then removes the element
    var wholeSql = '';
    for(let stmt of sql){
      wholeSql = wholeSql + stmt + '\n';
    }

    var element = document.createElement('a');
    document.body.appendChild(element);
    element.setAttribute('download', diagram.name?diagram.name+'.sql':'unnamed.sql');
    element.setAttribute('href','data:text/plain;charset=utf-8, '+ encodeURIComponent(wholeSql));
    element.classList.add('hidden');
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
  }
  return (
    show && <div className="overlay overflow-auto fixed justify-center md:justify-center flex items-start p-5 top-0 w-screen h-screen bg-black bg-opacity-35" id="addTblModal" data-modal-id="addTblModal">
        <div className={`modal ${theme==='dark'?'bg-gray-950 text-white':'bg-white'} rounded w-full`}>
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center border-blue-700 border-b-2 p-3">
              <button type="button" className={`p-2 rounded-full transition-colors  ${theme==='dark'?'hover:bg-red-500':'bg-slate-200 hover:bg-red-300'}`} onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
                <p className='text-center text-lg font-medium '>Auto-Generated SQL</p>
              <div className='flex items-center gap-x-4'>
                <button onClick={downloader} className={`p-2 rounded-full  ${theme==='dark'?'hover:bg-green-500':'bg-slate-200 hover:bg-green-300'} transition ${sql===null?'hidden':''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-5 text-lg overflow-x-auto">
                {sql?sql.map((stmt, index)=>{return <pre key={index}>{stmt} <br></br><br></br></pre>}):'No SQL Generated'}
            </div>
        </div>
    </div>
  )
}

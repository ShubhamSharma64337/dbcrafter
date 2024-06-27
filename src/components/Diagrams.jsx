import React, { useEffect } from 'react'
import {useState} from 'react'
import {  useNavigate } from "react-router-dom";
import TemplateModal from './TemplateModal';
import PageNumber from './PageNumber';
import TopBar from './TopBar';
import Tooltip from './Tooltip.jsx'

export default function Diagrams({showAlert, setDiagram, setIsLoading, urls, theme}) {
    const navigate = useNavigate();
    const reservedKeywordsMysql = ["ACCESSIBLE","ACCOUNT","ACTION","ADD","AFTER","AGAINST","AGGREGATE","ALGORITHM","ALL","ALTER","ALWAYS","ANALYZE","AND","ANY","AS","ASC","ASCII","ASENSITIVE","AT","AUTOEXTEND_SIZE","AUTO_INCREMENT","AVG","AVG_ROW_LENGTH","BACKUP","BEFORE","BEGIN","BETWEEN","BIGINT","BINARY","BINLOG","BIT","BLOB","BLOCK","BOOL","BOOLEAN","BOTH","BTREE","BY","BYTE","CACHE","CALL","CASCADE","CASCADED","CASE","CATALOG_NAME","CHAIN","CHANGE","CHANGED","CHANNEL","CHAR","CHARACTER","CHARSET","CHECK","CHECKSUM","CIPHER","CLASS_ORIGIN","CLIENT","CLONE","CLOSE","COALESCE","CODE","COLLATE","COLLATION","COLUMN","COLUMNS","COLUMN_FORMAT","COLUMN_NAME","COMMENT","COMMIT","COMMITTED","COMPACT","COMPLETION","COMPRESSED","COMPRESSION","CONCURRENT","CONDITION","CONNECTION","CONSISTENT","CONSTRAINT","CONSTRAINT_CATALOG","CONSTRAINT_NAME","CONSTRAINT_SCHEMA","CONTAINS","CONTEXT","CONTINUE","CONVERT","CPU","CREATE","CROSS","CUBE","CUME_DIST","CURRENT","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","CURRENT_USER","CURSOR","CURSOR_NAME","DATA","DATABASE","DATABASES","DATAFILE","DATE","DATETIME","DAY","DAY_HOUR","DAY_MICROSECOND","DAY_MINUTE","DAY_SECOND","DEALLOCATE","DEC","DECIMAL","DECLARE","DEFAULT","DEFAULT_AUTH","DEFINER","DELAYED","DELAY_KEY_WRITE","DELETE","DENSE_RANK","DESC","DESCRIBE","DESCRIPTION","DES_KEY_FILE","DETERMINISTIC","DIAGNOSTICS","DIRECTORY","DISABLE","DISCARD","DISK","DISTINCT","DISTINCTROW","DIV","DO","DOUBLE","DROP","DUAL","DUMPFILE","DUPLICATE","DYNAMIC","EACH","ELSE","ELSEIF","ENABLE","ENCLOSED","ENCRYPTION","END","ENDS","ENGINE","ENGINES","ENGINE_ATTRIBUTE","ENUM","ERROR","ERRORS","ESCAPE","ESCAPED","EVENT","EVENTS","EVERY","EXCEPT","EXCHANGE","EXCLUDE","EXECUTE","EXISTS","EXIT","EXPANSION","EXPIRE","EXPLAIN","EXPORT","EXTENDED","EXTENT_SIZE","FACTOR","FAILED_LOGIN_ATTEMPTS","FALSE","FAST","FAULTS","FETCH","FIELDS","FILE","FILE_BLOCK_SIZE","FILTER","FIRST","FIRST_VALUE","FIXED","FLOAT","FLOAT4","FLOAT8","FLUSH","FOLLOWING","FOLLOWS","FOR","FORCE","FOREIGN","FORMAT","FOUND","FROM","FULL","FULLTEXT","FUNCTION","GENERAL","GENERATED","GEOMCOLLECTION","GEOMETRY","GEOMETRYCOLLECTION","GET","GET_FORMAT","GET_MASTER_PUBLIC_KEY","GET_SOURCE_PUBLIC_KEY","GLOBAL","GRANT","GRANTS","GROUP","GROUPING","GROUPS","GROUP_REPLICATION","HANDLER","HASH","HAVING","HELP","HIGH_PRIORITY","HISTOGRAM","HISTORY","HOST","HOSTS","HOUR","HOUR_MICROSECOND","HOUR_MINUTE","HOUR_SECOND","IDENTIFIED","IF","IGNORE","IGNORE_SERVER_IDS","IMPORT","IN","INACTIVE","INDEX","INDEXES","INFILE","INITIAL_SIZE","INNER","INOUT","INSENSITIVE","INSERT","INSERT_METHOD","INSTALL","INSTANCE","INT","INT1","INT2","INT3","INT4","INT8","INTEGER","INTERVAL","INTO","INVISIBLE","INVOKER","IO","IO_AFTER_GTIDS","IO_BEFORE_GTIDS","IO_THREAD","IPC","IS","ISOLATION","ISSUER","ITERATE","JOIN","JSON","JSON_TABLE","JSON_VALUE","KEY","KEYRING","KEYS","KEY_BLOCK_SIZE","KILL","LAG","LANGUAGE","LAST","LAST_VALUE","LATERAL","LEAD","LEADING","LEAVE","LEAVES","LEFT","LESS","LEVEL","LIKE","LIMIT","LINEAR","LINES","LINESTRING","LIST","LOAD","LOCAL","LOCALTIME","LOCALTIMESTAMP","LOCK","LOCKED","LOCKS","LOGFILE","LOGS","LONG","LONGBLOB","LONGTEXT","LOOP","LOW_PRIORITY","MASTER","MASTER_AUTO_POSITION","MASTER_BIND","MASTER_COMPRESSION_ALGORITHMS","MASTER_CONNECT_RETRY","MASTER_DELAY","MASTER_HEARTBEAT_PERIOD","MASTER_HOST","MASTER_LOG_FILE","MASTER_LOG_POS","MASTER_PASSWORD","MASTER_PORT","MASTER_PUBLIC_KEY_PATH","MASTER_RETRY_COUNT","MASTER_SERVER_ID","MASTER_SSL","MASTER_SSL_CA","MASTER_SSL_CAPATH","MASTER_SSL_CERT","MASTER_SSL_CIPHER","MASTER_SSL_CRL","MASTER_SSL_CRLPATH","MASTER_SSL_KEY","MASTER_SSL_VERIFY_SERVER_CERT","MASTER_TLS_CIPHERSUITES","MASTER_TLS_VERSION","MASTER_USER","MATCH","MAXVALUE","MAX_CONNECTIONS_PER_HOUR","MAX_QUERIES_PER_HOUR","MAX_ROWS","MAX_SIZE","MAX_UPDATES_PER_HOUR","MAX_USER_CONNECTIONS","MEDIUM","MEDIUMBLOB","MEDIUMINT","MEDIUMTEXT","MEMORY","MERGE","MESSAGE_TEXT","MICROSECOND","MIDDLEINT","MIGRATE","MINUTE","MINUTE_MICROSECOND","MINUTE_SECOND","MIN_ROWS","MOD","MODE","MODIFIES","MODIFY","MONTH","MULTILINESTRING","MULTIPOINT","MULTIPOLYGON","MUTEX","MYSQL","MYSQL_ERRNO","NAME","NAMES","NATIONAL","NATURAL","NCHAR","NDB","NDBCLUSTER","NESTED","NETWORK_NAMESPACE","NEVER","NEW","NEXT","NO","NODEGROUP","NONE","NOT","NOWAIT","NO_WAIT","NO_WRITE_TO_BINLOG","NTH_VALUE","NTILE","NULL","NULLS","NUMBER","NUMERIC","NVARCHAR","OF","OFF","OFFSET","OIL","OLD","ON","ONE","ONLY","OPEN","OPTIMIZE","OPTIMIZER_COSTS","OPTION","OPTIONAL","OPTIONALLY","OPTIONS","OR","ORDER","ORDINALITY","ORGANIZATION","OTHERS","OUT","OUTER","OUTFILE","OVER","OWNER","PACK_KEYS","PAGE","PARSER","PARSE_GCOL_EXPR","PARTIAL","PARTITION","PARTITIONING","PARTITIONS","PASSWORD","PATH","PERCENT_RANK","PERSIST","PERSIST_ONLY","PHASE","PLUGIN","PLUGINS","PLUGIN_DIR","POINT","POLYGON","PORT","PRECEDES","PRECEDING","PRECISION","PREPARE","PRESERVE","PREV","PRIMARY","PRIVILEGES","PRIVILEGE_CHECKS_USER","PROCEDURE","PROCESS","PROCESSLIST","PROFILE","PROFILES","PROXY","PURGE","QUARTER","QUERY","QUICK","RANDOM","RANGE","RANK","READ","READS","READ_ONLY","READ_WRITE","REAL","REBUILD","RECOVER","RECURSIVE","REDOFILE","REDO_BUFFER_SIZE","REDUNDANT","REFERENCE","REFERENCES","REGEXP","REGISTRATION","RELAY","RELAYLOG","RELAY_LOG_FILE","RELAY_LOG_POS","RELAY_THREAD","RELEASE","RELOAD","REMOTE","REMOVE","RENAME","REORGANIZE","REPAIR","REPEAT","REPEATABLE","REPLACE","REPLICA","REPLICAS","REPLICATE_DO_DB","REPLICATE_DO_TABLE","REPLICATE_IGNORE_DB","REPLICATE_IGNORE_TABLE","REPLICATE_REWRITE_DB","REPLICATE_WILD_DO_TABLE","REPLICATE_WILD_IGNORE_TABLE","REPLICATION","REQUIRE","REQUIRE_ROW_FORMAT","RESET","RESIGNAL","RESOURCE","RESPECT","RESTART","RESTORE","RESTRICT","RESUME","RETAIN","RETURN","RETURNED_SQLSTATE","RETURNING","RETURNS","REUSE","REVERSE","REVOKE","RIGHT","RLIKE","ROLE","ROLLBACK","ROLLUP","ROUTINE","ROW","ROWS","ROW_COUNT","ROW_FORMAT","ROW_NUMBER","RTREE","SAVEPOINT","SCHEDULE","SCHEMA","SCHEMAS","SCHEMA_NAME","SECOND","SECONDARY","SECONDARY_ENGINE","SECONDARY_ENGINE_ATTRIBUTE","SECONDARY_LOAD","SECONDARY_UNLOAD","SECOND_MICROSECOND","SECURITY","SELECT","SENSITIVE","SEPARATOR","SERIAL","SERIALIZABLE","SERVER","SESSION","SET","SHARE","SHOW","SHUTDOWN","SIGNAL","SIGNED","SIMPLE","SKIP","SLAVE","SLOW","SMALLINT","SNAPSHOT","SOCKET","SOME","SONAME","SOUNDS","SOURCE","SOURCE_AUTO_POSITION","SOURCE_BIND","SOURCE_COMPRESSION_ALGORITHMS","SOURCE_CONNECT_RETRY","SOURCE_DELAY","SOURCE_HEARTBEAT_PERIOD","SOURCE_HOST","SOURCE_LOG_FILE","SOURCE_LOG_POS","SOURCE_PASSWORD","SOURCE_PORT","SOURCE_PUBLIC_KEY_PATH","SOURCE_RETRY_COUNT","SOURCE_SSL","SOURCE_SSL_CA","SOURCE_SSL_CAPATH","SOURCE_SSL_CERT","SOURCE_SSL_CIPHER","SOURCE_SSL_CRL","SOURCE_SSL_CRLPATH","SOURCE_SSL_KEY","SOURCE_SSL_VERIFY_SERVER_CERT","SOURCE_TLS_CIPHERSUITES","SOURCE_TLS_VERSION","SOURCE_USER","SPACE","SPATIAL","SPECIFIC","SQL","SQLEXCEPTION","SQLSTATE","SQLWARNING","SQL_AFTER_GTIDS","SQL_AFTER_MTS_GAPS","SQL_BEFORE_GTIDS","SQL_BIG_RESULT","SQL_BUFFER_RESULT","SQL_CACHE","SQL_CALC_FOUND_ROWS","SQL_NO_CACHE","SQL_SMALL_RESULT","SQL_THREAD","SQL_TSI_DAY","SQL_TSI_HOUR","SQL_TSI_MINUTE","SQL_TSI_MONTH","SQL_TSI_QUARTER","SQL_TSI_SECOND","SQL_TSI_WEEK","SQL_TSI_YEAR","SRID","SSL","STACKED","START","STARTING","STARTS","STATS_AUTO_RECALC","STATS_PERSISTENT","STATS_SAMPLE_PAGES","STATUS","STOP","STORAGE","STORED","STRAIGHT_JOIN","STREAM","STRING","SUBCLASS_ORIGIN","SUBJECT","SUBPARTITION","SUBPARTITIONS","SUPER","SUSPEND","SWAPS","SWITCHES","SYSTEM","TABLE","TABLES","TABLESPACE","TABLE_CHECKSUM","TABLE_NAME","TEMPORARY","TEMPTABLE","TERMINATED","TEXT","THAN","THEN","THREAD_PRIORITY","TIES","TIME","TIMESTAMP","TIMESTAMPADD","TIMESTAMPDIFF","TINYBLOB","TINYINT","TINYTEXT","TO","TRAILING","TRANSACTION","TRANSACTIONAL","TRANSACTIONALLY","TRANSFORM","TRIGGER","TRIGGERS","TRUE","TRUNCATE","TYPE","TYPES","UNBOUNDED","UNCOMMITTED","UNDEFINED","UNDO","UNDOFILE","UNDO_BUFFER_SIZE","UNICODE","UNINSTALL","UNION","UNIQUE","UNKNOWN","UNLOCK","UNSIGNED","UNTIL","UPDATE","UPGRADE","USAGE","USE","USER","USER_RESOURCES","USE_FRM","USING","UTC_DATE","UTC_TIME","UTC_TIMESTAMP","VALIDATION","VALUE","VALUES","VARBINARY","VARCHAR","VARCHARACTER","VARIABLES","VARYING","VCPU","VIEW","VIRTUAL","VISIBLE","WAIT","WARNINGS","WEEK","WEIGHT_STRING","WHEN","WHERE","WHILE","WINDOW","WITH","WITHOUT","WORK","WRAPPER","WRITE","X509","XA","XID","XML","XOR","YEAR","YEAR_MONTH","ZEROFILL","ZONE"];
    const [templates, setTemplates]= useState(null);
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [diagrams, setDiagrams] = useState(null);
    const [loadStatus, setLoadStatus] = useState('Fetching Diagrams...');
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pgSize, setPgSize] = useState(8);
    const [formValidation, setFormValidation] = useState(['none']);

    function handleChange(e){
      let value = e.currentTarget.value;
      let diagramId = e.currentTarget.dataset.diagramid;
      let newFormValidation = [...formValidation];
      if(/(^[0-9].*|^.*\s.*$|^.*[!@#$%^&*(),.?":{}|<>-].*$)/.test(value) || reservedKeywordsMysql.includes(value.toUpperCase())){ //Here we check if the diagram name satisfies the valid name pattern of MySQL
        if(newFormValidation.indexOf('diagram'+diagramId)<0){
          newFormValidation.push('diagram'+diagramId); // and is not already pushed, then push the 'diagram'+id string into the validation status array
        }
      } else {
        let removalIndex = newFormValidation.indexOf('diagram'+diagramId); //otherwise, if the name user is updating, was already invalid, then
        if(removalIndex>-1){ // remove it from the validation status array
          newFormValidation.splice(removalIndex, 1)
        }
      }
      setFormValidation(newFormValidation);
    }

    function getdiagrams(page,key=null,size=pgSize){
        setIsLoading(true);
        fetch(import.meta.env.PROD?urls.productionUrl+'/user/getdiagrams':urls.devUrl+'/user/getdiagrams', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({pageNumber: page, keyword: key, pageSize: size}),
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagrams(data.message.map((element)=>{
                return {...element, isEditing: false}
              }));
              setNumPages(data.numPages);
              setPgSize(size);
              setCurrentPage(page?page:currentPage);
            } else {
              setDiagrams(null); //without this, if the last diagram is deleted, the state will remain same, and the last diagram will still be shown on page
              setLoadStatus('No Diagrams Found!');
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          setLoadStatus('Unable to Fetch Diagrams!');
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
      }

    useEffect(getdiagrams,[])

    function openDiagram(e){
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/getdiagram':urls.devUrl+'/user/getdiagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({_id:e.currentTarget.dataset.diagramid})
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagram(data.message);
              navigate('/craft');
              return;
            } else {
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
    }

    function deleteDiagram(e){
      if(!confirm("Do you really want to delete the diagram?")){
        return;
      }
      setIsLoading(true);

      let newDiagrams = [...diagrams]; //here we will find index of the deleted diagram, delete it from react state copy, and
      let delIndex = newDiagrams.findIndex((dg)=>{ // will update it in state once request for deletion is successful on server
        return dg._id === e.currentTarget.dataset.diagramid;
      })
      if(delIndex<0){
        showAlert("Diagram with given diagramid not found!","danger");
        return;
      }
      newDiagrams.splice(delIndex,1)

      fetch(import.meta.env.PROD?urls.productionUrl+'/user/deletediagram':urls.devUrl+'/user/deletediagram', {
          method: 'POST',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
          body: JSON.stringify({_id:e.currentTarget.dataset.diagramid})
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setDiagram({name: null, tbls: null, isPublic: false});

              if(newDiagrams.length === 0){ //if the last diagram was deleted, we set diagrams to null and set loadStatus properly to show that no diagrams exist
                setDiagrams(null);
                setLoadStatus('No Diagrams Found!');
              }else{
                setDiagrams(newDiagrams);
              }
              showAlert(data.message, "danger");
              return;
            } else {
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
    }

    function enableEdit(e){
      let newDiagrams = diagrams.map((element)=>{
        if(element._id === e.currentTarget.dataset.diagramid){
          return {...element, isEditing: true};
        }
        return {...element}
      });
      setDiagrams(newDiagrams);
      let inp = document.getElementById('input'+e.currentTarget.dataset.diagramid);
      console.log(inp);
      inp.disabled = false; //this must be done because if we do not make the input enabled, focus() will be called before it is enabled, thus 
      //the cursor will not be able to move inside the input
      inp.focus();

    }

    function disableEdit(e){
      let oldname = e.currentTarget.dataset.diagramname;
      document.getElementById('input'+e.currentTarget.dataset.diagramid).value = oldname;
      let newDiagrams = diagrams.map((element, index)=>{
        if(element._id === e.currentTarget.dataset.diagramid){
          return {...element, isEditing: false};
        }
        return {...element}
      });

      let newFormValidation = [...formValidation]; //Resetting any validation errors on form disable, as original value will be shown next time
      if(newFormValidation.includes('diagram'+e.currentTarget.dataset.diagramid)){
        newFormValidation.splice(newFormValidation.indexOf('diagram'+e.currentTarget.dataset.diagramid), 1 );
        setFormValidation(newFormValidation);
      }

      setDiagrams(newDiagrams);
    }

    function renameDiagram(e){
      let diagramid = e.currentTarget.dataset.diagramid;
      let oldname = e.currentTarget.dataset.diagramname;
      let newname = document.getElementById('input'+diagramid).value;

      if(formValidation.includes('diagram'+diagramid)){
        showAlert('Invalid Diagram Name');
        return;
      }
      if(!document.querySelector('#form'+diagramid).checkValidity()){ //this is required because by default, unless form is submitted with submit button, validation is not triggered
        document.querySelector('#form'+diagramid).reportValidity();
        return;
      }
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/renamediagram':urls.devUrl+'/user/renamediagram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', //this must be set in order to save the received session-cookie,
        //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        body: JSON.stringify({_id: diagramid , newname: newname})
    })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data) => {
          let newDiagrams = diagrams.map((element) => { //the below lines will actually disable the input before doing anything with response
            if (element._id === diagramid) {
              return { ...element, isEditing: false };
            }
            return { ...element }
          });
          setDiagrams(newDiagrams);

          if (data.success) {
            showAlert(data.message, 'success');
            getdiagrams();
          } else {
            document.getElementById('input'+diagramid).value = oldname;
            showAlert(data.message, 'success');
          }
        })
        .catch((error) => {
            showAlert('An error occured while trying to access the backend API', 'danger')
            console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
    }
    

    function toggleTemplateModal(){
      templateModalVisible?setTemplateModalVisible(false):setTemplateModalVisible(true);
    }

    function openTemplateModal(){
      setIsLoading(true);
      fetch(import.meta.env.PROD?urls.productionUrl+'/user/gettemplates':urls.devUrl+'/user/gettemplates', {
          method: 'GET',
          headers: {         
            'Content-Type': 'application/json',
          },
          credentials: 'include', //this must be set in order to save the received session-cookie,
          //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
        })
        .then(response => response.json()) //response.json() or response.text() provides the 'data'
        .then((data)=>{
            if(data.success){
              setTemplates(data.message);
            } else {
              setTemplates(null); //without this, if the last diagram is deleted, the state will remain same, and the last diagram will still be shown on page
              setLoadStatus('No Templates Found!');
              showAlert(data.message, 'danger');
              return;
            }
        })
        .catch((error)=>{
          setLoadStatus('Unable to Fetch Templates!');
          showAlert('An error occured while trying to access the backend API', 'danger')
          console.log(error)
        })
        .finally(()=>{
          setIsLoading(false);
        })
      toggleTemplateModal();
    }

  return (
  <div className={`p-5`}>
    <TopBar theme={theme} getdiagrams={getdiagrams} pgSize={pgSize} setPgSize={setPgSize}/>
    {diagrams ?
      <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        {diagrams.map((element, index) => {
          return (
            <div key={index} className={`card p-1 rounded-lg ${theme === 'dark' ? 'border-gray-900 bg-gray-900' : 'border-blue-50'} border-2  shadow-lg flex flex-col justify-center items-center transition overflow-hidden hover:shadow hover:border-2 hover:border-blue-400`}>
              <div className='publicStatus w-full flex justify-end text-gray-400'>
                {
                  element.isPublic ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 open-eye">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 closed-eye">
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                }
              </div>
              <div className="image flex justify-center items-center px-2 py-10 w-full" data-diagramid={element._id} onClick={!element.isEditing ? openDiagram : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-blue-500 w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>

              </div>
              <div className={`body rounded bg-transparent flex justify-between items-center w-full overflow-x-auto p-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                <form id={'form' + element._id} className='left flex flex-col items-center gap-x-2'>
                  {/* We need to set key value in the below input to one which changes everytime, because, if key value will be same, defaultValue will be cached for first rerender as the input maintains its own state,
                      But, if the key value exists, and changes on rerender, the defaultValue also changes */}
                    <input name="diagramName" key={element._id} type='text' required={true} id={'input' + element._id} defaultValue={element.name} className={`diagram-name px-1 py-0.5 ${formValidation.includes('diagram'+element._id) ? 'border-red-500' : 'border-blue-600' } enabled:outline-0 enabled:border-b-2 bg-transparent`} disabled={element.isEditing ? false : true} data-diagramid={element._id} onChange={handleChange}/>
                  </form>
                <div className='right buttons flex flex-nowrap'>
                  <button className={`rename-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-blue-500' : 'hover:bg-blue-200'} ${element.isEditing ? 'hidden' : ''}`} data-diagramid={element._id} onClick={enableEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                  </button>
                  <button className={`cancel-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-200'} ${element.isEditing ? '' : 'hidden'}`} data-diagramname={element.name} data-diagramid={element._id} onClick={disableEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className={`save-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-blue-500' : 'hover:bg-blue-200'} ${element.isEditing ? '' : 'hidden'}`} data-diagramname={element.name} data-diagramid={element._id} onClick={renameDiagram}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className={`delete-button rounded-full p-2 ${theme === 'dark' ? 'hover:bg-red-500' : 'hover:bg-red-200'} ${element.isEditing ? 'hidden' : ''}`} data-diagramid={element._id} onClick={deleteDiagram}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          )
        })}
      </div>
      :
      <div className={`p-5 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className='flex gap-x-2 justify-center text-gray-500'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          <div className="text-3xl">
            {loadStatus}
          </div>
        </div>
      </div>
    }
    <div className={`${diagrams?'':'hidden'}`}>
      <PageNumber theme={theme} numPages={numPages} currentPage={currentPage} setCurrentPage={setCurrentPage} getdiagrams={getdiagrams}/>
    </div>
    <div className="bottom-right-buttons flex flex-col fixed bottom-5 right-5 gap-5">
      <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={() => {
        setDiagram({ name: null, tbls: null, isPublic: false });
        navigate('/craft');
      }}>
        <Tooltip theme={theme} position={'left'} text={'New Diagram'}></Tooltip>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      <button type='button' className={`group relative bg-blue-700 flex shadow-lg p-3 text-white transition-transform rounded-full hover:scale-110`} onClick={openTemplateModal}>
      <Tooltip theme={theme} position={'left'} text={'New From Templates'}></Tooltip>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
    <TemplateModal theme={theme} showAlert={showAlert} urls={urls} visible={templateModalVisible} toggleVisible={toggleTemplateModal} templates={templates} setIsLoading={setIsLoading} setDiagram={setDiagram}></TemplateModal>
  </div>
  )
  }

import './App.css';
import Navbar from './components/Navbar.jsx'
import MainContent from './components/MainContent.jsx';
import MainCanvas from './components/MainCanvas.jsx';
import AboutContent from './components/AboutContent.jsx';
import Alert from './components/Alert.jsx';
import Diagrams from './components/Diagrams.jsx';
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignupForm from './components/SignupForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Loader from './components/Loader.jsx';

function App(){
  const [isLoading, setIsLoading] = useState(false);
  const [authInfo, setAuthInfo] = useState(null); //this stores whether user is logged in or not, if logged in, it contains the email
  const [alert, setAlert] = useState(null);
  const [theme, setTheme] = useState('light');
  const [diagram, setDiagram] = useState({name: null, tbls: [{ name: 'Table1', x: 100, y: 100, w: 150, notNull: false, pKey: null, fields: [{ name: 'id', type: 'INT', size: null, isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]});
  const dtypes = [
    "CHAR","VARCHAR","BINARY","VARBINARY","TINYBLOB","TINYTEXT","TEXT","BLOB","MEDIUMTEXT","MEDIUMBLOB","LONGTEXT","LONGBLOB","TINYINT","BOOL","BOOLEAN","SMALLINT","MEDIUMINT","INT","INTEGER","BIGINT","FLOAT","DOUBLE","DECIMAL","DEC","ENUM","SET","DATE","DATETIME","TIMESTAMP","TIME","YEAR"];
  //the below code makes sure that the diagram state variable is reset everytime a user logs out, so that
  //if the user logs out without making changes, and then logs in again and tries to save a new diagramm, if the 
  //diagram is not reset, it will contain the name of the diagram the user was editing earlier, due to which
  //the same diagram will be updated. So, we reset the state so that if the user logs in again and goes to craft page, a 
  //new diagram object is created. 
  useEffect(()=>{
    if(!authInfo){
      setDiagram({name: null, tbls: [{ name: 'Table1', x: 100, y: 100, w: 150, notNull: false, pKey: null, fields: [{ name: 'id', type: 'INT', size: null, isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]})
    }
  }, [authInfo])
  function showAlert(message, type){
    setAlert({message: message, type: type});
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

  function closeAlert(){
    setAlert(null);
  }

  function toggleTheme(){
    theme==='light'?setTheme('dark'):setTheme('light');
  }
  return (
    <div>
      <Router basename='/dbcrafter_frontend'> 
      {/* basename is necessary because github pages hosts app at user.ghub.io/repo_name so every route will be prefixed with repo_name */}
      <Navbar title='Dbcrafter' theme={theme} alert={alert} toggleTheme={toggleTheme} showAlert={showAlert} authInfo = {authInfo} setAuthInfo={setAuthInfo}/>
      <Alert alert={alert} closeAlert={closeAlert}/>
      <Loader isLoading={isLoading}/>
        <Routes>
          <Route exact path='/' element={<MainContent theme={theme} showAlert={showAlert} authInfo={authInfo} />}/>
          <Route exact path='/signup' element={<SignupForm showAlert={showAlert} theme={theme}/>}/>
          <Route exact path='/login' element={<LoginForm showAlert={showAlert} setAuthInfo={setAuthInfo} theme={theme} setIsLoading={setIsLoading}/>}/>
          <Route exact path='/craft' element={<MainCanvas dtypes={dtypes} showAlert={showAlert} theme={theme} authInfo={authInfo} diagram={diagram} setDiagram={setDiagram}/>} />
          <Route exact path='/diagrams' element={<Diagrams showAlert={showAlert} theme={theme} authInfo={authInfo} setDiagram={setDiagram}/>}/>
          <Route exact path='/about' element={<AboutContent theme={theme}/>}/>
        </Routes>
      </Router>
    </div> 
  )
}

export default App;
import './App.css';
import Navbar from './components/Navbar.jsx'
import MainContent from './components/MainContent.jsx';
import MainCanvas from './components/MainCanvas.jsx';
import AboutContent from './components/AboutContent.jsx';
import Alert from './components/Alert.jsx';
import Diagrams from './components/Diagrams.jsx';
import Settings from './components/Settings.jsx';
import Profile from './components/Profile.jsx';
import { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignupForm from './components/SignupForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Loader from './components/Loader.jsx';
import ChangePasswordForm from './components/ChangePasswordForm.jsx';
import ResetAccount from './components/ResetAccount.jsx';
import DeleteAccount from './components/DeleteAccount.jsx';
import Help from './components/Help.jsx';

function App(){
  const [isLoading, setIsLoading] = useState(false);
  const [authInfo, setAuthInfo] = useState(null); //this stores whether user is logged in or not, if logged in, it contains the email
  const [currentPath,setCurrentPath] = useState('/'); //this is used to store the current path whenever a component loads
  const [alert, setAlert] = useState(null);
  const [theme, setTheme] = useState('light');
  const [diagram, setDiagram] = useState({name: null, tbls:null, isPublic: false});
  const dtypes = [
    "CHAR","VARCHAR","BINARY","VARBINARY","TINYBLOB","TINYTEXT","TEXT","BLOB","MEDIUMTEXT","MEDIUMBLOB","LONGTEXT","LONGBLOB","TINYINT","BOOL","BOOLEAN","SMALLINT","MEDIUMINT","INT","INTEGER","BIGINT","FLOAT","DOUBLE","DECIMAL","DEC","ENUM","SET","DATE","DATETIME","TIMESTAMP","TIME","YEAR"];
  
  const urls = {productionUrl : 'https://dbcrafter-project.uc.r.appspot.com', devUrl : 'http://localhost:3000'}
  
  function login(){
    setIsLoading(true);
    fetch(import.meta.env.PROD?urls.productionUrl+'/loginstatus':urls.devUrl+'/loginstatus', {
      method: 'GET',
      headers: {         
        'Content-Type': 'application/json',
      },
      credentials: 'include', //this must be set in order to save the received session-cookie,
      //also, after setting credentials to include, cors options must be set to allow credentials and origin from this domain
    })
    .then(response => response.json()) //response.json() or response.text() provides the 'data'
    .then((data)=>{
        if(data.user){
            setAuthInfo(data.user);
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
useEffect(login, []); //this is important to update it only the first time

    //the below code makes sure that the diagram state variable is reset everytime a user logs out, so that
  //if the user logs out without making changes, and then logs in again and tries to save a new diagramm, if the 
  //diagram is not reset, it will contain the name of the diagram the user was editing earlier, due to which
  //the same diagram will be updated. So, we reset the state so that if the user logs in again and goes to craft page, a 
  //new diagram object is created. 
  useEffect(()=>{
    if(!authInfo){
      setDiagram({name: null, tbls: null})
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
      <Router> 
      <Navbar title='Dbcrafter' theme={theme} alert={alert} toggleTheme={toggleTheme} showAlert={showAlert} authInfo = {authInfo} setAuthInfo={setAuthInfo} setIsLoading={setIsLoading} urls={urls} currentPath={currentPath} setCurrentPath={setCurrentPath}/>
      <Alert alert={alert} closeAlert={closeAlert} theme={theme}/>
      <Loader isLoading={isLoading}/>
        <Routes>
          <Route exact path='/' element={<MainContent theme={theme} showAlert={showAlert} authInfo={authInfo} />}/>
          <Route exact path='/signup' element={<SignupForm showAlert={showAlert} theme={theme} setIsLoading={setIsLoading} urls={urls}/>}/>
          <Route exact path='/login' element={<LoginForm showAlert={showAlert} setAuthInfo={setAuthInfo} theme={theme} setIsLoading={setIsLoading} urls={urls}/>}/>
          <Route exact path='/craft' element={<MainCanvas dtypes={dtypes} showAlert={showAlert} theme={theme} authInfo={authInfo} diagram={diagram} setDiagram={setDiagram} setIsLoading={setIsLoading} urls={urls}/>} />
          <Route exact path='/diagrams' element={<Diagrams showAlert={showAlert} theme={theme} authInfo={authInfo} setDiagram={setDiagram} setIsLoading={setIsLoading} urls={urls}/>}/>
          <Route exact path='/about' element={<AboutContent theme={theme}/>}/>
          <Route exact path='/settings' element={<Settings theme={theme} currentPath={currentPath}/>}>
            <Route exact path='/settings/profile' element={<Profile authInfo={authInfo} setCurrentPath={setCurrentPath}/>}/>
            <Route exact path='/settings/password' element={<ChangePasswordForm theme={theme} urls={urls} setIsLoading={setIsLoading} showAlert={showAlert} setCurrentPath={setCurrentPath}/>}/>
            <Route exact path='/settings/resetaccount' element={<ResetAccount theme={theme} urls={urls} setIsLoading={setIsLoading} showAlert={showAlert} setCurrentPath={setCurrentPath}/>}/>
            <Route exact path='/settings/deleteaccount' element={<DeleteAccount theme={theme} urls={urls} setIsLoading={setIsLoading} showAlert={showAlert} setCurrentPath={setCurrentPath} setAuthInfo={setAuthInfo}/>}/>
            <Route exact path='/settings/help' element={<Help theme={theme} urls={urls} setIsLoading={setIsLoading} showAlert={showAlert} setCurrentPath={setCurrentPath}/>}/>
          </Route>
        </Routes>
      </Router>
    </div> 
  )
}

export default App;
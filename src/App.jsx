import './App.css';
import Navbar from './components/Navbar.jsx'
import MainContent from './components/MainContent.jsx';
import MainCanvas from './components/MainCanvas.jsx';
import AboutContent from './components/AboutContent.jsx';
import Alert from './components/Alert.jsx';
import Diagrams from './components/Diagrams.jsx';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App(){
  const [authInfo, setAuthInfo] = useState(null); //this stores whether user is logged in or not, if logged in, it contains the email
  const [alert, setAlert] = useState(null);
  const [theme, setTheme] = useState('light');
  const [diagram, setDiagram] = useState({name: null, tbls: [{ name: 'Table1', x: 20, y: 20, w: 150, pKey: 'id', fields: [{ name: 'id', type: 'INT', isFKey: false, refTbl: 'NONE', refField: 'NONE'}] }]});

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
      <Navbar title='DBCRAFTER' theme={theme} alert={alert} toggleTheme={toggleTheme} showAlert={showAlert} authInfo = {authInfo} setAuthInfo={setAuthInfo}/>
      <Alert alert={alert} closeAlert={closeAlert}/>
        <Routes>
          <Route exact path='/' element={<MainContent theme={theme} showAlert={showAlert} authInfo={authInfo} />}/>
          <Route exact path='/signup' element={<MainContent type='signup' theme={theme} showAlert={showAlert} authInfo={authInfo}/>}/>
          <Route exact path='/craft' element={<MainCanvas showAlert={showAlert} theme={theme} authInfo={authInfo} diagram={diagram} setDiagram={setDiagram}/>} />
          <Route exact path='/diagrams' element={<Diagrams showAlert={showAlert} theme={theme} authInfo={authInfo} setDiagram={setDiagram}/>}/>
          <Route exact path='/about' element={<AboutContent theme={theme}/>}/>
        </Routes>
      </Router>
    </div> 
  )
}

export default App;
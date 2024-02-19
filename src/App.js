import './App.css';
import Navbar from './components/Navbar.js'
import MainContent from './components/MainContent';
import MainCanvas from './components/MainCanvas.js';
import AboutContent from './components/AboutContent.js';
import Alert from './components/Alert.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
import { useState } from 'react';
function App(){
  const [alert, setAlert] = useState(null);
  function showAlert(message, type){
    setAlert({message: message, type: type});
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }

  function closeAlert(){
    setAlert(null);
  }
  return (
    <><Router>
      <Navbar title='Dbcrafter'/>
      <Alert alert={alert} closeAlert={closeAlert}/>
        <Routes>
          <Route exact path='/' element={<MainContent/>}/>
          <Route exact path='/signup' element={<MainContent type='signup'/>}/>
          <Route exact path='/craft' element={<MainCanvas showAlert={showAlert}  />}/>
          <Route exact path='/about' element={<AboutContent/>}/>
        </Routes>
      </Router>
    </> 
  )
}

export default App;
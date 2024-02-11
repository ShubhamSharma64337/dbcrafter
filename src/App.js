import './App.css';
import Navbar from './components/Navbar.js'
import MainContent from './components/MainContent';
import MainCanvas from './components/MainCanvas.js';
import AboutContent from './components/AboutContent.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
function App(){
  
  return (
    <><Router>
      <Navbar title='Dbcrafter'/>
      {/* <MainContent></MainContent> */}
      {/* <MainCanvas></MainCanvas> */}
      
        <Routes>
          <Route exact path='/' element={<MainContent/>}/>
          <Route exact path='/signup' element={<MainContent type='signup'/>}/>
          <Route exact path='/craft' element={<MainCanvas/>}/>
          <Route exact path='/about' element={<AboutContent/>}/>
        </Routes>
      </Router>
    </> 
  )
}

export default App;
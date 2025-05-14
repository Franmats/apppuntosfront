
import './App.css'
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { FrontalUsers } from './components/FrontalUsers/FrontalUsers';
import { UpdatePointsForUser } from './components/UpdatePointsForUser/UpdatePointsForUser';
import { Login } from './components/Login/Login';
import { HomePage } from './components/HomePage/HomePage';
import { Home } from './components/Home/Home';

function App() {


  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<FrontalUsers/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/update" element={<UpdatePointsForUser/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/profile" element={<HomePage/>}/>
      <Route path='*' element={<h2>Recurso no encontrado erro 404</h2>}/> 
    </Routes>
   
   
   </BrowserRouter>
  )
}

export default App

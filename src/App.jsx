
import './App.css'
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { FrontalUsers } from './components/FrontalUsers/FrontalUsers';
import { UpdatePointsForUser } from './components/UpdatePointsForUser/UpdatePointsForUser';
function App() {


  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<FrontalUsers/>}/>
      <Route path="/update" element={<UpdatePointsForUser/>}/>
  
      <Route path='*' element={<h2>Recurso no encontrado erro 404</h2>}/> 
    </Routes>
   
   
   </BrowserRouter>
  )
}

export default App

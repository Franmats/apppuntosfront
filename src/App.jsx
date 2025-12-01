
import './App.css'
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { FrontalUsers } from './components/FrontalUsers/FrontalUsers';
import { UpdatePointsForUser } from './components/UpdatePointsForUser/UpdatePointsForUser';
import { Login } from './components/Login/Login';
import { HomePage } from './components/HomePage/HomePage';
import { Home } from './components/Home/Home';
import { Logout } from './components/LogOut/LogOut';
import AuthGuard from './components/AuthGuard/AuthGuard';
import ProductList from './components/ProductList/ProductList';

function App() {


  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<div>
        <h2>Inicie Sesion para acceder</h2>
        <a href="/login">Iniciar Sesion</a>
      </div>}/>
      <Route path="/logout" element={<Logout/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/update" element={<UpdatePointsForUser/>}/>
      <Route path="/home" element={<AuthGuard><Home/></AuthGuard>}/>
      <Route path="/profile" element={<AuthGuard><HomePage/></AuthGuard>}/>
      <Route path="/products/:category" element={<ProductList/>}/>
      <Route path='*' element={<h2>404</h2>}/> 
    </Routes>
   
   
   </BrowserRouter>
  )
}

export default App

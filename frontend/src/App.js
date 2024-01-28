
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/pages/Login"
import Home from "./components/pages/Home"
import Register from './components/pages/Register';
import Create from './components/pages/Create';
import Analyse from './components/pages/Analyse';
import PageNavbar from './components/PageNavbar';
import Survay from './components/pages/Survay';
import SurvayAdd from './components/pages/SurvayAdd';


function App() {
  return (
    <BrowserRouter>
      <PageNavbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='/analyse' element={<Analyse />}></Route>
        <Route path='/survay' element={<Survay />}></Route>
        <Route path='/survayAdd' element={<SurvayAdd />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

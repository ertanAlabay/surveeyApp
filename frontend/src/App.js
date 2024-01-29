
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/pages/login/Login"
import Home from "./components/pages/home/Home"
import Register from './components/pages/register/Register';
import Create from './components/pages/create/Create';
import Analyse from './components/pages/analyse/Analyse';
import PageNavbar from './components/PageNavbar';
import SurvayAdd from './components/pages/survayCreate/SurvayAdd';


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
        <Route path='/survayAdd' element={<SurvayAdd />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

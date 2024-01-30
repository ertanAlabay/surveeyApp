
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/pages/login/Login"
import Home from "./components/pages/home/Home"
import Register from './components/pages/register/Register';
import Create from './components/pages/create/Create';
import Analyse from './components/pages/analyse/Analyse';
import PageNavbar from './components/navbar/PageNavbar';
import SurvayAdd from './components/pages/survayCreate/SurvayAdd';
import PageFooter from './components/footer/PageFooter';

function App() {
  return (
    <BrowserRouter>
      <PageNavbar />
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/create' element={<Create />}/>
        <Route path='/analyse' element={<Analyse />}/>
        <Route path='/survayAdd' element={<SurvayAdd />}/>
        {/* Yönlendirme */}
        <Route index element={<Login />} />
      </Routes>
      <PageFooter/>
    </BrowserRouter>

  );
}

export default App;

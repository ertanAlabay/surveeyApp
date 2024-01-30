/**
 * Ertan Osman ALABAY - 30.01.2024
 */

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

/**
 * Sayfalar arası geçişi sağlar.
 * Navbarda bulunan linklerin tanımı burada da yapılır.
 * Ayrıca 34. satırda uygulama açılışını Login sayfasına yapar.
 */

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

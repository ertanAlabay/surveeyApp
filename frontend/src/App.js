
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/pages/Login"
import Home from "./components/pages/Home"
import Register from './components/pages/Register';
import Create from './components/pages/Create';
import PageNavbar from './components/PageNavbar';

function App() {
  return (
    <BrowserRouter>
      <PageNavbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/create' element={<Create />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

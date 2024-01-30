// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../login/Login.css'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogin = (e) => {
    e.preventDefault();
    // Burada login işlemleri yapılabilir
    axios.post('http://localhost:3001/login', values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/');
        } else {
          alert(res.data.Message);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <h2 className='d-flex justify-content-center align-items-center h3 mb-3 fw-normal'>Giriş Yap</h2>
          <form onSubmit={handleLogin}>
            <div className='mb-3'>
              <input
                type="email"
                className='form-control'
                placeholder='E-mail'
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <input
                type="password"
                className='form-control'
                placeholder='Password'
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
              />
              <div className="valid-feedback">Valid.</div>
              <div className="invalid-feedback">Please fill out this field.</div>
            </div>
            <div className='form-floating d-grid gap-3'>
              <button type="submit" className='btn btn-dark'>Giriş</button>
            </div>
          </form>
          <p className='mt-1'>Hesabın yok mu? <a href="/register" className="text-black-50 fw-bold m-2">Kayıt Ol</a></p>
        </div>
      </div>
    </div>

  );
};

export default Login;
// components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../register/Register.css'

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Burada register işlemleri yapılabilir
    //console.log('Email:', email, 'Password:', password);
    axios.post('http://localhost:3001/register', values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/login');
        } else {
          alert(res.data.Message);
        }
      })
      .catch(err => console.log(err));
  };


  return (
    <div className='container py-5 h-100'>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <h2 className='d-flex justify-content-center align-items-center h3 mb-3 fw-normal'>Kayıt Ol</h2>
          <form onSubmit={handleRegister}>
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
                onChange={(e) => setValues({ ...values, password: e.target.value })} required
              />
            </div>
            <div className='form-floating d-grid gap-3'>
              <button type="submit" className='btn btn-dark'>Kayıt</button>
            </div>
          </form>
          <p className='mt-1'>Bir hesabın var mı? <a href="/login" className="text-black-50 fw-bold m-2">Giriş Yap</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
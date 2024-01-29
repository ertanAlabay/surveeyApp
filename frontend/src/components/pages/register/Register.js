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
  <div className='container-fluid col-3 mb-3 mt-3'>
      <h2 className='h3 mb-3 fw-normal'>Register</h2>
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
          <button type="submit" className='btn btn-dark'>Register</button>
        </div>
    </form>

    <p>Already have an account? <a href="/login">Login here</a></p>
  </div>
);
};

export default Register;
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function Logout() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name)
        } else {
          setAuth(false);
          setMessage(res.data.message);
        }
      })
  })

  const handleLogout = () => {
    axios.get('http://localhost:3001/logout')
      .then(res => {
        if (res.data.Status === "Success") {
          location.reload(); //?????????????
          navigate('/login');
        } else {
          alert("error");
        }

      })
      .catch(err => console.log(err));
  }

  return (
    <>
      {
        auth ?
          <div>
            <h3>Giriş yaptınız {name}</h3>
            <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
          </div>
          :
          <div>
            <h3>{message}</h3>
            <button className='btn btn-primary'>Login</button>
          </div>
      }
    </>
  )
}

export default Logout
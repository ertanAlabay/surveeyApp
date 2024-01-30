/**
 * Ertan Osman ALABAY - 30.01.2024
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Logout from '../pages/logout/Logout'

/**
 * Sayfalar arası geçşi sağlamak için basit bir navbar.
 * Responsive 
 * Çıkış Yap butonuna basarak Login sayfasına atar.
 */

export default function PageNavbar() {
  
  const location = useLocation();

  // Eğer "/", login veya register sayfasındaysanız footer gözükmez.
  if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register') {
    return null;
  }
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/home" className="navbar-brand">AnketApp</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-navbar-collapse" aria-controls="bs-navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="bs-navbar-collapse">
            <ul className="navbar-nav ">
              <Link to="/home" className="nav-link">Anasayfa</Link>
              <Link to="/survayAdd" className="nav-link">Anket Oluştur</Link>
              <Link to="/create" className="nav-link">Soru Oluştur</Link>
              <Link to="/analyse" className="nav-link">Analiz</Link>
              <Logout />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

// PageFooter.js

import React from 'react';
import './PageFooter.css';
import { useLocation } from 'react-router-dom';



  
function PageFooter() {
  const location = useLocation();

  // Eğer login veya register sayfasındaysanız null döndürün
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  
  return (
    <div className="container page-footer">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p className="col-md-4 mb-0 text-muted">Made By Ertan Osman ALABAY &copy; 2024</p>

        <a href="/" className="col-md-3 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <svg className="bi me-2" width="40" height="32"></svg>
        </a>
        <ul className="nav col-md-5 justify-content-end">
          <li className="nav-item"><a href="/home" className="nav-link px-2 text-muted">Anasayfa</a></li>
          <li className="nav-item"><a href="/survayAdd" className="nav-link px-2 text-muted">Anket Oluştur</a></li>
          <li className="nav-item"><a href="/create" className="nav-link px-2 text-muted">Soru Oluştur</a></li>
          <li className="nav-item"><a href="/analyse" className="nav-link px-2 text-muted">Analiz</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default PageFooter;
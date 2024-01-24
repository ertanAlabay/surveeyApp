import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Logout from "./pages/Logout";

export default function PageNavbar() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  return (
    <div className="container mt-4">
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">Your Logo</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/create" className="nav-link">Create</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
                <Logout />
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

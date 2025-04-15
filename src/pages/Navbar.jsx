import React from 'react';
import { Link } from 'react-router-dom';
// import '../Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">F1 Team Manager</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/create" className="nav-link">Create Car</Link>
        </li>
        <li className="nav-item">
          <Link to="/gallery" className="nav-link">Car Gallery</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
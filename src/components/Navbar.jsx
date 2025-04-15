import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : 'nav-link'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            F1 Team Manager
          </Link>
        </div>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/create" className={isActive('/create')}>
              Create Car
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
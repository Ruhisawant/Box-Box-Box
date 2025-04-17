import { Link, useLocation } from 'react-router-dom';
import { House, UsersRound, Plus, Trophy, Settings } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
      <div className="navbar-logo">
        <div className="symbol">F1</div>
        <span className="logo-text">Box Box Box</span>
      </div>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className={isActive('/')}>
              <House className="icon" /> Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/gallery" className={isActive('/gallery')}>
              <UsersRound className="icon" /> Team
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/create" className={isActive('/create')}>
              <Plus className="icon" /> Add Member
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/performance" className={isActive('/performance')}>
              <Trophy className="icon" /> Performance
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/settings" className={isActive('/settings')}>
              <Settings className="icon" /> Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
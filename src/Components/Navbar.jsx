import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotificationContext } from '../Page/NotificationContex';
import '../styles/Navbar.css';

const AppNavbar = () => {
  const { notifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // <-- QO‘SHILDI

  const unreadCount = useMemo(
    () => notifications.filter((notif) => !notif.isRead).length,
    [notifications]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role'); // chiqishda role ni ham o‘chir!
    navigate('/auth', { replace: true });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/home" className="logo" style={{ color: 'white' }}>
            <img style={{ borderRadius: '30px', width: '150px', height: '60px' }} src="https://cdn.textstudio.com/output/sample/normal/8/9/5/5/post-logo-73-5598.png" alt="socialapp" />
          </Link>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className={`link-all ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active-link' : ''}`}>Home</Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active-link' : ''}`}>Profile</Link>
          <Link to="/post" className={`nav-link ${location.pathname === '/post' ? 'active-link' : ''}`}>Post</Link>
          <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active-link' : ''}`}>Users</Link>
          <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active-link' : ''}`}>
            Notifications
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
          {/* Faqat admin uchun */}
          {role === "101" && (
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active-link' : ''}`}>
              Admin
            </Link>
          )}
          {token && (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
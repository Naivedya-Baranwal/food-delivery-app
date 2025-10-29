// admin/src/components/Navbar/Navbar.jsx
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';

const Navbar = ({ isLoggedIn, setShowLogin }) => {
  const { handleLogout } = useContext(AdminContext);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* Logo - Left */}
      <Link to='/' className="navbar-logo-link">
        <img src={assets.logo} alt="Naivedyam" className="navbar-logo" />
      </Link>

      {/* Center Navigation (Only when logged in) */}
      {isLoggedIn && (
        <div className="navbar-center">
          <button 
            className="nav-link-btn"
            onClick={() => navigate('/')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          <button 
            className="nav-link-btn"
            onClick={() => navigate('/add')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
          <button 
            className="nav-link-btn"
            onClick={() => navigate('/list')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Menu Items
          </button>
          <button 
            className="nav-link-btn"
            onClick={() => navigate('/orders')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </button>
        </div>
      )}

      {/* Right Actions */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <div className="profile-section">
              <img className='profile-img' src={assets.profile_image} alt="Profile" />
              <span className="profile-name">Admin</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

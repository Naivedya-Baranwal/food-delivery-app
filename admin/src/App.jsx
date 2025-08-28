import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react'
import AdminLoginPopup from './components/LoginPopup/LoginPopup'
import axios from '../utils/credentials'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/admin/verify');
        if (response.data.success) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const renderProtectedRoute = (component) => {
    if (!isLoggedIn) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          padding: '20px',
          width: '100%',
          marginBottom: '180px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
            border: '2px solid #ff6347'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              🔒
            </div>

            <h2 style={{
              color: '#ff6347',
              marginBottom: '10px',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)'
            }}>
              Please Login
            </h2>

            <p style={{
              color: '#666',
              marginBottom: '25px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              lineHeight: '1.5'
            }}>
              You need to be authenticated to access this page.
            </p>

            <button
              onClick={() => setShowLogin(true)}
              style={{
                backgroundColor: '#ff6347',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '200px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e5533d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff6347'}
            >
              Login
            </button>
          </div>
        </div>
      );
    }
    return component;
  };


  return (
    <div>
      <ToastContainer />
      <Navbar
        isLoggedIn={isLoggedIn}
        setShowLogin={setShowLogin}
        setIsLoggedIn={setIsLoggedIn}
      />
      {showLogin ? <AdminLoginPopup
        setShowLogin={setShowLogin}
        setIsLoggedIn={setIsLoggedIn}
      /> : <></>}
      <hr />
      <div className="app-content">
        <Sidebar isLoggedIn={isLoggedIn} setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/add" element={renderProtectedRoute(<Add />)} />
          <Route path="/list" element={renderProtectedRoute(<List />)} />
          <Route path="/orders" element={renderProtectedRoute(<Orders />)} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

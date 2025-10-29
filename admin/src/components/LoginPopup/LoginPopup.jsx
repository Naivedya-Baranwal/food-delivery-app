// admin/src/components/LoginPopup/AdminLoginPopup.jsx
import './LoginPopup.css';
import { useState, useEffect, useContext } from "react";
import axios from "../../../utils/credentials.js";
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext.jsx';

function AdminLoginPopup() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setToken, setIsLoggedIn, setShowLogin } = useContext(AdminContext);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("/api/admin/login", data);
      if (response.data.success) {
        const receivedToken = response.data.token;
        
        console.log("✅ Login successful, token received");
        
        setToken(receivedToken);
        setIsLoggedIn(true);
        setShowLogin(false);
        
        toast.success(response.data.message || 'Login successful!');
        
        console.log("✅ Context updated, socket should initialize now");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <div 
        className="login-popup-overlay" 
        onClick={() => setShowLogin(false)}
      ></div>
      
      <form onSubmit={onLogin} className="login-popup-container">
        {/* Header */}
        <div className="login-popup-header">
          <div className="header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">Enter your credentials to access the dashboard</p>
          <button 
            type="button" 
            onClick={() => setShowLogin(false)}
            className="close-btn"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="email"
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="password"
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="login-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-small"></div>
              Logging in...
            </>
          ) : (
            <>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </>
          )}
        </button>

        {/* Footer */}
        <div className="login-footer">
          <p>🔒 Admin access only</p>
        </div>
      </form>
    </div>
  );
}

export default AdminLoginPopup;

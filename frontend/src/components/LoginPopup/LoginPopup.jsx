import { useContext, useEffect, useState } from 'react';
import './LoginPopup.css';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { toast } from 'react-toastify';

function LoginPopup({ setShowLogin }) {
    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    })

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            toast.success(response.data.message);
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false)
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <div className="login-popup-overlay" onClick={() => setShowLogin(false)}></div>
            <form onSubmit={onLogin} className="login-popup-container">
                {/* Header */}
                <div className="login-popup-header">
                    <div className="header-content">
                        <h2 className="header-title">Naivedyam</h2>
                        <p className="header-subtitle">
                            {currState === "Login" ? "Welcome back!" : "Join us today"}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={() => setShowLogin(false)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Toggle Tabs */}
                <div className="login-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${currState === "Login" ? "active" : ""}`}
                        onClick={() => setCurrState("Login")}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${currState === "Sign Up" ? "active" : ""}`}
                        onClick={() => setCurrState("Sign Up")}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Inputs */}
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input
                                    name='name'
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    type="text"
                                    placeholder='Enter your full name'
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {currState === "Sign Up" && (
                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <input
                                    name='phone'
                                    onChange={onChangeHandler}
                                    value={data.phone}
                                    type="tel"
                                    placeholder='Enter your phone number'
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input
                                name='email'
                                onChange={onChangeHandler}
                                value={data.email}
                                type="email"
                                placeholder='Enter your email'
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                name='password'
                                onChange={onChangeHandler}
                                value={data.password}
                                type="password"
                                placeholder='Enter your password'
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the <span>terms of use</span> & <span>privacy policy</span></p>
                </div>

                {/* Submit Button */}
                <button type='submit' className="submit-btn">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {/* Toggle State */}
                <p className="toggle-state">
                    {currState === "Login"
                        ? <>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></>
                        : <>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></>
                    }
                </p>
            </form>
        </div>
    )
}

export default LoginPopup


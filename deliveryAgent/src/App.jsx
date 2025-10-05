import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import LoginPopup from './components/LoginPopup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
     <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Navbar setShowLogin={setShowLogin} />
      <Dashboard />
    </>
  )
}

export default App

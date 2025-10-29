import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import LoginPopup from './components/LoginPopup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyToken } from './store/auth/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import {useUpdateLocation} from './hooks/useUpdateLocation';
import { Route, Routes } from 'react-router-dom';
import DeliveryAgentTracking from './components/DeliveryAgentTracking';
import DeliveryHistory from './pages/DeliveryHistory';


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
  const { token, initialLoading } = useSelector((state) => state.auth);
  useUpdateLocation();
  useEffect(() => {
        if (token) {
            dispatch(verifyToken());
        } else {
            dispatch({ type: 'auth/setInitialLoadingDone' });
        }
    }, [dispatch,token]); 

  // ✅ Show loading screen while verifying token
    if (initialLoading && token) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
  return (
    <>
     <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/' element={<Dashboard setShowLogin={setShowLogin}/>}/>
        <Route path ="/deliveryHistory" element={<DeliveryHistory/>}/>
        <Route path='/deliveryAgentTracking' element={<DeliveryAgentTracking/>}/>
      </Routes>
      
    </>
  )
}

export default App

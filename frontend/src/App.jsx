// import { useState, createContext, useContext } from 'react';
// import { Route, Routes } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer';
// import LoginPopup from './components/LoginPopup/LoginPopup';
// import Home from './pages/Home/Home';
// import Cart from './pages/Cart/Cart';
// import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
// import Verify from './pages/Verify/Verify';
// import MyOrders from './pages/MyOrders/MyOrders';
// import OrderTracking from './pages/OrderTracking/OrderTracking';

// import useGetLocation from './hooks/getLocation';
// import { StoreContext } from './context/StoreContext';
// import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';

// // Create a context to share the location request function
// export const LocationContext = createContext(null);

// const App = () => {
//   const { token, isTokenReady } = useContext(StoreContext);
//   const [showLogin, setShowLogin] = useState(false);

//   // Get the location request function but don’t call automatically
//   const { requestLocation } = useGetLocation();

//   return (
//     <LocationContext.Provider value={{ requestLocation }}>
//       <ToastContainer position="top-center" autoClose={2500} />
//       {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

//       <div className="app">
//         <Navbar setShowLogin={setShowLogin} />

//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/cart" element={<Cart />} />

//           {/* Protected routes */}
//           <Route
//             path="/order"
//             element={
//               <ProtectedRoute token={token} isTokenReady={isTokenReady} setShowLogin={setShowLogin}>
//                 <PlaceOrder />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/verify"
//             element={
//               <ProtectedRoute token={token} isTokenReady={isTokenReady} setShowLogin={setShowLogin}>
//                 <Verify />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/myorders"
//             element={
//               <ProtectedRoute token={token} isTokenReady={isTokenReady} setShowLogin={setShowLogin}>
//                 <MyOrders />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/OrderTracking/:orderId"
//             element={
//               <ProtectedRoute token={token} isTokenReady={isTokenReady} setShowLogin={setShowLogin}>
//                 <OrderTracking />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>

//       <Footer />
//     </LocationContext.Provider>
//   );
// };

// export default App;


// // App.jsx
// import { useState, createContext } from 'react';
// import { Route, Routes } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer';
// import LoginPopup from './components/LoginPopup/LoginPopup';
// import Home from './pages/Home/Home';
// import Cart from './pages/Cart/Cart';
// import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
// import Verify from './pages/Verify/Verify';
// import MyOrders from './pages/MyOrders/MyOrders';
// import OrderTracking from './pages/OrderTracking/OrderTracking';

// import useGetLocation from './hooks/getLocation';
// import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';

// // Create context
// export const LocationContext = createContext(null);

// const App = () => {
//   const [showLogin, setShowLogin] = useState(false);

//   // ✅ Get location functions and state
//   const locationHook = useGetLocation();

//   return (
//     <LocationContext.Provider value={locationHook}>
//       <ToastContainer position="top-center" autoClose={2500} />
//       {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

//       <div className="app">
//         <Navbar setShowLogin={setShowLogin} />

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/order" element={<PlaceOrder />} />
//           <Route path="/verify" element={<Verify />} />
//           <Route path="/myorders" element={<MyOrders />} />
//           <Route path="/OrderTracking/:orderId" element={<OrderTracking />} />
//         </Routes>
//       </div>

//       <Footer />
//     </LocationContext.Provider>
//   );
// };

// export default App;



// App.jsx
import { useState, createContext, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import OrderTracking from './pages/OrderTracking/OrderTracking';

import useGetLocation from './hooks/getLocation';
import { StoreContext } from './context/StoreContext';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';

// Create context
export const LocationContext = createContext(null);

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  
  // ✅ Get token and isTokenReady from context
  const { token, isTokenReady } = useContext(StoreContext);

  // Get location functions and state
  const locationHook = useGetLocation();

  return (
    <LocationContext.Provider value={locationHook}>
      <ToastContainer position="top-center" autoClose={2500} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          {/* ✅ Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />

          {/* ✅ Protected routes - Pass all required props */}
          <Route
            path="/order"
            element={
              <ProtectedRoute 
                token={token} 
                isTokenReady={isTokenReady} 
                setShowLogin={setShowLogin}
              >
                <PlaceOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute 
                token={token} 
                isTokenReady={isTokenReady} 
                setShowLogin={setShowLogin}
              >
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute 
                token={token} 
                isTokenReady={isTokenReady} 
                setShowLogin={setShowLogin}
              >
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrderTracking/:orderId"
            element={
              <ProtectedRoute 
                token={token} 
                isTokenReady={isTokenReady} 
                setShowLogin={setShowLogin}
              >
                <OrderTracking />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </LocationContext.Provider>
  );
};

export default App;

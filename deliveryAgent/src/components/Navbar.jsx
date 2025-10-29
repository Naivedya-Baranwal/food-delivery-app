// // components/Navbar.jsx
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../store/auth/authThunk";
// import { toast } from 'react-toastify';
// import {clearLocation} from "../store/location/locationSlice";
// import { useNavigate } from "react-router-dom";
// import logo from '../assets/logo.png';

// const Navbar = ({ setShowLogin }) => {
//   const { token, user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutUser()).unwrap();
//       dispatch(clearLocation());
//       toast.success("Logged out successfully");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className='bg-orange-400 shadow-lg mx-auto rounded-md'>
//       <div className='w-[90%] lg:w-[80%] mx-auto flex justify-between items-center py-4'>
//         {/* Logo & Brand */}
//         <div 
//           className='flex items-center gap-3 cursor-pointer group'
//           onClick={() => navigate("/")}
//         >
//           <img 
//             src={logo} 
//             alt="Naivedyam Logo" 
//             className="w-35 h-10 rounded-xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200" 
//           />
//         </div>

//         {/* Navigation Links */}
//         <div className='flex items-center gap-6'>
//           {!token ? (
//             <button
//               onClick={() => setShowLogin(true)}
//               className='px-6 py-2 cursor-pointer bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg'
//             >
//               Login
//             </button>
//           ) : (
//             <div className='flex items-center gap-4 md:gap-6'>
//               <button
//                 onClick={() => navigate("/deliveryHistory")}
//                 className='hidden md:block cursor-pointer font-medium hover:text-orange-100 transition-colors duration-200'
//               >
//                 📦 History
//               </button>
//               <div className='flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm'>
//                 <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className=' font-medium hidden md:block'>{user.name}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className='px-4 py-2 bg-white bg-opacity-20  font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm flex items-center gap-2'
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span className='hidden md:block cursor-pointer'>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// deliveryPartner/src/components/Navbar.jsx
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/auth/authThunk";
import { toast } from 'react-toastify';
import { clearLocation } from "../store/location/locationSlice";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

const Navbar = ({ setShowLogin }) => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearLocation());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className='fixed top-0 left-0 right-0 h-[70px] bg-white z-[1000] border-b-2 border-purple-200 flex justify-between items-center px-[4%] shadow-sm'>
      {/* Logo - Left */}
      <div 
        className='flex items-center cursor-pointer'
        onClick={() => navigate("/")}
      >
        <img 
          src={logo} 
          alt="Naivedyam" 
          className="h-[45px] w-auto transition-transform duration-200 hover:scale-105" 
        />
      </div>

      {/* Center Navigation (Only when logged in) */}
      {token && (
        <div className="flex gap-2 items-center">
          <button 
            className="flex items-center gap-1.5 px-4 py-2.5 border-none bg-transparent text-gray-600 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 hover:text-purple-700"
            onClick={() => navigate('/')}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button 
            className="flex items-center gap-1.5 px-4 py-2.5 border-none bg-transparent text-gray-600 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 hover:text-purple-700"
            onClick={() => navigate('/deliveryHistory')}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {!token ? (
          <button 
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md shadow-purple-600/30 hover:from-purple-700 hover:to-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40"
            onClick={() => setShowLogin(true)}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Login</span>
          </button>
        ) : (
          <>
            <button 
              className="flex items-center gap-1.5 px-[18px] py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md shadow-red-500/30 hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40"
              onClick={handleLogout}
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline cursor-pointer">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

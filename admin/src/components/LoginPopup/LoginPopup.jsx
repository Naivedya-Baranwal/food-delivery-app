import './LoginPopup.css'
import { useState, useEffect } from "react";
import axios from "../../../utils/credentials.js";
import { toast } from 'react-toastify';

function AdminLoginPopup({ setShowLogin, setIsLoggedIn }) {
  const [data, setData] = useState({ email: "", password: "" });

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
    try {
      const response = await axios.post("/api/admin/login",data);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token",response.data.token);
        setShowLogin(false);
        setIsLoggedIn(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
          <button type="button" onClick={()=>setShowLogin(false)}>X</button>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLoginPopup;

// import './LoginPopup.css'
// import { useState, useEffect } from "react";
// import axios from "../../../utils/credentials.js";
// import { toast } from 'react-toastify';

// function AdminLoginPopup({ setShowLogin, setIsLoggedIn }) {
//   const [data, setData] = useState({ email: "", password: "" });

//      useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, []);

//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onLogin = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post("/api/admin/login",data);
//       if (response.data.success) {
//         toast.success(response.data.message)
//         setShowLogin(false);
//         setIsLoggedIn(true);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onLogin} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>Admin Login</h2>
//           <button type="button" onClick={()=>setShowLogin(false)}>X</button>
//         </div>
//         <div className="login-popup-inputs">
//           <input
//             name="email"
//             onChange={onChangeHandler}
//             value={data.email}
//             type="email"
//             placeholder="Your email"
//             required
//           />
//           <input
//             name="password"
//             onChange={onChangeHandler}
//             value={data.password}
//             type="password"
//             placeholder="Password"
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default AdminLoginPopup;

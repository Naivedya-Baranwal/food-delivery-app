// admin/src/context/AdminContext.jsx
import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext(null);

const AdminContextProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    console.log("🔑 Initial token from localStorage:", savedToken ? "EXISTS" : "EMPTY");
    return savedToken || '';
  });
  
  const [socket, setSocket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('checking');
  
  const url = import.meta.env.VITE_BACKEND_URL;

  // ✅ Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      console.log("✅ Token saved to localStorage:", token.substring(0, 20) + "...");
    } else {
      localStorage.removeItem('token');
      console.log("❌ Token removed from localStorage");
    }
  }, [token]);

  // ✅ Setup notification permission on mount
  useEffect(() => {
    if (!("Notification" in window)) {
      console.error("Browser doesn't support notifications");
      setNotificationStatus('unsupported');
      return;
    }

    console.log("🔔 Current notification permission:", Notification.permission);

    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Permission result:", permission);
        setNotificationStatus(permission);
        
        if (permission === "granted") {
          toast.success("🔔 Notifications enabled!");
        } else {
          toast.error("❌ Notifications blocked.");
        }
      });
    } else {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  // ✅ Initialize socket when token exists
  useEffect(() => {
    console.log("🔄 Socket useEffect triggered. Token:", token ? "EXISTS" : "EMPTY");
    
    if (socket) {
      console.log("🔌 Disconnecting old socket:", socket.id);
      socket.disconnect();
      setSocket(null);
    }

    if (!token)return;

    const socketInstance = io(url, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Admin socket CONNECTED:', socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Admin socket disconnected:', reason);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 Cleaning up admin socket');
      socketInstance.disconnect();
    };
  }, [token, url]);

  // ✅ Global notification handler for new orders
  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (data) => {
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const notification = new Notification("🎉 New Order!", {
            body: `From: ${data.order.name}\nAmount: ₹${data.amount}\nItems: ${data.order.items.length}`,
            icon: '/logo.png',
            badge: '/logo.png',
            tag: `order-${data.order._id}`,
            requireInteraction: true,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
            navigate('/orders'); // Navigate to orders page on click
          };
        } catch (error) {
          console.error("❌ Notification failed:", error);
        }
      }
      toast.success(
        `🎉 New order from ${data.order.name}! Amount: ₹${data.amount}`,
        {
          autoClose: 5000,position: 'top-right',onClick: () => navigate('/orders')
        }
      );
    };
    socket.on('newOrder', handleNewOrder);
    return () => {
      socket.off('newOrder', handleNewOrder);
    };
  }, [socket, navigate]);

  // ✅ Logout function
  const handleLogout = () => {
    console.log("🚪 Logging out...");
    
    localStorage.removeItem('token');
    setToken('');
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    setIsLoggedIn(false);
    toast.success('Logout successful. See you soon!');
    navigate("/");
  };

  const contextValue = {
    socket,
    token,
    setToken,
    handleLogout,
    url,
    isLoggedIn,
    setIsLoggedIn,
    showLogin,
    setShowLogin,
    notificationStatus, // ✅ Expose notification status
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;


// // admin/src/context/AdminContext.jsx
// import { createContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export const AdminContext = createContext(null);

// const AdminContextProvider = ({ children }) => {
//   const navigate = useNavigate();
  
//   // ✅ Initialize token from localStorage
//   const [token, setToken] = useState(() => {
//     const savedToken = localStorage.getItem('token');
//     console.log("🔑 Initial token from localStorage:", savedToken ? "EXISTS" : "EMPTY");
//     return savedToken || '';
//   });
  
//   const [socket, setSocket] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
//   const [showLogin, setShowLogin] = useState(false);
  
//   const url = import.meta.env.VITE_BACKEND_URL;

//   // ✅ Sync token to localStorage
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//       console.log("✅ Token saved to localStorage:", token.substring(0, 20) + "...");
//     } else {
//       localStorage.removeItem('token');
//       console.log("❌ Token removed from localStorage");
//     }
//   }, [token]);

//   // ✅ Initialize socket when token exists
//   useEffect(() => {
//     console.log("🔄 Socket useEffect triggered. Token:", token ? "EXISTS" : "EMPTY");
    
//     // Cleanup old socket
//     if (socket) {
//       console.log("🔌 Disconnecting old socket:", socket.id);
//       socket.disconnect();
//       setSocket(null);
//     }

//     if (!token) {
//       console.log("⚠️ No token available, socket not initialized");
//       return;
//     }

//     console.log("🔌 Initializing admin socket...");

//     // Create socket connection
//     const socketInstance = io(url, {
//       auth: { token },
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 10000,
//     });

//     // Connection events
//     socketInstance.on('connect', () => {
//       console.log('✅ Admin socket CONNECTED:', socketInstance.id);
//       console.log('✅ Backend should now update isOnline and socketId');
//     });

//     socketInstance.on('connect_error', (error) => {
//       console.error('❌ Socket connection error:', error.message);
//     });

//     socketInstance.on('disconnect', (reason) => {
//       console.log('🔌 Admin socket disconnected:', reason);
//     });

//     setSocket(socketInstance);

//     // Cleanup on unmount or token change
//     return () => {
//       console.log('🔌 Cleaning up admin socket');
//       socketInstance.disconnect();
//     };
//   }, [token, url]); // Re-run when token or url changes

//   // ✅ Debug: Log token and socket changes
//   useEffect(() => {
//     console.log("📊 State update:");
//     console.log("  - Token:", token ? "SET" : "EMPTY");
//     console.log("  - Socket:", socket?.id || "NOT CONNECTED");
//     console.log("  - IsLoggedIn:", isLoggedIn);
//   }, [token, socket, isLoggedIn]);

//   // ✅ Logout function
//   const handleLogout = () => {
//     console.log("🚪 Logging out...");
    
//     localStorage.removeItem('token');
//     setToken('');
    
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//     }
    
//     setIsLoggedIn(false);
//     toast.success('Logout successful. See you soon!');
//     navigate("/");
//   };

//   const contextValue = {
//     socket,
//     token,
//     setToken,
//     handleLogout,
//     url,
//     isLoggedIn,
//     setIsLoggedIn,
//     showLogin,
//     setShowLogin,
//   };

//   return (
//     <AdminContext.Provider value={contextValue}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export default AdminContextProvider;

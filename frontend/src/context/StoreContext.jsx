// context/StoreContext.jsx
import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [isTokenReady, setIsTokenReady] = useState(false);
// ✅ NEW: Track agent locations by order ID
  const [agentLocations, setAgentLocations] = useState({});
   // ✅ NEW: Track order status updates
  const [orderStatusUpdates, setOrderStatusUpdates] = useState({});
  // ✅ STEP 1: Check localStorage for token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsTokenReady(true); 
  }, []);

  useEffect(() => {
    // Only connect if token exists and is ready
    if (!token || !isTokenReady) {
      return;
    }

    console.log("🔌 Initializing socket connection...");

    try {
      // Create socket instance
      const socketInstance = io(url, {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      setSocket(socketInstance);

      // Connection success
      socketInstance.on("connect", () => {
        console.log("✅ Socket connected:", socketInstance.id);
      });

      // Connection error
      socketInstance.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
      });

      // General error
      socketInstance.on("error", (error) => {
        console.error("❌ Socket error:", error);
      });

      // Disconnection
      socketInstance.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
      });

      // Listen to order updates
      socketInstance.on("orderStatusUpdate", (data) => {
        console.log("📦 Order status updated:", data);
        // You can add notification toast here
      });
 // ✅ NEW: Listen for agent location updates
      socketInstance.on("agentLocationUpdate", (data) => {
        console.log("📍 Agent location updated:", data);
        
        // Update location for specific order
        setAgentLocations(prev => ({
          ...prev,
          [data.orderId]: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            timestamp: data.timestamp
          }
        }));
      });

       // ✅ NEW: Listen for order delivered event
      socketInstance.on("orderDelivered", (data) => {
        console.log("🎉 Order delivered:", data);
        
        // Update order status in state
        setOrderStatusUpdates(prev => ({
          ...prev,
          [data.orderId]: {
            status: data.status,
            deliveredAt: data.deliveredAt,
            agentName: data.agentName,
            message: data.message
          }
        }));
        
        // Remove agent location tracking for this order
        setAgentLocations(prev => {
          const updated = { ...prev };
          delete updated[data.orderId];
          return updated;
        });
      });
      // ✅ Cleanup when component unmounts or token changes
      return () => {
        console.log("🔌 Cleaning up socket connection");
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    } catch (error) {
      console.error("❌ Error setting up socket connection:", error);
    }
  }, [token, isTokenReady, url]);

  // ✅ Cart functions
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      console.log("Attempting to fetch food list...");
      const response = await axios.get(url + "/api/food/list", {
        timeout: 30000
      });
      setFoodList(response.data.data);
      setLoading(false);
      console.log("Food list fetched successfully");
      return true;
    } catch (err) {
      console.error("Error fetching food list:", err.message);
      throw err;
    }
  };

  // ✅ Load cart data
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, {
        headers: { token },
        timeout: 30000
      });
      setCartItems(response.data.cartData);
    } catch (err) {
      console.error("Error loading cart data:", err);
    }
  };

  // ✅ Load cart after login/token change
  useEffect(() => {
    const fetchCartAfterLogin = async () => {
      if (token) {
        try {
          await loadCartData(token);
        } catch (err) {
          console.error("Error fetching cart after login:", err);
        }
      } else {
        setCartItems({});
      }
    };
    fetchCartAfterLogin();
  }, [token]);

  // ✅ Initial data load with retry logic
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let attemptCount = 0;
      const maxRetryDelay = 10000;
      const baseDelay = 2000;

      const tryFetchData = async () => {
        while (loading) {
          attemptCount++;
          console.log(`Attempt ${attemptCount} to fetch data...`);

          try {
            await fetchFoodList();
            break; // Exit loop on success
          } catch (err) {
            const delay = Math.min(baseDelay * Math.pow(1.5, attemptCount - 1), maxRetryDelay);
            console.log(`Attempt ${attemptCount} failed. Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      };
      
      tryFetchData();
    };
    
    loadData();
  }, []);

  // ✅ Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    
    // Clear state
    setToken("");
    setCartItems({});
    setLocation(null);
    setMapCenter(null);
     setAgentLocations({});
     setOrderStatusUpdates({});
    // Disconnect socket
    if (socket) {
      console.log("🔌 Disconnecting socket on logout");
      socket.disconnect();
      setSocket(null);
    }
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loading,
    socket,
    location,
    setLocation,
    mapCenter,
    setMapCenter,
    isTokenReady,
    agentLocations,
    orderStatusUpdates,
    logout // ✅ Expose logout function
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
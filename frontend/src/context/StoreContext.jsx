// import { useState, createContext, useEffect } from "react";
// import axios from "axios"

// export const StoreContext = createContext(null)

// const StoreContextProvider = (props) => {

//     const [cartItems, setCartItems] = useState({});
//     const url = "https://food-delivery-app-rzv6.onrender.com"
//     const [token, setToken] = useState("")
//     const [food_list, setFoodList] = useState([]);
//      const [loading, setLoading] = useState(true);

//     const addToCart = async (itemId) => {
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
//         }
//         else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
//         }
//         if(token){
//             await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
//         }
//     }

//     const removeFromCart = async (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//         if(token){
//             await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
//         }
//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             if (cartItems[item] > 0) {
//                 let itemInfo = food_list.find((product) => product._id === item);
//                 totalAmount += itemInfo.price * cartItems[item];
//             }
//         }
//         return totalAmount;
//     }

//     const fetchFoodList = async () => {
//         // const response = await axios.get(url + "/api/food/list");
//         // setFoodList(response.data.data);
//         setLoading(true); 
//         try {
//             const response = await axios.get(url + "/api/food/list");
//             setFoodList(response.data.data);
//             setLoading(false);
//         }catch{
//             console.log('error in fetching foodList',error);
//         }
//     }

//     const loadCartData = async (token) => {
//         const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
//         setCartItems(response.data.cartData);
//     }

//     useEffect(() => {
//         async function loadData() {
//             await fetchFoodList();
//             if (localStorage.getItem("token")) {
//                 setToken(localStorage.getItem("token"));
//                 await loadCartData(localStorage.getItem("token"));
//             }
//         }
//         loadData();
//     }, [])
//     const contextValue = {
//         food_list,
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         url,
//         token,
//         setToken
//     }
//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )
// }

// export default StoreContextProvider
import { useState, createContext, useEffect } from "react";
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    // const url = "https://food-delivery-app-rzv6.onrender.com"
    const url = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            console.log("Attempting to fetch food list...");
            const response = await axios.get(url + "/api/food/list", {
                timeout: 30000 // 30 second timeout per request
            });
            setFoodList(response.data.data);
            setLoading(false); // Only set loading to false on success
            console.log("Food list fetched successfully");
            return true;
        } catch (err) {
            console.error("Error fetching food list:", err.message);
            // Don't set loading to false - keep spinner running
            throw err; // Re-throw to continue retry loop
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, {
                headers: { token },
                timeout: 30000
            });
            setCartItems(response.data.cartData);
        } catch (err) {
            console.error("Error loading cart data:", err);
            // Don't fail the whole process if cart loading fails
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            let attemptCount = 0;
            const maxRetryDelay = 10000; // Max 10 seconds between retries
            const baseDelay = 2000; // Start with 2 seconds

            const tryFetchData = async () => {
                while (loading) {
                    attemptCount++;
                    console.log(`Attempt ${attemptCount} to fetch data...`);

                    try {
                        await fetchFoodList();
                        // If successful, load cart data
                        const storedToken = localStorage.getItem("token");
                        if (storedToken) {
                            setToken(storedToken);
                            await loadCartData(storedToken);
                        }
                        break; // Success - exit the loop
                    } catch (err) {
                        // Calculate delay with exponential backoff (but cap it)
                        const delay = Math.min(baseDelay * Math.pow(1.5, attemptCount - 1), maxRetryDelay);
                        console.log(`Attempt ${attemptCount} failed. Retrying in ${delay / 1000} seconds...`);

                        // Wait before next retry
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            };

            tryFetchData();
        };

        loadData();

        // Cleanup - no intervals needed since we're using continuous retry loop
        return () => { };
    }, []);

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
        loading
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider


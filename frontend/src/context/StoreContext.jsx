import { useState, createContext, useEffect } from "react";
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
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
    }

// added for login
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
    }

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
                        const storedToken = localStorage.getItem("token");
                        if (storedToken) {
                            setToken(storedToken);
                            await loadCartData(storedToken);
                        }
                        break;
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


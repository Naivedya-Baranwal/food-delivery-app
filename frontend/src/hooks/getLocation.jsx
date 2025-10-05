// hooks/useGetCity.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from '../context/StoreContext.jsx';
import { useContext } from "react";

export default function useGetLocation() {
  const { token, setLocation, setMapCenter } = useContext(StoreContext);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a function that can be called on user interaction
  const requestLocation = () => {
    if (!token) return;
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
          );
          if (res.data.results && res.data.results.length > 0) {
            const loc = res.data.results[0];
            setLocation(loc);
            setMapCenter([loc.lat, loc.lon]);
          }
        } catch (err) {
          console.error("Error fetching location:", err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Initialize the hook
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [token]);

  // Return the function so it can be called on user interaction
  return { requestLocation };
}

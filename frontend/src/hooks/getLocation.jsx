// hooks/useGetCity.jsx
import { useEffect } from "react";
import axios from "axios";
import { StoreContext } from '../context/StoreContext.jsx';
import { useContext } from "react";

export default function useGetLocation() {
  const { token, setLocation, setMapCenter } = useContext(StoreContext);

  useEffect(() => {
    if (!token) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
        );
        const loc = res.data.results[0];
        setLocation(loc);
        setMapCenter([loc.lat, loc.lon]);
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    });
  }, [token]);

  return;
}

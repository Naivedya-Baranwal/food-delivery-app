// hooks/getLocation.jsx
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from '../context/StoreContext.jsx';

export default function useGetLocation() {
  const { setLocation, setMapCenter } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); 
  const [error, setError] = useState(null);

  // ✅ Function to fetch address from coordinates
  const fetchAddress = useCallback(async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
      );
      
      if (res.data.results && res.data.results.length > 0) {
        const loc = res.data.results[0];
        setLocation(loc);
        setMapCenter([loc.lat, loc.lon]);
        return loc;
      }
      return null;
    } catch (err) {
      console.error("❌ Error fetching address:", err);
      throw err;
    }
  }, [setLocation, setMapCenter]);

  // ✅ Main function to get location
  const requestLocation = useCallback(async (showToast = true) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      if (showToast) toast.error(errorMsg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check permission status first (if supported)
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(permission.state);
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionStatus(permission.state);
          };

          if (permission.state === 'denied') {
            const errorMsg = "Location access denied. Please enable it in your browser settings.";
            setError(errorMsg);
            if (showToast) toast.error(errorMsg);
            setIsLoading(false);
            return null;
          }
        } catch (permErr) {
          console.log("Permission API not fully supported, continuing...");
        }
      }

      // Get current position
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("✅ Location obtained:", { latitude, longitude });
            
            try {
              const location = await fetchAddress(latitude, longitude);
              setIsLoading(false);
              if (showToast && location) {
                toast.success("Location detected successfully! 📍");
              }
              resolve(location);
            } catch (err) {
              setIsLoading(false);
              const errorMsg = "Failed to fetch address";
              setError(errorMsg);
              if (showToast) toast.error(errorMsg);
              reject(err);
            }
          },
          (error) => {
            setIsLoading(false);
            let errorMsg = "Failed to get location";
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg = "Location access denied. Please enable location permissions.";
                setPermissionStatus('denied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg = "Location information unavailable. Please check your device settings.";
                break;
              case error.TIMEOUT:
                errorMsg = "Location request timed out. Please try again.";
                break;
              default:
                errorMsg = "An unknown error occurred while getting location.";
            }
            
            console.error("❌ Geolocation error:", error.message);
            setError(errorMsg);
            if (showToast) toast.error(errorMsg);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

    } catch (err) {
      setIsLoading(false);
      console.error("❌ Error in requestLocation:", err);
      return null;
    }
  }, [fetchAddress]);

  // ✅ Function to check and show permission prompt
  const checkLocationPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return 'prompt'; // Can't check, assume prompt
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);
      return permission.state;
    } catch (err) {
      console.log("Permission check not supported");
      return 'prompt';
    }
  }, []);

  return { 
    requestLocation, 
    checkLocationPermission,
    isLoading, 
    permissionStatus, 
    error 
  };
}
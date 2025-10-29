// hooks/useUpdateLocation.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import backendAxios from "../../utils/credentials.js";
import axios from "axios";

import { 
    setCurrentLocation, 
    setLocationAddress, 
    setFetchingAddress,
    setTracking, 
    setError 
} from "../store/location/locationSlice";

import { updateLiveAgentLocation } from "../store/delivery/deliverySlice"; // ✅ Add this

export const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { acceptedOrder } = useSelector(state => state.delivery); // ✅ Add this
  
  useEffect(() => {
    const userId = user?.id;
    
    if (!isAuthenticated || !userId) {
      console.log("⏳ Waiting for user...");
      return;
    }

    console.log("✅ Starting location tracking for:", user.name);

    // Function to fetch address
    const fetchAddress = async (lat, lon) => {
      try {
        dispatch(setFetchingAddress(true));
        
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`,
          { timeout: 10000 }
        );
        
        const address = response.data.results?.[0]?.formatted || "Unknown location";
        console.log("📍 Address fetched:", address);
        dispatch(setLocationAddress({ address }));
        
      } catch (error) {
        console.error("⚠️ Failed to fetch address:", error.message);
      } finally {
        dispatch(setFetchingAddress(false));
      }
    };

    // Function to update location
    const updateLocation = async (lat, lon) => {
      console.log("📍 New position detected:", { lat, lon });

      // ✅ 1. Update location slice (for UI)
      dispatch(setCurrentLocation({
        lat: Number(lat),
        lon: Number(lon)
      }));

      // ✅ 2. Update delivery slice if agent has active order
      if (acceptedOrder) {
        dispatch(updateLiveAgentLocation({
          lat: Number(lat),
          lon: Number(lon)
        }));
        console.log("🚚 Updated delivery tracking location");
      }

      // ✅ 3. Update backend
      try {
        const response = await backendAxios.post('/api/delivery/updateLocation', {
          lat: Number(lat),
          lon: Number(lon),
          agentId: userId,
        });
        console.log("✅ Backend updated:", response.data);
      } catch (error) {
        console.error("❌ Backend update failed:", error.message);
        dispatch(setError("Failed to sync location with server"));
      }

      // ✅ 4. Fetch address
      fetchAddress(lat, lon);
    };

    dispatch(setTracking(true));

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Initial position:", { latitude, longitude });
        updateLocation(latitude, longitude);
      },
      (error) => {
        if (error.code !== 2) {
          console.error("❌ Initial position error:", error.message);
          dispatch(setError(error.message));
        }
      }
    );

    // Start continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(latitude, longitude);
      },
      (err) => {
        if (err.code !== 2) {
          console.error("❌ Watch position error:", err.message);
          dispatch(setError(err.message));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    );

    console.log("🔄 Started watching position");

    // Cleanup
    return () => {
      if (watchId !== null && watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        dispatch(setTracking(false));
        console.log("🛑 Stopped watching location");
      }
    };
  }, [user, isAuthenticated, acceptedOrder, dispatch]); // ✅ Add acceptedOrder dependency

  return null;
};



// // hooks/useUpdateLocation.jsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import backendaxios from "../../utils/credentials.js";
// import axios from "axios";

// import { 
//     setCurrentLocation, 
//     setLocationAddress, 
//     setFetchingAddress,
//     setTracking, 
//     setError 
// } from "../store/location/locationSlice";

// export const useUpdateLocation = () => {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector(state => state.auth);
  
//   useEffect(() => {
//     const userId = user?.id;
    
//     if (!isAuthenticated || !userId) {
//       console.log("⏳ Waiting for user...");
//       return;
//     }

//     console.log("✅ Starting location tracking for:", user.name);

//     // ✅ Function to fetch address from coordinates
//     const fetchAddress = async (lat, lon) => {
//       try {
//         dispatch(setFetchingAddress(true));
        
//         const response = await axios.get(
//           `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`,
//           { timeout: 10000 }
//         );
//         console.log("fghf",response)
//         const address = response.data.results?.[0]?.formatted || "Unknown location";
        
//         console.log("📍 Address fetched:", address);
        
//         // ✅ Update Redux with address
//         dispatch(setLocationAddress({ address }));
        
//       } catch (error) {
//         console.error("⚠️ Failed to fetch address (non-critical):", error.message);
//         // Don't fail - address is optional
//       } finally {
//         dispatch(setFetchingAddress(false));
//       }
//     };

//     // ✅ Function to update location (Redux + Backend + Address)
//     const updateLocation = async (lat, lon) => {
//       console.log("📍 New position detected:", { lat, lon });

//       // ✅ 1. IMMEDIATELY update Redux (instant UI update)
//       dispatch(setCurrentLocation({
//         lat: Number(lat),
//         lon: Number(lon)
//       }));

//       // ✅ 2. Update backend (in background - non-blocking)
//       try {
//         const response = await backendaxios.post('/api/delivery/updateLocation', {
//           lat: Number(lat),
//           lon: Number(lon),
//           agentId: userId,
//         });
        
//         console.log("✅ Backend updated:", response.data);
        
//       } catch (error) {
//         console.error("❌ Backend update failed (but Redux is updated):", error.message);
//         // Don't throw - Redux already has the location
//         dispatch(setError("Failed to sync with server, but location is tracked locally"));
//       }

//       // ✅ 3. Fetch address (in background - non-blocking)
//       fetchAddress(lat, lon);
//     };

//     // ✅ Mark tracking as started
//     dispatch(setTracking(true));

//     // ✅ Get initial position immediately
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("📍 Initial position:", { latitude, longitude });
//         updateLocation(latitude, longitude);
//       },
//       (error) => {
//         if (error.code !== 2) { // Ignore POSITION_UNAVAILABLE
//           console.error("❌ Initial position error:", error.message);
//           dispatch(setError(error.message));
//         }
//       }
//     );

//     // ✅ Start continuous tracking
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         updateLocation(latitude, longitude);
//       },
//       (err) => {
//         if (err.code !== 2) { // Ignore POSITION_UNAVAILABLE
//           console.error("❌ Watch position error:", err.message);
//           dispatch(setError(err.message));
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 30000,
//         maximumAge: 0
//       }
//     );

//     console.log("🔄 Started watching position");

//     // ✅ Cleanup
//     return () => {
//       if (watchId !== null && watchId !== undefined) {
//         navigator.geolocation.clearWatch(watchId);
//         dispatch(setTracking(false));
//         console.log("🛑 Stopped watching location");
//       }
//     };
//   }, [user, isAuthenticated, dispatch]);

//   return null;
// };

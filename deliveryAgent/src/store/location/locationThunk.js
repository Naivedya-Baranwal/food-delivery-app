// store/location/locationThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/credentials";

// Get current location with address
export const getCurrentLocation = createAsyncThunk(
    "location/getCurrentLocation",
    async (_, { rejectWithValue }) => {
        try {
            // Get coordinates from browser
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;

            // Get address from coordinates
            const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
            );

            const address = response.data.results?.[0]?.formatted || "Unknown location";

            return {
                lat: latitude,
                lon: longitude,
                address
            };

        } catch (error) {
            console.error("Get location error:", error);
            return rejectWithValue(
                error.message || "Failed to get current location"
            );
        }
    }
);

// Update agent location on backend
export const updateAgentLocation = createAsyncThunk(
    "location/updateAgentLocation",
    async ({ lat, lon }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const agentId = auth.user?._id;

            if (!agentId) {
                return rejectWithValue("Agent ID not found");
            }

            // Update backend
            await axios.post('/api/delivery/updateLocation', {
                lat,
                lon,
                agentId
            });

            console.log("Location updated on backend");

            // Get address for this location
            const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
            );

            const address = response.data.results?.[0]?.formatted || "Unknown location";

            return { lat, lon, address };

        } catch (error) {
            console.error("Update location error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to update location"
            );
        }
    }
);

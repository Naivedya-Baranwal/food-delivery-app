// store/location/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentLocation: null, // { lat, lon, address, timestamp }
    isTracking: false,
    isFetchingAddress: false,
    error: null,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        // ✅ Set current location (immediate - before backend call)
        setCurrentLocation: (state, action) => {
            state.currentLocation = {
                ...state.currentLocation, // Keep existing address if available
                lat: action.payload.lat,
                lon: action.payload.lon,
                timestamp: new Date().toISOString()
            };
        },
        
        // ✅ Set address (called after Geoapify API)
        setLocationAddress: (state, action) => {
            if (state.currentLocation) {
                state.currentLocation.address = action.payload.address;
            }
        },

        // ✅ Set fetching address status
        setFetchingAddress: (state, action) => {
            state.isFetchingAddress = action.payload;
        },
        
        // ✅ Start/stop tracking
        setTracking: (state, action) => {
            state.isTracking = action.payload;
        },
        
        // ✅ Set error
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        // ✅ Clear error
        clearError: (state) => {
            state.error = null;
        },

        // ✅ Clear location (on logout)
        clearLocation: (state) => {
            state.currentLocation = null;
            state.isTracking = false;
            state.isFetchingAddress = false;
            state.error = null;
        }
    }
});

export const { 
    setCurrentLocation, 
    setLocationAddress,
    setFetchingAddress,
    setTracking, 
    setError, 
    clearError,
    clearLocation 
} = locationSlice.actions;

export default locationSlice.reducer;

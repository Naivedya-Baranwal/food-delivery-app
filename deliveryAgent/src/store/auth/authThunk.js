import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../utils/credentials";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, {dispatch, rejectWithValue }) =>{
        try{
            const response = await axios.post("api/delivery/login",userData);
             const token = response.data.token;
             console.log("sdfsd",response);
            localStorage.setItem("token", token);
            
            // ✅ Automatically fetch user data after login
            const userDataResult = await dispatch(verifyToken()).unwrap();
            
            return {
                token,
                agent: userDataResult.agent,
                message: response.data.message
            };
        } catch(error){
            return rejectWithValue(error.response?.data?.message || "Login failed. Please try again");
        }
    }
)

// ✅ LOGOUT THUNK
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            // Call backend to update status
            await axios.post("/api/delivery/logout");
            
            // Clear token from localStorage
            localStorage.removeItem("token");
            
            return { message: "Logged out successfully" };
            
        } catch (error) {
            // Even if API fails, clear local data
            localStorage.removeItem("token");
            
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

// ✅ VERIFY TOKEN - Get user data
export const verifyToken = createAsyncThunk(
    "auth/verifyToken",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found");
            }
            const response = await axios.get("/api/delivery/verify");
            return response.data; 
        } catch (error) {
            // Token invalid or expired - clear it
            localStorage.removeItem("token");
            return rejectWithValue(error.response?.data?.message || 
                "Session expired. Please login again");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) =>{
        try{
            const response = await axios.post("api/delivery/register",userData);
            return response.data;
        } catch(error){
            return rejectWithValue(error.response?.data?.message || "Registration failed. Please try again");
        }
    } 
)



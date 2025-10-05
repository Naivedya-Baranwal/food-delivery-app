import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../utils/credentials";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) =>{
        try{
            const response = await axios.post("api/delivery/login",userData);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
            } 
        return response.data;
        } catch(error){
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) =>{
        try{
            const response = await axios.post("api/delivery/register",userData);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch(error){
            return rejectWithValue(error.response?.data?.message || "Signup failed");
        }
    }
)

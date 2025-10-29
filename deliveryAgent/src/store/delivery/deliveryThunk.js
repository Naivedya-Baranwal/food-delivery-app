import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/credentials.js"
import { io } from 'socket.io-client';
import { setSocket, addNewOrderFromSocket } from './deliverySlice.js';

export const getAllAssignments = createAsyncThunk(
    "delivery/getAllAssignment",
    async (_,{rejectWithValue})=>{
        try {
          const response = await axios.get("/api/order/getDeliveryAssignments");
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || "failed. Please try again");
        }
    }
)

// ✅ Accept assignment
export const acceptAssignmentThunk = createAsyncThunk(
    "delivery/acceptAssignment",
    async (assignmentId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/order/acceptAssignment/${assignmentId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to accept assignment");
        }
    }
);

// ✅ get currently accepted assignment
export const getCurrentAssignmentThunk = createAsyncThunk(
    "delivery/getCurrentAssignment",
    async (_,{ rejectWithValue }) => {
        try {
            const response = await axios.get("/api/order/getCurrentAssignment");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to accept assignment");
        }
    }
);


// ✅ Get delivery history
export const getDeliveryHistoryThunk = createAsyncThunk(
    "delivery/getDeliveryHistory",
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/order/deliveryHistory?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch delivery history");
        }
    }
);

// ✅ Get today's deliveries
export const getTodayDeliveriesThunk = createAsyncThunk(
    "delivery/getTodayDeliveries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/order/todayDeliveries");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch today's deliveries");
        }
    }
);



// ✅ NEW: Initialize socket connection
export const initializeSocketThunk = createAsyncThunk(
    "delivery/initializeSocket",
    async (_, { dispatch, getState }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No token found');
            }

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

            const socketInstance = io(BACKEND_URL, {
                auth: { token },
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => {
                console.log('✅ Agent socket connected:', socketInstance.id);
            });

            socketInstance.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error.message);
            });

            // ✅ Listen for new order broadcasts
            socketInstance.on('newOrderAvailable', (data) => {
                console.log('📦 New order broadcast received:', data);
                dispatch(addNewOrderFromSocket(data.assignment));
                
                // Optional: Show notification
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("New Order Available!", {
                        body: `Order from ${data.order.name} - ₹${data.order.amount}`,
                        silent: true,
                    });
                }
            });

            socketInstance.on('disconnect', (reason) => {
                console.log('🔌 Agent socket disconnected:', reason);
            });

            dispatch(setSocket(socketInstance));
            
            return { success: true };
        } catch (error) {
            console.error('❌ Socket initialization error:', error);
            throw error;
        }
    }
);
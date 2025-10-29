// store/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, verifyToken, logoutUser } from "./authThunk";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token")||false,
    loading: false,
    initialLoading: true,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Clear messages
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    
          // ✅ Set initial loading done
        setInitialLoadingDone: (state) => {
            state.initialLoading = false;
        },
    },
    
    extraReducers: (builder) => {
        builder
            // ========== LOGIN ==========
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.agent;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.successMessage = action.payload.message; // ✅ Store message
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // ✅ Error message from backend
                state.isAuthenticated = false;
                state.successMessage = null;
            })

             // ✅ LOGOUT
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.successMessage =null;
            })
            .addCase(logoutUser.rejected, (state) => {
                // Even if logout fails on server, clear frontend state
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

             // ========== VERIFY TOKEN ==========
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.initialLoading = false;
                state.user = action.payload.agent;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(verifyToken.rejected, (state) => {
                state.loading = false;
                state.initialLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // ========== REGISTER ==========
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message; // ✅ Store message
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // ✅ Error message from backend
                state.successMessage = null;
            });
    },
});

export const { clearMessages, setInitialLoadingDone } = authSlice.actions;
export default authSlice.reducer;

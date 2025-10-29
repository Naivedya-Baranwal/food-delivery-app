// store/delivery/deliverySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getAllAssignments,acceptAssignmentThunk,getCurrentAssignmentThunk,
    getDeliveryHistoryThunk, getTodayDeliveriesThunk, initializeSocketThunk   } from "./deliveryThunk.js";

const initialState = {
    assignments: [],
    acceptedOrder: null,
    deliveryAgentLocation:null,
    UserLocation:null,
    accepting:false,
    loadingData:false,
    loading: false,
    error: null,
    dataError:null,

    // ✅ Add delivery history state
    deliveryHistory: [],
    historyLoading: false,
    historyError: null,
    historyPagination: null,
    
    // ✅ Add today's deliveries state
    todayDeliveries: null,
    todayLoading: false,
    todayError: null,

    // ✅ NEW: Socket state
    socket: null,
    socketConnected: false,
};

const deliverySlice = createSlice({
    name: "delivery",
    initialState,
     reducers: {
        updateLiveAgentLocation: (state, action) => {
            if (state.acceptedOrder) {
                state.deliveryAgentLocation = {
                    lat: action.payload.lat,
                    lon: action.payload.lon
                };
            }
        },
        clearAcceptedOrder: (state) => {
            state.acceptedOrder = null;
            state.deliveryAgentLocation = null;
            state.UserLocation = null;
        },
        clearErrors: (state) => {
            state.error = null;
            state.dataError = null;
            state.historyError = null;
            state.todayError = null;
        },

         // ✅ NEW: Socket actions
        setSocket: (state, action) => {
            state.socket = action.payload;
            state.socketConnected = true;
        },
        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
            }
            state.socket = null;
            state.socketConnected = false;
        },
        // ✅ NEW: Add new order from socket
        addNewOrderFromSocket: (state, action) => {
            const newAssignment = action.payload;
            const exists = state.assignments.some(a => a._id === newAssignment._id);
            if (!exists) {
                state.assignments.unshift(newAssignment);
            }
        },
        // ✅ NEW: Remove order when accepted by another agent
        removeOrderFromSocket: (state, action) => {
            const assignmentId = action.payload;
            state.assignments = state.assignments.filter(a => a._id !== assignmentId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAssignments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.assignments = action.payload.data || []; 
                
            })
            .addCase(getAllAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch assignments";
            })
             // ✅ ACCEPT ASSIGNMENT
            .addCase(acceptAssignmentThunk.pending, (state) => {
                state.accepting = true;
                state.error = null;
            })
            .addCase(acceptAssignmentThunk.fulfilled, (state, action) => {
                state.accepting =false;
            })
            .addCase(acceptAssignmentThunk.rejected, (state, action) => {
                state.accepting = false;
                state.error = action.payload || "Failed to accept assignment";
            })

            // getCurrentAcceptedAssignment
               .addCase(getCurrentAssignmentThunk.pending, (state) => {
                state.loadingData = true;
                state.dataError = null;
            })
            .addCase(getCurrentAssignmentThunk.fulfilled, (state, action) => {
                state.loadingData=false;
                state.dataError = null;
                if(action.payload.assignment){
                state.acceptedOrder = action.payload.assignment;
                state.UserLocation = action.payload.UserLocation;
                if (!state.deliveryAgentLocation) {
                        state.deliveryAgentLocation = action.payload.deliveryAgentLocation;
                }  // Remove accepted assignment from list
                state.assignments = state.assignments.filter(
                    a => a._id !== action.payload.assignment._id
                );
                }
                else {
                    state.acceptedOrder = null;
                    state.UserLocation = null;
                    state.deliveryAgentLocation = null;
                }
            })
           .addCase(getCurrentAssignmentThunk.rejected, (state, action) => {
                state.loadingData = false;
                state.dataError = action.payload || "Failed to get current assignment";
            })
            
          // ✅ GET DELIVERY HISTORY
            .addCase(getDeliveryHistoryThunk.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(getDeliveryHistoryThunk.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.deliveryHistory = action.payload.data;
                state.historyPagination = action.payload.pagination;
            })
            .addCase(getDeliveryHistoryThunk.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload || "Failed to fetch delivery history";
            })

            // ✅ GET TODAY'S DELIVERIES
            .addCase(getTodayDeliveriesThunk.pending, (state) => {
                state.todayLoading = true;
                state.todayError = null;
            })
            .addCase(getTodayDeliveriesThunk.fulfilled, (state, action) => {
                state.todayLoading = false;
                state.todayDeliveries = action.payload.data;
            })
            .addCase(getTodayDeliveriesThunk.rejected, (state, action) => {
                state.todayLoading = false;
                state.todayError = action.payload || "Failed to fetch today's deliveries";
            });
        }
});

export const {
    updateLiveAgentLocation,
    clearAcceptedOrder,
    clearErrors,
    setSocket,
    disconnectSocket,
    addNewOrderFromSocket,
    removeOrderFromSocket,
} = deliverySlice.actions;
export default deliverySlice.reducer;

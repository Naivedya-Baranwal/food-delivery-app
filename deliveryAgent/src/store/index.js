// store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/auth/authSlice';
import locationReducer from '../store/location/locationSlice';
import deliveryReducer from '../store/delivery/deliverySlice';
import { logoutUser } from '../store/auth/authThunk';

const appReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  delivery: deliveryReducer,
});

const rootReducer = (state, action) => {
  if (action.type === logoutUser.fulfilled.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore socket in serialization checks
        ignoredActions: ['delivery/setSocket'],
        ignoredActionPaths: ['payload.socket'],
        ignoredPaths: ['delivery.socket'],
      },
    }),
});

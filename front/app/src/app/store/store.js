import { configureStore } from '@reduxjs/toolkit';
import payReducer from '../../features/pay/store/paySlice';
import authReducer from '../../features/auth/store/authSlice'; // ← 추가

const store = configureStore({
  reducer: {
    pay: payReducer,
    auth: authReducer,
  },
});

export default store;

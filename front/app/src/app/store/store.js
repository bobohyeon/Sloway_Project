import { configureStore } from '@reduxjs/toolkit';
import payReducer from '../../features/pay/store/paySlice';

const store = configureStore({
  reducer: {
    pay: payReducer,
  },
});

export default store;

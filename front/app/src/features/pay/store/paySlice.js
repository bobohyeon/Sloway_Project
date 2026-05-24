import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'init',
  result: null,
  error: null,
};

const paySlice = createSlice({
  name: 'pay',
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetPay: () => initialState,
  },
});

export const { setStatus, setResult, setError, resetPay } = paySlice.actions;
export default paySlice.reducer;

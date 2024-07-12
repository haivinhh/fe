import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      allCart: null,
      isFetching: false,
      error: false,
      
    },
  },
  reducers: {
    getCartStart: (state) => {
      state.cart.isFetching = true;
    },
    getCartSuccess: (state, action) => {
      state.cart.isFetching = false;
      state.cart.allCart = action.payload;
    },
    getCartFailed: (state) => {
      state.cart.isFetching = false;
      state.cart.allCart = null;
      state.cart.error = true;
    },
    getCartLogout: (state) => {
      state.cart.isFetching = false;
      state.cart.allCart = null;
      state.cart.error = true;
    },
    
  },
});

export const {
  getCartStart,
  getCartSuccess,
  getCartFailed,
  getCartLogout,
  
} = cartSlice.actions;

export default cartSlice.reducer;

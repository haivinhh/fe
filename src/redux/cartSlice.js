import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      allCart: null,
      isFetching: false,
      error: false,
      selectedOrderId: null, // Thêm thuộc tính selectedOrderId vào initialState
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
    setSelectedOrderId: (state, action) => {
      state.cart.selectedOrderId = action.payload; // Cập nhật selectedOrderId
    },
  },
});

export const {
  getCartStart,
  getCartSuccess,
  getCartFailed,
  getCartLogout,
  setSelectedOrderId, // Xuất action setSelectedOrderId
} = cartSlice.actions;

export default cartSlice.reducer;

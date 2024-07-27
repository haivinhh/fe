import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    isFetching: false,
    error: null,
  },
  reducers: {
    getProductsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getProductsSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    getProductsFailed: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailed,
} = productSlice.actions;

export default productSlice.reducer;

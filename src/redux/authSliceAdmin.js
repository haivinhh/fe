import { createSlice } from "@reduxjs/toolkit";

const authSliceAdmin = createSlice({
  name: "authAdmin",
  initialState: {
    loginAdmin:{
      currentUser: null,
      isFetching: false,
      error: false,
    }
  },
  reducers: {
    //loginadmin
    loginAdminStart: (state) => {
      state.loginAdmin.isFetching = true;
    },
    loginAdminSuccess: (state, action) => {
      state.loginAdmin.isFetching = false;
      state.loginAdmin.currentUser = action.payload;
      state.loginAdmin.error = false;
    },
    loginAdminFailed: (state) => {
      state.loginAdmin.isFetching = false;
      state.loginAdmin.error = true;
    },
    //logout admin
    logOutAdminStart: (state) => {
      state.loginAdmin.isFetching = true;
    },
    logOutAdminSuccess: (state) => {
      state.loginAdmin.isFetching = false;
      state.loginAdmin.currentUser = null;
      state.loginAdmin.error = false;
    },
    logOutAdminFailed: (state) => {
      state.loginAdmin.isFetching = false;
      state.loginAdmin.error = true;
    },

  },
});

export const {
  
  loginAdminStart,
  loginAdminSuccess,
  loginAdminFailed,
  logOutAdminStart,
  logOutAdminSuccess,
  logOutAdminFailed,

} = authSliceAdmin.actions;

export default authSliceAdmin.reducer;

import http from "../../HTTP/http";
import { loginFailed, loginStart, loginSuccess,logOutStart,logOutSuccess,logOutFailed } from "../authSlice";


export const loginAdmin = async (userName, passWord, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await http.post("/api/login", { userName, passWord });
    dispatch(loginSuccess(res.data));
    return true; // Return true if login is successful
  } catch (err) {
    dispatch(loginFailed(err.message));
    return false; // Return false if login fails
  }
};
export const logOut = async (dispatch, idNhanVien, navigate, accessToken, axiosJWT) => {
  dispatch(logOutStart());
  try {
    // Ensure you're passing the ID in the correct format (object or JSON)
    await axiosJWT.post("/api/logout", idNhanVien , {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logOutSuccess()); 
    navigate("/"); // Navigate to the desired route after successful logout
  } catch (err) {
    dispatch(logOutFailed());
  }
};
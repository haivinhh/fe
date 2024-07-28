import http from "../../HTTP/http";
import { loginAdminFailed, loginAdminStart, loginAdminSuccess,logOutAdminStart,logOutAdminSuccess,logOutAdminFailed } from "../authSliceAdmin";


export const loginAdmin = async (userName, passWord, dispatch) => {
  dispatch(loginAdminStart());
  try {
    const res = await http.post("/api/login", { userName, passWord });
    dispatch(loginAdminSuccess(res.data));
    return true; // Return true if login is successful
  } catch (err) {
    dispatch(loginAdminFailed(err.message));
    return false; // Return false if login fails
  }
};
export const logOut = async (dispatch, idNhanVien, navigate, accessToken, axiosJWT) => {
  dispatch(logOutAdminStart());
  try {
    // Ensure you're passing the ID in the correct format (object or JSON)
    await axiosJWT.post("/api/logout", idNhanVien , {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logOutAdminSuccess()); 
    navigate("/"); // Navigate to the desired route after successful logout
  } catch (err) {
    dispatch(logOutAdminFailed());
  }
};
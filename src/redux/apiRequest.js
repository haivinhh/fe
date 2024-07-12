import http from "../HTTP/http"; // Ensure this import is correct based on your configuration
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutStart,
  logOutFailed,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import { getCartStart, getCartSuccess, getCartFailed,getCartLogout} from "./cartSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await http.post("/api/cuslogin", user);
    dispatch(loginSuccess(res.data));
    return { status: "success" };
  } catch (err) {
    dispatch(loginFailed());
    return { status: "failed", error: err.response.data };
  }
};

export const registerCus = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await http.post("/api/cusregister", user);
    dispatch(registerSuccess());
  } catch (error) {
    dispatch(registerFailed());
  }
};
export const logOutCus = async (dispatch, idUser, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
      await axiosJWT.post("/api/cuslogout", idUser, {
        headers: { token: `Bearer ${accessToken}` },
      });
      dispatch(logOutSuccess());
      dispatch(getCartLogout());
      navigate("/");
    } catch (err) {
      dispatch(logOutFailed());
    }
  };
  

export const getCart = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getCartStart());
  try {
    const res = await axiosJWT.get("/api/cart", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getCartSuccess(res.data));
  } catch (err) {
    dispatch(getCartFailed());
  }
};
export const addToCart = async (idSanPham, soLuong, accessToken, axiosJWT, dispatch) => {
    try {
      const response = await axiosJWT.post("/api/cart/add", { idSanPham, soLuong }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      // Assuming backend returns success: true for successful addition
      if (response.data.success) {
        return { success: true }; // Returning true for success
      } else {
        return { success: false, error: "Failed to add to cart" }; // Return false and error message for failure
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, error: err.response?.data || err.message }; // Return false and error message for any error
    }
  };
  export const updateCartItem = async (idChiTietDH, soLuong, accessToken) => {
    try {
      const response = await http.put("/api/cart/updatecartitem", { idChiTietDH, soLuong }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      // Giả sử backend trả về success: true nếu cập nhật thành công
      if (response.data.success) {
        // Tùy chọn: cập nhật lại giỏ hàng sau khi cập nhật
        // await getCart(accessToken); // Ví dụ cập nhật lại giỏ hàng sau khi cập nhật
        return { success: true }; // Trả về true nếu thành công
      } else {
        return { success: false, error: "Cập nhật sản phẩm trong giỏ hàng thất bại" }; // Trả về false và thông báo lỗi nếu thất bại
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", err);
      return { success: false, error: err.response?.data || err.message }; // Trả về false và thông báo lỗi nếu có bất kỳ lỗi nào xảy ra
    }
  };
  
  export const deleteCartItem = async (idChiTietDH, accessToken,axiosJWT) => {
    try {
      const response = await axiosJWT.delete("/api/cart/deletecartitem", {
        headers: {
          token: `Bearer ${accessToken}`,
          
        },
        data: { idChiTietDH }, 
      });
  
     
      if (response.data.success) {
        
        return { success: true }; 
      } else {
        return { success: false, error: "Xóa sản phẩm trong giỏ hàng thất bại" }; // Trả về false và thông báo lỗi nếu thất bại
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", err);
      return { success: false, error: err.response?.data || err.message }; // Trả về false và thông báo lỗi nếu có bất kỳ lỗi nào xảy ra
    }
  };
  



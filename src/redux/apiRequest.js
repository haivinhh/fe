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
import {
  getCartStart,
  getCartSuccess,
  getCartFailed,
  getCartLogout,
} from "./cartSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await http.post("/api/cuslogin", user);
    dispatch(loginSuccess(res.data));

    // Create order after successful login
    const createOrderResult = await createOrder(
      res.data.accessToken,
      http,
      res.data.idUser
    );
    if (!createOrderResult.success) {
      console.error(
        "Failed to create order after login:",
        createOrderResult.error
      );
    }

    return { status: "success" };
  } catch (err) {
    dispatch(loginFailed());
    return { status: "failed", error: err.response.data };
  }
};

export const createOrder = async (accessToken, axiosJWT, idUser) => {
  try {
    // Make API request to create order
    const response = await axiosJWT.post(
      "/api/cart/createorder",
      { idUser },
      {
        headers: {
          token: `Bearer ${accessToken}`, // Use Authorization header for token
        },
      }
    );

    // Check if response indicates success
    if (response.status === 201) {
      return { success: true, cart_id: response.data.cart_id };
    } else {
      return { success: false, error: response.data.message || "Tạo đơn hàng thất bại" };
    }
  } catch (err) {
    console.error("Lỗi khi tạo đơn hàng:", err);
    return { success: false, error: err.response?.data.message || err.message };
  }
};

export const registerCus = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await http.post("/api/cusregister", user);
    dispatch(registerSuccess());
    return { success: true }; // Return success status
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
    dispatch(registerFailed(errorMessage));
    return { success: false, message: errorMessage }; // Return error status and message
  }
};

export const logOutCus = async (
  dispatch,
  idUser,
  navigate,
  accessToken,
  axiosJWT
) => {
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

export const getDetailCart = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getCartStart());
  try {
    const res = await axiosJWT.get("/api/detailcart", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getCartSuccess(res.data));
  } catch (err) {
    dispatch(getCartFailed());
  }
};
export const getDetailCartOfUser = async (accessToken, idDonHang, dispatch, axiosJWT) => {
  dispatch(getCartStart());
  try {
    const res = await axiosJWT.get(`/api/getdetailcart/${idDonHang}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getCartSuccess(res.data));
  } catch (err) {
    dispatch(getCartFailed());
  }
};

export const addToCart = async (
  idSanPham,
  soLuong,
  accessToken,
  axiosJWT,
  dispatch
) => {
  try {
    const response = await axiosJWT.post(
      "/api/cart/add",
      { idSanPham, soLuong },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    

    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to add to cart" };
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    return { success: false, error: err.response?.data || err.message };
  }
};

export const updateCartItem = async (
  idChiTietDH,
  soLuong,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.put(
      "/api/cart/updatecartitem",
      { idChiTietDH, soLuong },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Cập nhật sản phẩm trong giỏ hàng thất bại",
      };
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", err);
    return { success: false, error: err.response?.data || err.message };
  }
};

export const deleteCartItem = async (idChiTietDH, accessToken, axiosJWT) => {
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
      return { success: false, error: "Xóa sản phẩm trong giỏ hàng thất bại" };
    }
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", err);
    return { success: false, error: err.response?.data || err.message };
  }
};
export const getCusById = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.get(`/api/getcusbyid`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};
export const getCart = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.get(`/api/cart`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

export const changePassword = async (
  currentPassword,
  newPassword,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.post(
      "/api/changepassword",
      { currentPassword, newPassword },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    // Extract message from response data
    const { message } = response.data;

    // Check if the password change was successful
    if (message === "Password changed successfully.") {
      return { success: true };
    } else {
      return { success: false, error: message };
    }
  } catch (err) {
    console.error("Error changing password:", err);
    // Handle cases where server error messages are present
    const errorMessage = err.response?.data?.message || err.message;
    return { success: false, error: errorMessage };
  }
};
export const updateUser = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.put(
      "/api/updateuser",
      idUser,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    const { message } = response.data;

    if (message === "Cập nhật thông tin thành công.") {
      return { success: true, message: "Cập nhật thông tin thành công" };
    }else if(message ==="Địa chỉ email không hợp lệ")
      {
        return { success: false, message: message || "Địa chỉ email không hợp lệ" };
      } else  {
      return { success: false, message: message || "Cập nhật thông tin thất bại" };
    }
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};





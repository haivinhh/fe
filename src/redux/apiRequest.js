
import http from "../HTTP/http"; // Giả sử import này đúng dựa trên cấu hình của bạn
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { getCartStart, getCartSuccess,getCartFailed } from "./cartSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res =  await http.post("/api/cuslogin",user);
        dispatch(loginSuccess(res.data));
        return { status: "success"};
        
    }catch(err){
        dispatch(loginFailed());
        return { status: "failed", error: err.response.data };

    }
};

export const registerCus = async (user,dispatch,navigate) => {
    dispatch(registerStart());
    try {
        await http.post("/api/cusregister",user);
        dispatch(registerSuccess());
        
    } catch (error) {
        dispatch(registerFailed());
    }
};

export const getCart = async (accessToken, dispatch) => {
    dispatch(getCartStart());
    try {
        const res = await http.get("/api/cart",{
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(getCartSuccess(res.data));

    } catch (err) {
        dispatch(getCartFailed());
    }
}


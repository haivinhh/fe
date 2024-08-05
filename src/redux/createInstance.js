import axios from "axios";
import { jwtDecode } from "jwt-decode";
import http from "../HTTP/http";
import { useNavigate } from 'react-router-dom';
import { logOutAdminSuccess} from "../redux/authSliceAdmin";

const refreshTokenCus = async () => {
    try {
      const res = await http.post("/api/refreshtokencus", {});
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const refreshToken = async () => {
    try {
      const res = await http.post("/api/refreshtoken", {});
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
export const createAxios = (currentUser,dispatch,stateSuccess)  => {
    const newInstance = axios.create({
        baseURL: "http://localhost:3001",
        withCredentials: true
    });
    newInstance.interceptors.request.use(
        async (config) => {
          let date = new Date();
          const decodedToken = jwtDecode(currentUser?.accessToken);
          if (decodedToken.exp < date.getTime() / 1000) {
            const data = await refreshTokenCus();
            const refreshCustomer = {
              ...currentUser,
              accessToken: data.accessToken,
            };
            console.log(refreshCustomer)
            dispatch(stateSuccess(refreshCustomer));
            config.headers["token"] = "Bearer " + data.accessToken;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );
      return newInstance;
};
export const createAxiosAdmin = (currentUser, stateSuccess, dispatch) => {
  const newInstance = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
  });

  newInstance.interceptors.request.use(
    async (config) => {
      const date = new Date();
      const decodedToken = jwtDecode(currentUser?.accessToken);

      // Check if the access token is expired
      if (decodedToken.exp < date.getTime() / 1000) {
        // If token is expired, logout
        dispatch(logOutAdminSuccess());
        return Promise.reject(new Error("Token expired, logging out"));
      } else {
        // If token is still valid but close to expiring, refresh it
        const tokenExpiresIn = decodedToken.exp - date.getTime() / 1000;
        const refreshThreshold = 120; // Refresh if less than 60 seconds

        if (tokenExpiresIn < refreshThreshold) {
          try {
            const data = await refreshToken();
            const refreshedUser = {
              ...currentUser,
              accessToken: data.accessToken,
            };
            dispatch(stateSuccess(refreshedUser));
            config.headers["token"] = "Bearer " + data.accessToken;
          } catch (error) {
            console.error("Error refreshing token:", error);
            dispatch(logOutAdminSuccess());
            return Promise.reject(error); // Exit the request chain
          }
        } else {
          config.headers["token"] = "Bearer " + currentUser.accessToken;
        }
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  newInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        dispatch(logOutAdminSuccess());
      }
      return Promise.reject(error);
    }
  );

  return newInstance;
};
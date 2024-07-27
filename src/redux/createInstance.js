import axios from "axios";
import { jwtDecode } from "jwt-decode";
import http from "../HTTP/http";
import { useNavigate } from 'react-router-dom';
import { logOutSuccess} from "../redux/authSlice";

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
        try {
          const data = await refreshToken();
          const refreshedUser = {
            ...currentUser,
            accessToken: data.accessToken,
          };
          dispatch(stateSuccess(refreshedUser));
          config.headers["token"] = "Bearer " + data.accessToken;
        } catch (error) {
          dispatch(logOutSuccess());
          console.log("out r")
          return Promise.reject(error); // Exit the request chain
        }
      } else {
        config.headers["token"] = "Bearer " + currentUser.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  newInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        dispatch(logOutSuccess());
        console.log("out r")
      }
      return Promise.reject(error);
    }
  );

  return newInstance;
};
export const checkRefreshToken = async (currentUser, dispatch, navigate,stateSuccess) => {
  const decodedToken = jwtDecode(currentUser?.accessToken);
  const date = new Date();

  if (decodedToken.exp < date.getTime() / 1000) {
    try {
      const data = await refreshToken();
      const refreshedUser = {
        ...currentUser,
        accessToken: data.accessToken,
      };
      dispatch(stateSuccess(refreshedUser));
    } catch (error) {
      dispatch(logOutSuccess());
      navigate("/admin");
      return false;
    }
  }
  return true;
};
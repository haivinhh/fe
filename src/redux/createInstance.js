import axios from "axios";
import { jwtDecode } from "jwt-decode";
import http from "../HTTP/http";


const refreshToken = async () => {
    try {
      const res = await http.post("/api/refreshtokencus", {});
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
            const data = await refreshToken();
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
}
import axios from "axios"

const http = axios.create({
  baseURL: "https://be-lvtn.onrender.com",
  withCredentials: true,
});


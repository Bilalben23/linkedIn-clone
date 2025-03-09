import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://192.168.8.100:5000",
    withCredentials: true
})

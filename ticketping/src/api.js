import Axios from "axios";
import { API_HOST } from "./constant/Constants";

export const axiosInstance = Axios.create({
  baseURL: API_HOST,
  withCredentials: true
});
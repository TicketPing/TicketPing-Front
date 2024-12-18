import Axios from "axios";
import { API_HOST } from "./Constants";

export const axiosInstance = Axios.create({
  baseURL: API_HOST,
  withCredentials: true
});
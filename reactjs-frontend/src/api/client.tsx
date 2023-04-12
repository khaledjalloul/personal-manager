import axios, { AxiosInstance } from "axios";

const API_URL = process.env.REACT_APP_API_URL;

let client: AxiosInstance

export default client = axios.create({
  baseURL: API_URL,
});

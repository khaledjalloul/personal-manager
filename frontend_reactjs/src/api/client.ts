import axios, { AxiosInstance } from "axios";

let client: AxiosInstance;

client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default client;

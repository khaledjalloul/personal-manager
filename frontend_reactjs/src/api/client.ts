import axios, { AxiosInstance } from "axios";

let client: AxiosInstance;

const { REACT_APP_API_URL } = process.env;
client = axios.create({
  baseURL: REACT_APP_API_URL,
});

export default client;

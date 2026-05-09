import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
});

// You can add an auth interceptor here later
export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://hiring-dashboard-project.onrender.com/api",
  timeout: 5000,
});

// You can add an auth interceptor here later
export default API;

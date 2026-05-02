import axios from "axios";

// Base URL for all API calls
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

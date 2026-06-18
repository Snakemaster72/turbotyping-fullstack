import axios from "axios";
import axiosInstance from "../../utils/axiosConfig.js";

const API_URL = "/api/users/";

// Uses axiosInstance so the request interceptor attaches the token automatically.
// Previously used bare axios with localStorage.getItem("token") — but "token" is
// never written by login/register (they write to "user"), so every call sent
// "Authorization: Bearer null" → server threw JsonWebTokenError: jwt malformed.
const getMe = async () => {
  const response = await axiosInstance.get(API_URL + "me");
  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await axiosInstance.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axiosInstance.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  // Login writes to "user"; the old code removed "token" (never set), so
  // the session persisted in localStorage after logout. Remove the right key.
  localStorage.removeItem("user");
};

// Set token for authenticated requests
const setToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const authService = {
  register,
  login,
  logout,
  getMe,
  setToken,
};

export default authService;

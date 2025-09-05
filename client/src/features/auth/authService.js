import axios from "axios";

const API_URL = "/api/users/";

// Get user data
// When the user has logged in before, we can fetch their data so they don't have to log in again
const getMe = async () => {
  const response = await axios.get(API_URL + "me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

//logout
const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
  getMe
};

export default authService;

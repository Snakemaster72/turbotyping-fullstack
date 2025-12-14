// utils/getUsername.js
// utils/getUsername.js
import axios from "axios";
import axiosInstance from "./axiosConfig";
export const getUsername = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const response = await axiosInstance.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    // Handle error, e.g., redirect to login if unauthorized
  }
};

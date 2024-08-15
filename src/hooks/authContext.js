"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      { refresh_token: refreshToken }
    );

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    const refreshInterval = setInterval(async () => {
      await refreshToken();
    }, 59 * 60 * 1000); // 59 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
